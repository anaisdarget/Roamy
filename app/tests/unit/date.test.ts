import { describe, expect, it } from "vitest";
import { dateRange, formatDateRange, nightsBetween, seasonFor, tripLength } from "@/lib/utils/date";

describe("date helpers", () => {
  it("counts days inclusively", () => {
    expect(tripLength("2030-06-12", "2030-06-16")).toBe(5);
    expect(nightsBetween("2030-06-12", "2030-06-16")).toBe(4);
  });

  it("builds a contiguous range", () => {
    expect(dateRange("2030-06-12", "2030-06-14")).toEqual([
      "2030-06-12",
      "2030-06-13",
      "2030-06-14",
    ]);
  });

  it("formats a same-month range in French", () => {
    const formatted = formatDateRange("2030-06-12", "2030-06-16");
    expect(formatted).toContain("12");
    expect(formatted).toContain("16");
    expect(formatted.toLowerCase()).toContain("juin");
  });

  it("detects seasons", () => {
    expect(seasonFor("2030-01-10")).toBe("hiver");
    expect(seasonFor("2030-04-10")).toBe("printemps");
    expect(seasonFor("2030-07-10")).toBe("été");
    expect(seasonFor("2030-10-10")).toBe("automne");
  });
});
