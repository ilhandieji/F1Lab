/**
 * Upload local headshots to Arvan object storage and upsert driver_portrait rows.
 * Uses ARVAN_* and DATABASE_URL from .env (never exposed to the website).
 *
 * Usage:
 *   node scripts/sync-driver-portraits.mjs --dry-run
 *   node scripts/sync-driver-portraits.mjs
 *   node scripts/sync-driver-portraits.mjs --source ./headshots-webp
 *   node scripts/sync-driver-portraits.mjs --db-only --source ./headshots-webp
 */

import "dotenv/config";
import { createReadStream } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const dbOnly = args.includes("--db-only");
const sourceArg = args.find((a) => a.startsWith("--source="));
const sourceRoot = sourceArg
  ? path.resolve(sourceArg.slice("--source=".length))
  : path.join(repoRoot, "headshots-webp");

function parseAbbrevFromLongName(baseName) {
  const stem = baseName.replace(/\.webp$/i, "");
  const withoutDigits = stem.replace(/\d+$/, "");
  if (withoutDigits.length >= 3) {
    return withoutDigits.slice(-3).toUpperCase();
  }
  return null;
}

function parseAbbrevFromFile(relativePath, fileName) {
  const base = fileName.replace(/\.webp$/i, "");
  if (/^[A-Z]{3}$/.test(base)) return base;
  return parseAbbrevFromLongName(fileName);
}

async function collectWebpFiles(root) {
  const entries = [];
  let years;
  try {
    years = (await readdir(root)).filter((name) => /^[0-9]{4}$/.test(name));
  } catch (error) {
    throw new Error(`Cannot read source directory ${root}: ${error.message}`);
  }

  for (const year of years.sort()) {
    const yearDir = path.join(root, year);
    for (const name of await readdir(yearDir)) {
      if (!name.endsWith(".webp")) continue;
      entries.push({
        year,
        filePath: path.join(yearDir, name),
        fileName: name,
        source: `${year}/${name}`,
      });
    }
    const byRefDir = path.join(yearDir, "by_ref");
    try {
      for (const name of await readdir(byRefDir)) {
        if (!name.endsWith(".webp")) continue;
        entries.push({
          year,
          filePath: path.join(byRefDir, name),
          fileName: name,
          source: `${year}/by_ref/${name}`,
        });
      }
    } catch {
      // no by_ref folder
    }
  }
  return entries;
}

/** Prefer year-root three-letter files over by_ref duplicates. */
function dedupeEntries(entries) {
  const byKey = new Map();
  for (const entry of entries) {
    const abbrev = parseAbbrevFromFile(entry.source, entry.fileName);
    if (!abbrev) continue;
    const key = `${entry.year}:${abbrev}`;
    const isShortRoot = /^[A-Z]{3}\.webp$/.test(entry.fileName) && !entry.source.includes("/by_ref/");
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, { ...entry, abbrev });
      continue;
    }
    const existingShort =
      /^[A-Z]{3}\.webp$/.test(existing.fileName) && !existing.source.includes("/by_ref/");
    if (isShortRoot && !existingShort) {
      byKey.set(key, { ...entry, abbrev });
    }
  }
  return [...byKey.values()];
}

async function loadSeasonDriverMap(client) {
  const result = await client.query(`
    SELECT sd.year, sd.driver_id, d.abbreviation
    FROM season_driver sd
    JOIN driver d ON d.id = sd.driver_id
  `);
  const map = new Map();
  for (const row of result.rows) {
    map.set(`${row.year}:${row.abbreviation}`, row.driver_id);
  }
  return map;
}

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name} in environment`);
  return value;
}

function createS3() {
  return new S3Client({
    region: requireEnv("ARVAN_REGION"),
    endpoint: requireEnv("ARVAN_ENDPOINT"),
    credentials: {
      accessKeyId: requireEnv("ARVAN_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("ARVAN_SECRET_ACCESS_KEY"),
    },
    forcePathStyle: true,
  });
}

async function readWebpDimensions(filePath) {
  const buffer = await readFile(filePath);
  if (buffer.length < 30) return null;
  // RIFF....WEBP
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") {
    return { valid: false, bytes: buffer.length };
  }
  // VP8X extended or VP8 / VP8L chunk — use identify-style fallback via VP8L/VP8
  let width = null;
  let height = null;
  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const tag = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    if (tag === "VP8X" && size >= 10) {
      width = 1 + buffer.readUIntLE(offset + 8 + 4, 3);
      height = 1 + buffer.readUIntLE(offset + 8 + 7, 3);
      break;
    }
    if (tag === "VP8 " && size >= 10) {
      height = buffer.readUInt16LE(offset + 8 + 6) & 0x3fff;
      width = buffer.readUInt16LE(offset + 8 + 8) & 0x3fff;
      break;
    }
    if (tag === "VP8L" && size >= 5) {
      const bits = buffer.readUInt32LE(offset + 8);
      width = (bits & 0x3fff) + 1;
      height = ((bits >> 14) & 0x3fff) + 1;
      break;
    }
    offset += 8 + size + (size % 2);
  }
  return { valid: true, bytes: buffer.length, width, height };
}

async function applyPortraitSchema(client) {
  const sqlPath = path.join(repoRoot, "prisma/manual/driver_portrait.sql");
  const sql = await readFile(sqlPath, "utf8");
  if (dryRun) {
    console.log("[dry-run] Would apply prisma/manual/driver_portrait.sql");
    return;
  }
  await client.query(sql);
}

async function main() {
  console.log(`Source: ${sourceRoot}`);
  console.log(
    dryRun ? "Mode: dry-run" : dbOnly ? "Mode: database upsert only" : "Mode: upload + database upsert",
  );

  const files = dedupeEntries(await collectWebpFiles(sourceRoot));
  console.log(`Mapped ${files.length} unique driver-season files (after dedupe)`);

  const client = new pg.Client({ connectionString: requireEnv("DATABASE_URL") });
  await client.connect();

  try {
    await applyPortraitSchema(client);
    const seasonMap = await loadSeasonDriverMap(client);

    const bucket = dbOnly ? null : requireEnv("ARVAN_BUCKET");
    const s3 = dryRun || dbOnly ? null : createS3();

    const uploads = [];
    const skipped = [];
    const sizeReport = { ok: 0, odd: [] };

    for (const entry of files) {
      const driverId = seasonMap.get(`${Number(entry.year)}:${entry.abbrev}`);
      if (!driverId) {
        skipped.push({ ...entry, reason: "no season_driver match" });
        continue;
      }

      const objectKey = `drivers/${driverId}/${entry.year}/portrait.webp`;
      const dims = await readWebpDimensions(entry.filePath);
      if (dims?.valid && dims.width && dims.height) {
        if (dims.width !== dims.height || dims.width < 256) {
          sizeReport.odd.push({
            source: entry.source,
            driverId,
            ...dims,
          });
        } else {
          sizeReport.ok += 1;
        }
      }

      uploads.push({ driverId, seasonKey: entry.year, objectKey, filePath: entry.filePath, source: entry.source });

      if (dryRun) continue;

      if (!dbOnly) {
        const body = createReadStream(entry.filePath);
        await s3.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: objectKey,
            Body: body,
            ContentType: "image/webp",
            CacheControl: "public, max-age=86400",
          }),
        );
      }

      await client.query(
        `
        INSERT INTO driver_portrait (driver_id, season_key, object_key)
        VALUES ($1, $2, $3)
        ON CONFLICT (driver_id, season_key)
        DO UPDATE SET object_key = EXCLUDED.object_key
        `,
        [driverId, entry.year, objectKey],
      );
    }

    // Default portrait = latest season uploaded per driver
    const latestByDriver = new Map();
    for (const row of uploads) {
      const year = Number(row.seasonKey);
      const prev = latestByDriver.get(row.driverId);
      if (!prev || year > Number(prev.seasonKey)) {
        latestByDriver.set(row.driverId, row);
      }
    }

    for (const row of latestByDriver.values()) {
      const defaultKey = `drivers/${row.driverId}/default/portrait.webp`;
      if (dryRun) {
        uploads.push({ ...row, seasonKey: "default", objectKey: defaultKey, source: `${row.source} -> default` });
        continue;
      }
      if (!dbOnly) {
        const body = createReadStream(row.filePath);
        await s3.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: defaultKey,
            Body: body,
            ContentType: "image/webp",
            CacheControl: "public, max-age=86400",
          }),
        );
      }
      await client.query(
        `
        INSERT INTO driver_portrait (driver_id, season_key, object_key)
        VALUES ($1, 'default', $2)
        ON CONFLICT (driver_id, season_key)
        DO UPDATE SET object_key = EXCLUDED.object_key
        `,
        [row.driverId, defaultKey],
      );
    }

    console.log(`Uploaded/upserted seasons: ${uploads.filter((u) => u.seasonKey !== "default").length}`);
    console.log(`Default portraits: ${latestByDriver.size}`);
    console.log(`Square webp at >=256px: ${sizeReport.ok}`);
    if (sizeReport.odd.length) {
      console.log(`Non-square or small (${sizeReport.odd.length}):`);
      for (const item of sizeReport.odd.slice(0, 15)) {
        console.log(`  ${item.source} ${item.width}x${item.height} ${item.bytes}b`);
      }
      if (sizeReport.odd.length > 15) console.log(`  ... and ${sizeReport.odd.length - 15} more`);
    }
    if (skipped.length) {
      console.log(`Skipped (${skipped.length}):`);
      for (const item of skipped.slice(0, 20)) {
        console.log(`  ${item.source} abbrev=${item.abbrev} — ${item.reason}`);
      }
      if (skipped.length > 20) console.log(`  ... and ${skipped.length - 20} more`);
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
