import { describe, expect, it } from "vitest";
import { tripAnswersSchema } from "@/lib/schemas/trip";

const valid = {
  destination: "Barcelone, Espagne",
  startDate: "2030-06-12",
  endDate: "2030-06-16",
  flexibleDates: true,
  adults: 2,
  children: 0,
  babies: 0,
  budgetLevel: "confort",
  budgetAmount: 700,
  interests: ["plage", "food"],
  rhythm: "equilibre",
  dietary: "",
  accommodation: "",
  transport: "",
  notes: "",
  firstName: "Ana",
  email: "ANA@Example.com",
  consent: true,
  plan: "premium",
  locale: "fr",
  website: "",
};

describe("tripAnswersSchema", () => {
  it("accepts a complete answer set and normalises the email", () => {
    const parsed = tripAnswersSchema.parse(valid);
    expect(parsed.email).toBe("ana@example.com");
    expect(parsed.interests).toEqual(["plage", "food"]);
  });

  it("rejects a past start date with a friendly French message", () => {
    const result = tripAnswersSchema.safeParse({ ...valid, startDate: "2020-01-01" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes("startDate"))).toBe(true);
    }
  });

  it("rejects an end date before the start date", () => {
    const result = tripAnswersSchema.safeParse({ ...valid, endDate: "2030-06-10" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("retour");
    }
  });

  it("caps trips at 30 days", () => {
    const result = tripAnswersSchema.safeParse({
      ...valid,
      startDate: "2030-06-01",
      endDate: "2030-07-02",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes("30 jours"))).toBe(true);
    }
  });

  it("requires at least one interest", () => {
    const result = tripAnswersSchema.safeParse({ ...valid, interests: [] });
    expect(result.success).toBe(false);
  });

  it("requires GDPR consent", () => {
    const result = tripAnswersSchema.safeParse({ ...valid, consent: false });
    expect(result.success).toBe(false);
  });

  it("rejects invalid emails", () => {
    const result = tripAnswersSchema.safeParse({ ...valid, email: "nope" });
    expect(result.success).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    const result = tripAnswersSchema.safeParse({ ...valid, website: "spam" });
    expect(result.success).toBe(false);
  });

  it("allows a same-day city break", () => {
    const result = tripAnswersSchema.safeParse({
      ...valid,
      startDate: "2030-06-12",
      endDate: "2030-06-12",
    });
    expect(result.success).toBe(true);
  });
});
