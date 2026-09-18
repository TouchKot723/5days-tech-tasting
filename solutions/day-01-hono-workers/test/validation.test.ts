import { describe, expect, it } from "vitest";
import { validateStudyLogInput } from "../src/validation";

describe("validateStudyLogInput", () => {
  it("accepts and normalizes a valid input", () => {
    expect(validateStudyLogInput({ technology: " Hono ", minutes: 60, learnedOn: "2026-09-19" }))
      .toEqual({ ok: true, value: { technology: "Hono", minutes: 60, note: "", learnedOn: "2026-09-19" } });
  });

  it("rejects invalid minutes", () => {
    expect(validateStudyLogInput({ technology: "Hono", minutes: 0, learnedOn: "2026-09-19" }).ok).toBe(false);
  });

  it("rejects an invalid date format", () => {
    expect(validateStudyLogInput({ technology: "Hono", minutes: 10, learnedOn: "09/19" }).ok).toBe(false);
  });
});

