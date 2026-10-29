import { execFileSync } from "node:child_process";

// Prisma needs a datasource URL even to generate the client.
process.env.DATABASE_URL ||= "file:./dev.db";

execFileSync("npx", ["prisma", "generate"], {
  stdio: "inherit",
  env: process.env,
});
