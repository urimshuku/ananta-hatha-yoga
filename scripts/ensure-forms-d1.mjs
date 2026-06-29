#!/usr/bin/env node
/**
 * Ensure the form-submissions D1 database exists and wrangler.jsonc has a real
 * database_id. Run automatically before deploy, or manually:
 *   node scripts/ensure-forms-d1.mjs
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WRANGLER_PATH = path.join(ROOT, "wrangler.jsonc");
const DB_NAME = "nava-hatha-yoga-forms";
const PLACEHOLDER = "REPLACE_WITH_D1_DATABASE_ID";

function run(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function readDatabaseId() {
  const config = readFileSync(WRANGLER_PATH, "utf8");
  const match = config.match(/"database_id"\s*:\s*"([^"]+)"/);
  return { config, id: match?.[1] ?? "" };
}

function writeDatabaseId(config, id) {
  const updated = config.replace(
    /"database_id"\s*:\s*"[^"]+"/,
    `"database_id": "${id}"`,
  );
  writeFileSync(WRANGLER_PATH, updated);
}

function findExistingId() {
  try {
    const list = run("npx wrangler d1 list");
    const line = list
      .split("\n")
      .find((row) => row.includes(DB_NAME) || row.includes("nava-hatha-yoga-forms"));
    if (!line) return null;
    const uuid = line.match(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
    );
    return uuid?.[0] ?? null;
  } catch {
    return null;
  }
}

function createDatabase() {
  console.log(`Creating D1 database "${DB_NAME}"...`);
  const out = run(`npx wrangler d1 create ${DB_NAME}`);
  console.log(out.trim());

  const fromOutput = out.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
  );
  return fromOutput?.[0] ?? null;
}

function applyMigrations() {
  console.log("Applying D1 migrations to production...");
  const out = run(`npx wrangler d1 migrations apply ${DB_NAME} --remote`);
  console.log(out.trim());
}

const { config, id: currentId } = readDatabaseId();

if (currentId && currentId !== PLACEHOLDER) {
  console.log(`D1 database already configured (${currentId}).`);
  applyMigrations();
  process.exit(0);
}

const existingId = findExistingId();
const databaseId = existingId ?? createDatabase();

if (!databaseId) {
  console.error(
    "Could not determine D1 database_id. Run `npx wrangler login`, then `npx wrangler d1 create nava-hatha-yoga-forms`, and paste the id into wrangler.jsonc.",
  );
  process.exit(1);
}

writeDatabaseId(config, databaseId);
console.log(`Updated wrangler.jsonc with database_id ${databaseId}.`);
applyMigrations();
