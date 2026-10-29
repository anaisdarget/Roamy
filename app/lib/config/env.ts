import "server-only";
import { z } from "zod";

/**
 * Environment validation. Runs once on first server import and fails with
 * actionable messages rather than cryptic runtime errors.
 */
const booleanString = z
  .enum(["true", "false"])
  .default("true")
  .transform((value) => value === "true");

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined);

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().min(1).default("file:./dev.db"),
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    AI_MOCK: booleanString,
    PAYMENT_MOCK: booleanString,
    STRIPE_SECRET_KEY: optionalString,
    STRIPE_WEBHOOK_SECRET: optionalString,
    STRIPE_PRICE_ID_ESSENTIAL: optionalString,
    STRIPE_PRICE_ID_PREMIUM: optionalString,
    ANTHROPIC_API_KEY: optionalString,
    ANTHROPIC_MODEL: z.string().trim().default("claude-sonnet-4-5"),
    RESEND_API_KEY: optionalString,
    EMAIL_FROM: z.string().default("Roamy <bonjour@roamy.travel>"),
    SUPPORT_EMAIL: z.string().email().default("bonjour@roamy.travel"),
    ADMIN_SECRET: z.string().min(12).default("dev-admin-secret-change-me"),
    SESSION_SECRET: z.string().min(12).default("dev-session-secret-change-me"),
  })
  .superRefine((env, ctx) => {
    if (!env.PAYMENT_MOCK && !env.STRIPE_SECRET_KEY) {
      ctx.addIssue({
        code: "custom",
        path: ["STRIPE_SECRET_KEY"],
        message:
          "PAYMENT_MOCK=false requires STRIPE_SECRET_KEY. Set it in .env, or use PAYMENT_MOCK=true for local testing.",
      });
    }
    if (!env.PAYMENT_MOCK && !env.STRIPE_WEBHOOK_SECRET) {
      ctx.addIssue({
        code: "custom",
        path: ["STRIPE_WEBHOOK_SECRET"],
        message:
          "PAYMENT_MOCK=false requires STRIPE_WEBHOOK_SECRET (from `stripe listen` locally). Run `stripe listen --forward-to localhost:3000/api/stripe/webhook`.",
      });
    }
    if (!env.AI_MOCK && !env.ANTHROPIC_API_KEY) {
      ctx.addIssue({
        code: "custom",
        path: ["ANTHROPIC_API_KEY"],
        message:
          "AI_MOCK=false requires ANTHROPIC_API_KEY. Set it in .env, or use AI_MOCK=true for local testing.",
      });
    }
    if (env.NODE_ENV === "production") {
      if (env.ADMIN_SECRET === "dev-admin-secret-change-me") {
        ctx.addIssue({
          code: "custom",
          path: ["ADMIN_SECRET"],
          message: "Change ADMIN_SECRET before deploying to production.",
        });
      }
      if (env.SESSION_SECRET === "dev-session-secret-change-me") {
        ctx.addIssue({
          code: "custom",
          path: ["SESSION_SECRET"],
          message: "Change SESSION_SECRET before deploying to production.",
        });
      }
    }
  });

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid environment configuration:\n${details}\n\nCopy .env.example to .env and fill the missing values.`,
    );
  }
  return parsed.data;
}

export const env = loadEnv();
