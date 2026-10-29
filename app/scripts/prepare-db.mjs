import { execFileSync } from "node:child_process";
import { config } from "dotenv";

// Zero-config local start: create the SQLite database if it does not exist yet.
// Never mutate an external (Postgres) schema automatically.
config();
const url = process.env.DATABASE_URL || "file:./dev.db";
process.env.DATABASE_URL = url;

if (!url.startsWith("file:")) {
  console.log("[db] External database detected — skipping automatic db push.");
  console.log("[db] Run `npx prisma migrate deploy` during deployment instead.");
  process.exit(0);
}

execFileSync("npx", ["prisma", "db", "push", "--skip-generate"], {
  stdio: "inherit",
  env: process.env,
});
