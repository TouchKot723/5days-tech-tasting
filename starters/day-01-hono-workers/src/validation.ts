import { z } from "zod";

export const studyLogSchema = z.object({
  technology: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "technology is required",
    }),

  minutes: z
    .number()
    .int("minutes must be an integer")
    .min(1, "minutes must be more than 1")
    .max(1440, "minutes must be less than 1440"),

  note: z
    .string()
    .optional()
    .transform((val) => (val ? val.trim() : "")),

  learnedOn: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "learnedOn must use YYYY-MM-DD")
    .refine((val) => {
      const [year, month, day] = val.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    }, {
      message: "learnedOn must be a valid calender date",
    }),
});

// Zodのスキーマから型を自動で生成
export type StudyLogInput = z.infer<typeof studyLogSchema>;

export type ValidationResult =
  | { ok: true; value: StudyLogInput }
  | { ok: false; errors: string[] };

export function validateStudyLogInput(input: unknown): ValidationResult {
  const result = studyLogSchema.safeParse(input);

  if (!result.success) {
    // Zod v4以降ではerrorsではなくissuesに変更された
    const allErrors = result.error.issues.map((err) => err.message);
    return { ok: false, errors: allErrors };
  }

  return {
    ok: true,
    value: result.data
  };
}
