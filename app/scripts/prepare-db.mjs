import { execFileSync } from "node:child_process";
import { config } from "dotenv";

// Zero-config local start: create the SQLite database if it does not exist yet.
config();
process.env.DATABASE_URL ||= "file:./dev.db";

execFileSync("npx", ["prisma", "db", "push", "--skip-generate"], {
  stdio: "inherit",
  env: process.env,
});
