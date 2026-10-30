import { execFileSync } from "node:child_process";

// Vercel builds use Postgres (Neon). Local builds keep the SQLite schema.
console.log("[vercel] generating Prisma client for PostgreSQL…");
execFileSync("npx", ["prisma", "generate", "--schema", "prisma/schema.postgres.prisma"], {
  stdio: "inherit",
  env: process.env,
});

execFileSync("npx", ["next", "build"], { stdio: "inherit", env: process.env });
