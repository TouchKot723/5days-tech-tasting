import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/index";

type Row = {
  id: number;
  technology: string;
  minutes: number;
  note: string;
  learnedOn: string;
  createdAt: string;
};

function createFakeDatabase() {
  const rows: Row[] = [];
  let nextId = 1;

  const database = {
    prepare(sql: string) {
      let values: unknown[] = [];
      const statement = {
        bind(...bound: unknown[]) {
          values = bound;
          return statement;
        },
        async all<T>() {
          return { results: [...rows] as T[], success: true, meta: {} };
        },
        async first<T>() {
          return (rows.find((row) => row.id === Number(values[0])) ?? null) as T | null;
        },
        async run() {
          if (sql.startsWith("INSERT")) {
            const [technology, minutes, note, learnedOn, createdAt] = values;
            rows.push({
              id: nextId,
              technology: String(technology),
              minutes: Number(minutes),
              note: String(note),
              learnedOn: String(learnedOn),
              createdAt: String(createdAt),
            });
            return { success: true, meta: { changes: 1, last_row_id: nextId++ } };
          }
          const index = rows.findIndex((row) => row.id === Number(values[0]));
          if (index < 0) return { success: true, meta: { changes: 0 } };
          rows.splice(index, 1);
          return { success: true, meta: { changes: 1 } };
        },
      };
      return statement;
    },
  };

  return { DB: database as unknown as D1Database, rows };
}

describe("study log API", () => {
  let env: ReturnType<typeof createFakeDatabase>;

  beforeEach(() => {
    env = createFakeDatabase();
  });

  it("creates and reads a study log", async () => {
    const created = await app.request("/api/logs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ technology: "Hono", minutes: 60, learnedOn: "2026-09-19" }),
    }, env);
    expect(created.status).toBe(201);
    const body = await created.json() as { technology: string };
    expect(body.technology).toBe("Hono");

    const found = await app.request("/api/logs/1", undefined, env);
    expect(found.status).toBe(200);
  });

  it("rejects invalid input before accessing D1", async () => {
    const response = await app.request("/api/logs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ technology: "", minutes: 0, learnedOn: "today" }),
    }, env);
    expect(response.status).toBe(400);
    expect(env.rows).toHaveLength(0);
  });

  it("returns 404 for a missing log", async () => {
    expect((await app.request("/api/logs/999", undefined, env)).status).toBe(404);
    expect((await app.request("/api/logs/999", { method: "DELETE" }, env)).status).toBe(404);
  });
});
