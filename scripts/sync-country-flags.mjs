/**
 * Upload local country-flag SVGs to Arvan object storage.
 * Uses ARVAN_* from .env. Does not write database rows.
 *
 * Usage:
 *   node scripts/sync-country-flags.mjs --dry-run
 *   node scripts/sync-country-flags.mjs
 *   node scripts/sync-country-flags.mjs --source ./svg
 */

import "dotenv/config";
import { createReadStream } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const sourceArg = args.find((arg) => arg.startsWith("--source="));
const sourceRoot = sourceArg
  ? path.resolve(sourceArg.slice("--source=".length))
  : path.join(repoRoot, "svg");

const FILE_NAME = /^[a-z0-9-]+\.svg$/;

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

async function collectFlags(root) {
  let names;
  try {
    names = await readdir(root);
  } catch (error) {
    throw new Error(`Cannot read source directory ${root}: ${error.message}`);
  }

  return names
    .filter((name) => FILE_NAME.test(name))
    .sort()
    .map((name) => ({
      fileName: name,
      filePath: path.join(root, name),
      objectKey: `flags/${name}`,
    }));
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

async function main() {
  const files = await collectFlags(sourceRoot);
  console.log(`Source: ${sourceRoot}`);
  console.log(dryRun ? "Mode: dry-run" : "Mode: upload");
  console.log(`Flags: ${files.length}`);
  if (files.length === 0) throw new Error(`No SVG flags found in ${sourceRoot}`);

  if (dryRun) {
    for (const file of files) console.log(`[dry-run] ${file.objectKey}`);
    return;
  }

  const bucket = requireEnv("ARVAN_BUCKET");
  const s3 = createS3();
  let uploaded = 0;

  await mapPool(files, 8, async (file) => {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: file.objectKey,
        Body: createReadStream(file.filePath),
            ContentType: "image/svg+xml",
            CacheControl: "public, max-age=86400",
            ACL: "public-read",
      }),
    );
    uploaded += 1;
    if (uploaded % 50 === 0 || uploaded === files.length) {
      console.log(`Uploaded ${uploaded}/${files.length}`);
    }
  });

  console.log(`Done. ${uploaded} objects under flags/`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
