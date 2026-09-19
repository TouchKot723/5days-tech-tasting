import { describe, expect, it } from "vitest";
import { validateStudyLogInput } from "../src/validation";

describe("validateStudyLogInput", () => {
  it("accepts and normalizes a valid input", () => {
    expect(
      validateStudyLogInput({
        technology: " sample ",
        minutes: 60,
        learnedOn: "2026-01-01",
      })
    ).toEqual({
      ok: true,
      value: {
        technology: "sample",
        minutes: 60,
        note: "",
        learnedOn: "2026-01-01",
      },
    });
  });

  // 異常系：0分（1未満）は弾くこと
  it("rejects invalid minutes　(less than 1)", () => {
    expect(
      validateStudyLogInput({
        technology: "Hono",
        minutes: 0,
        learnedOn: "2026-09-19",
      }).ok
    ).toBe(false);
  });

  it("rejects invalid minutes (more than 1440)", () => {
    expect(
      validateStudyLogInput({
        technology: "Hono",
        minutes: 1500,
        learnedOn: "2026-09-19",
      }).ok
    ).toBe(false);
  });



  // 異常系：日付フォーマットがおかしいものは弾くこと
  it("rejects an invalid date format", () => {
    expect(
      validateStudyLogInput({
        technology: "Hono",
        minutes: 10,
        learnedOn: "09/19",
      }).ok
    ).toBe(false);
  });

});
