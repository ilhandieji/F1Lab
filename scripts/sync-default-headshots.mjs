/**
 * Upload flat headshots (not year folders) as default driver portraits.
 * Uses ARVAN_* and DATABASE_URL from .env. Never overwrites an existing
 * default row or an object that is already in the bucket.
 *
 * Usage:
 *   node scripts/sync-default-headshots.mjs --dry-run
 *   node scripts/sync-default-headshots.mjs
 *   node scripts/sync-default-headshots.mjs --sql-out=/tmp/f1lab-default-portraits.sql
 */

import "dotenv/config";
import { createReadStream } from "node:fs";
import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const sourceArg = args.find((arg) => arg.startsWith("--source="));
const sqlArg = args.find((arg) => arg.startsWith("--sql-out="));
const sourceRoot = sourceArg
  ? path.resolve(sourceArg.slice("--source=".length))
  : path.join(repoRoot, "headshots-webp");
const sqlOut = sqlArg
  ? path.resolve(sqlArg.slice("--sql-out=".length))
  : "/tmp/f1lab-default-portraits.sql";

const NOISE = new Set([
  "f1",
  "driver",
  "drivers",
  "headshot",
  "headshots",
  "winner",
  "indy",
  "500",
  "and",
  "formula",
  "one",
  "photo",
  "portrait",
]);

const TEAMS = new Set([
  "williams",
  "ferrari",
  "mclaren",
  "minardi",
  "jordan",
  "toyota",
  "renault",
  "manor",
  "hrt",
  "haas",
  "aguri",
  "spyker",
  "arrows",
  "jaguar",
  "sauber",
  "caterham",
  "alphatauri",
  "mercedes",
  "lotus",
  "benetton",
  "tyrrell",
  "brabham",
  "honda",
  "bmw",
  "alpine",
  "virgin",
  "marussia",
  "footwork",
  "ligier",
  "super",
  "racing",
  "bull",
  "red",
]);

/** Filename stems that do not match a stored name. Targets are F1DB driver ids. */
const ALIASES = new Map([
  ["aj-foyt", "anthony-joseph-foyt"],
  ["alessandro-de-tomaso", "alejandro-de-tomaso"],
  ["azdrubal-bayardo", "asdrubal-fontes-bayardo"],
  ["burce-mclaren", "bruce-mclaren"],
  ["daniel-ricciadro", "daniel-ricciardo"],
  ["ernesto-tino-brambilla", "ernesto-brambilla"],
  ["francisco-godia", "paco-godia"],
  ["geki", "giacomo-russo"],
  ["gimax-carlo-franchi", "carlo-franchi"],
  ["gunther-bechem", "karl-gunther-bechem"],
  ["jerry-unser", "jerry-unser-jr"],
  ["dave-walker", "david-walker"],
  ["geoff-crossley", "geoffrey-crossley"],
  ["ken-mcalpine", "kenneth-mcalpine"],
  ["kurt-ahrens", "kurt-ahrens-jr"],
  ["marcus", "marcus-ericsson"],
  ["oscar-galvez", "oscar-alfredo-galvez"],
  ["prince-bira", "birabongse-bhanudej"],
  ["tim-mayer", "timmy-mayer"],
  ["bob-schroeder", "rob-schroeder"],
]);

const DRIVER_ID = /^[a-z0-9-]+$/;

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name} in environment`);
  return value;
}

function norm(value) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/['’.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isYear(token) {
  return /^(19|20)\d{2}$/.test(token);
}

function isTrailingJunk(token) {
  return NOISE.has(token) || TEAMS.has(token) || isYear(token);
}

function isLeadingJunk(token) {
  return NOISE.has(token) || isYear(token);
}

function addKey(index, key, driverId) {
  if (!key) return;
  if (!index.has(key)) index.set(key, new Set());
  index.get(key).add(driverId);
}

function buildIndex(drivers) {
  const byKey = new Map();

  for (const driver of drivers) {
    addKey(byKey, driver.id, driver.id);
    addKey(byKey, norm(driver.full_name), driver.id);
    addKey(byKey, norm(`${driver.first_name} ${driver.last_name}`), driver.id);
    const firstToken = norm(driver.first_name).split("-").find(Boolean);
    const last = norm(driver.last_name);
    if (firstToken && last) addKey(byKey, `${firstToken}-${last}`, driver.id);
  }

  return { byKey };
}

function resolveTokens(tokens, index) {
  const key = tokens.join("-");
  if (!key) return null;
  const aliasId = ALIASES.get(key);
  if (aliasId) return { driverId: aliasId, via: "alias" };

  const ids = index.byKey.get(key);
  if (!ids || ids.size === 0) return null;
  if (ids.size === 1) return { driverId: [...ids][0], via: key };
  const exact = [...ids].filter((id) => id === key);
  if (exact.length === 1) return { driverId: exact[0], via: key };
  return { ambiguous: key, ids: [...ids] };
}

function resolveFile(fileName, index) {
  const tokens = norm(fileName.replace(/\.webp$/i, "")).split("-").filter(Boolean);
  const steps = [tokens.slice()];
  const trailing = tokens.slice();
  while (trailing.length > 1 && isTrailingJunk(trailing[trailing.length - 1])) {
    trailing.pop();
    steps.push(trailing.slice());
  }
  const leading = trailing.slice();
  while (leading.length > 1 && isLeadingJunk(leading[0])) {
    leading.shift();
    steps.push(leading.slice());
  }

  for (const step of steps) {
    const resolved = resolveTokens(step, index);
    if (resolved) return resolved;
  }

  for (let size = tokens.length - 1; size >= 2; size -= 1) {
    for (let start = 0; start + size <= tokens.length; start += 1) {
      const resolved = resolveTokens(tokens.slice(start, start + size), index);
      if (!resolved) continue;
      return resolved;
    }
  }

  return null;
}

function objectKeyFor(driverId) {
  return `drivers/${driverId}/default/portrait.webp`;
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

async function objectExists(s3, bucket, key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch (error) {
    const status = error?.$metadata?.httpStatusCode;
    if (status === 404 || error?.name === "NotFound" || error?.name === "NoSuchKey") return false;
    throw error;
  }
}

async function mapPool(items, limit, worker) {
  const queue = items.slice();
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) return;
      await worker(item);
    }
  });
  await Promise.all(runners);
}

function insertSql(driverIds) {
  const lines = driverIds.map((driverId) => {
    const key = objectKeyFor(driverId);
    return `INSERT INTO driver_portrait (driver_id, season_key, object_key)
VALUES ('${driverId}', 'default', '${key}')
ON CONFLICT (driver_id, season_key) DO NOTHING;`;
  });
  return `BEGIN;\n${lines.join("\n")}\nCOMMIT;\n`;
}

async function main() {
  console.log(`Source: ${sourceRoot}`);
  console.log(dryRun ? "Mode: dry-run" : "Mode: upload missing objects + insert missing default rows");

  const client = new pg.Client({ connectionString: requireEnv("DATABASE_URL") });
  await client.connect();

  try {
    const drivers = await client.query(
      `SELECT id, full_name, first_name, last_name FROM driver`,
    );
    const defaults = await client.query(
      `SELECT driver_id FROM driver_portrait WHERE season_key = 'default'`,
    );
    const knownIds = new Set(drivers.rows.map((row) => row.id));
    const existingDefaults = new Set(defaults.rows.map((row) => row.driver_id));

    for (const driverId of ALIASES.values()) {
      if (!knownIds.has(driverId)) {
        throw new Error(`Alias target is not a driver id: ${driverId}`);
      }
    }

    const index = buildIndex(drivers.rows);
    const dirents = await readdir(sourceRoot, { withFileTypes: true });
    const files = dirents
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".webp"))
      .map((entry) => entry.name)
      .sort();

    const matched = [];
    const unmatched = [];
    const ambiguous = [];

    for (const fileName of files) {
      const resolved = resolveFile(fileName, index);
      if (!resolved) {
        unmatched.push(fileName);
        continue;
      }
      if (resolved.ambiguous) {
        ambiguous.push(`${fileName} -> ${resolved.ambiguous} [${resolved.ids.join(", ")}]`);
        continue;
      }
      if (!knownIds.has(resolved.driverId) || !DRIVER_ID.test(resolved.driverId)) {
        throw new Error(`Refusing unmatched driver id for ${fileName}: ${resolved.driverId}`);
      }
      matched.push({
        fileName,
        driverId: resolved.driverId,
        via: resolved.via,
        filePath: path.join(sourceRoot, fileName),
      });
    }

    const byDriver = new Map();
    for (const row of matched) {
      if (!byDriver.has(row.driverId)) byDriver.set(row.driverId, []);
      byDriver.get(row.driverId).push(row);
    }
    const droppedDuplicates = [];
    const uniqueMatched = [];
    for (const [driverId, rows] of byDriver) {
      if (rows.length === 1) {
        uniqueMatched.push(rows[0]);
        continue;
      }
      let best = rows[0];
      let bestSize = -1;
      for (const row of rows) {
        const size = (await stat(row.filePath)).size;
        if (size > bestSize) {
          best = row;
          bestSize = size;
        }
      }
      uniqueMatched.push(best);
      for (const row of rows) {
        if (row !== best) droppedDuplicates.push(`${driverId}: kept ${best.fileName}, dropped ${row.fileName}`);
      }
    }

    const skippedExisting = uniqueMatched.filter((row) => existingDefaults.has(row.driverId));
    const pending = uniqueMatched.filter((row) => !existingDefaults.has(row.driverId));
    const suspicious = uniqueMatched.filter((row) => {
      if (row.via === "alias") return false;
      return !norm(row.fileName).includes(row.driverId);
    });

    console.log(`Flat files: ${files.length}`);
    console.log(`Matched: ${uniqueMatched.length}`);
    console.log(`Pending (no default row): ${pending.length}`);
    console.log(`Skipped existing default: ${skippedExisting.length}`);
    console.log(`Unmatched: ${unmatched.length}`);
    console.log(`Ambiguous: ${ambiguous.length}`);
    console.log(`Dropped duplicate files: ${droppedDuplicates.length}`);

    if (unmatched.length) {
      console.log("Unmatched files:");
      for (const name of unmatched) console.log(`  ${name}`);
    }
    if (ambiguous.length) {
      console.log("Ambiguous files:");
      for (const line of ambiguous) console.log(`  ${line}`);
    }
    if (droppedDuplicates.length) {
      console.log("Dropped duplicate files:");
      for (const line of droppedDuplicates) console.log(`  ${line}`);
    }
    const aliasHits = uniqueMatched.filter((row) => row.via === "alias");
    if (aliasHits.length) {
      console.log("Alias matches:");
      for (const row of aliasHits) console.log(`  ${row.fileName} -> ${row.driverId}`);
    }
    if (suspicious.length) {
      console.log(`Suspicious matches (${suspicious.length}):`);
      for (const row of suspicious) console.log(`  ${row.fileName} -> ${row.driverId} via ${row.via}`);
    }
    if (skippedExisting.length) {
      console.log("Kept existing defaults:");
      for (const row of skippedExisting) console.log(`  ${row.fileName} -> ${row.driverId}`);
    }

    if (ambiguous.length || suspicious.length) {
      throw new Error("Resolve ambiguous or suspicious files before uploading");
    }

    if (dryRun) return;

    const bucket = requireEnv("ARVAN_BUCKET");
    const s3 = createS3();
    const ready = [];
    let uploaded = 0;
    let alreadyStored = 0;

    await mapPool(pending, 6, async (row) => {
      const key = objectKeyFor(row.driverId);
      const exists = await objectExists(s3, bucket, key);
      if (!exists) {
        await s3.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: createReadStream(row.filePath),
            ContentType: "image/webp",
            CacheControl: "public, max-age=86400",
          }),
        );
        uploaded += 1;
      } else {
        alreadyStored += 1;
      }
      ready.push(row.driverId);
      if (ready.length % 50 === 0) {
        console.log(`Stored ${ready.length}/${pending.length}`);
      }
    });

    ready.sort();
    if (ready.length > 0) {
      await client.query("BEGIN");
      try {
        await client.query(
          `
          INSERT INTO driver_portrait (driver_id, season_key, object_key)
          SELECT id, 'default', 'drivers/' || id || '/default/portrait.webp'
          FROM unnest($1::text[]) AS id
          ON CONFLICT (driver_id, season_key) DO NOTHING
          `,
          [ready],
        );
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    await writeFile(sqlOut, insertSql(ready), "utf8");
    console.log(`Uploaded: ${uploaded}`);
    console.log(`Already in bucket: ${alreadyStored}`);
    console.log(`Inserted driver ids: ${ready.length}`);
    console.log(`SQL: ${sqlOut}`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
