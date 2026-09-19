export type StudyLogInput = {
  technology: string;
  minutes: number;
  note: string;
  learnedOn: string;
};

export type ValidationResult =
  | { ok: true; value: StudyLogInput }
  | { ok: false; errors: string[] };

export function validateStudyLogInput(input: unknown): ValidationResult {
  //JSONオブジェクトの検証
  if (typeof input !== "object" || input === null) {
    return { ok: false, errors: ["Body must be a JSON object"] };
  }

  const body = input as Record<string, unknown>;
  const errors: string[] = [];

  // technologyの確認
  const technology = typeof body.technology === "string" ? body.technology.trim() : "";
  if (!technology) {
    errors.push("technology is required");
  }

  // minutesの確認
  const minutes = body.minutes;
  if (typeof minutes !== "number" || !Number.isInteger(minutes) || minutes < 1 || 1440 < minutes) {
    errors.push("minutes must be an integer between 1 and 1440");
  }

  // learnedOnの確認
  const learnedOn = typeof body.learnedOn === "string" ? body.learnedOn : "";
  // 一旦はYYYY-MM-DDの形式であるかのみの簡易バリデーション
  if (!/^\d{4}-\d{2}-\d{2}$/.test(learnedOn)) {
    errors.push("learnedOn must use YYYY-MM-DD");
  }

  // note
  const note = typeof body.note === "string" ? body.note.trim() : "";

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      technology,
      minutes: minutes as number,
      note,
      learnedOn,
    },
  };
}
