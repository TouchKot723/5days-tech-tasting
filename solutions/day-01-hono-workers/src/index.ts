import { Hono } from "hono";
import { validateStudyLogInput } from "./validation";

type Env = { Bindings: { DB: D1Database } };

type StudyLog = {
  id: number;
  technology: string;
  minutes: number;
  note: string;
  learnedOn: string;
  createdAt: string;
};

export const app = new Hono<Env>();

const selectColumns = `
  id, technology, minutes, note,
  learned_on AS learnedOn,
  created_at AS createdAt
`;

app.get("/", (c) => c.text("Hello Hono!"));
app.get("/api/hello", (c) => c.json({ message: "Hello Hono!" }));
app.get("/api/hello/:name", (c) => c.json({ message: `Hello ${c.req.param("name")}!` }));

app.get("/api/logs", async (c) => {
  const result = await c.env.DB.prepare(
    `SELECT ${selectColumns} FROM study_logs ORDER BY learned_on DESC, id DESC`,
  ).all<StudyLog>();
  return c.json({ logs: result.results });
});

app.get("/api/logs/:id", async (c) => {
  const log = await c.env.DB.prepare(
    `SELECT ${selectColumns} FROM study_logs WHERE id = ?`,
  ).bind(c.req.param("id")).first<StudyLog>();
  return log ? c.json(log) : c.json({ error: "Study log not found" }, 404);
});

app.post("/api/logs", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Body must be valid JSON" }, 400);
  }

  const parsed = validateStudyLogInput(body);
  if (!parsed.ok) return c.json({ error: "Invalid input", details: parsed.errors }, 400);

  const { technology, minutes, note, learnedOn } = parsed.value;
  const createdAt = new Date().toISOString();
  const result = await c.env.DB.prepare(
    "INSERT INTO study_logs (technology, minutes, note, learned_on, created_at) VALUES (?, ?, ?, ?, ?)",
  ).bind(technology, minutes, note, learnedOn, createdAt).run();
  const log = await c.env.DB.prepare(
    `SELECT ${selectColumns} FROM study_logs WHERE id = ?`,
  ).bind(result.meta.last_row_id).first<StudyLog>();
  return c.json(log, 201);
});

app.delete("/api/logs/:id", async (c) => {
  const result = await c.env.DB.prepare("DELETE FROM study_logs WHERE id = ?")
    .bind(c.req.param("id")).run();
  return result.meta.changes === 0
    ? c.json({ error: "Study log not found" }, 404)
    : c.body(null, 204);
});

app.notFound((c) => c.json({ error: "Not found" }, 404));

export default app;

