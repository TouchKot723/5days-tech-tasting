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
  if (typeof input !== "object" || input === null) {
    return { ok: false, errors: ["Body must be a JSON object"] };
  }

  const body = input as Record<string, unknown>;
  const technology = typeof body.technology === "string" ? body.technology.trim() : "";
  const minutes = body.minutes;
  const note = typeof body.note === "string" ? body.note.trim() : "";
  const learnedOn = typeof body.learnedOn === "string" ? body.learnedOn : "";
  const errors: string[] = [];

  if (!technology) errors.push("technology is required");
  if (!Number.isInteger(minutes) || Number(minutes) < 1 || Number(minutes) > 1440) {
    errors.push("minutes must be an integer between 1 and 1440");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(learnedOn)) {
    errors.push("learnedOn must use YYYY-MM-DD");
  }

  return errors.length
    ? { ok: false, errors }
    : { ok: true, value: { technology, minutes: Number(minutes), note, learnedOn } };
}

