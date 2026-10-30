import { execFileSync } from "node:child_process";
import { config } from "dotenv";

// Uses Vercel's pulled Neon credentials. The unpooled URL is required for DDL.
config({ path: ".env.local" });
config();

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.error("Missing DATABASE_URL_UNPOOLED / DATABASE_URL. Run `vercel env pull .env.local` first.");
  process.exit(1);
}

process.env.DATABASE_URL = url;
execFileSync("npx", ["prisma", "db", "push", "--schema", "prisma/schema.postgres.prisma"], {
  stdio: "inherit",
  env: process.env,
});
