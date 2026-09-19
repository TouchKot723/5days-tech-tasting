import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { StudyLogRow, StudyLog } from "./types";
import { studyLogSchema } from "./validation";

type Env = { Bindings: { DB: D1Database } };

const toStudyLog = (row: StudyLogRow): StudyLog => ({
  id: row.id,
  technology: row.technology,
  minutes: row.minutes,
  note: row.note,
  learnedOn: row.learned_on,
  createdAt: row.created_at,
});


export const app = new Hono<Env>();

//**`GET /`**：`Hello Hono!` を返す（既に実装されています）
app.get("/", (c) => c.text("Hello Hono!"));

//**`GET /api/hello`**：`{"message": "Hello Hono!"}` の JSON を返す
app.get("/api/hello", (c) => {
  return c.json({
    message: 'Hello, Hono!',
  });
});

// **`GET /api/hello/:name`**：URL パスパラメータを受け取り、`{"message": "Hello <name>!"}` の JSON を返す
app.get("/api/hello/:name", (c) => {
  const name = c.req.param("name");
  return c.json({
    message: `Hello ${name}!`
  });
});

app.get("/api/logs", async (c) => {
  const result = await c.env.DB.prepare(
    "SELECT id, technology, minutes, note, learned_on, created_at FROM study_logs ORDER BY learned_on DESC, id DESC"
  ).all<StudyLogRow>();

  const logs = (result.results ?? []).map(toStudyLog);
  return c.json(logs);
});

app.get("/api/logs/:id", async (c) => {
  const id = c.req.param("id");

  const row = await c.env.DB.prepare(
    "SELECT id, technology, minutes, note, learned_on, created_at FROM study_logs WHERE id = ?"
  ).bind(id).first<StudyLogRow>();

  if (!row) return c.json({ error: "Study log not found." }, 404);

  return c.json(toStudyLog(row));
})

app.post("/api/logs", zValidator("json", studyLogSchema), async (c) => {
  //既にバリデーションチェックが済んだ状態になる
  const { technology, minutes, note, learnedOn } = c.req.valid("json");
  const createdAt = new Date().toISOString();

  const insertResult = await c.env.DB.prepare(
    "INSERT INTO study_logs (technology, minutes, note, learned_on, created_at) VALUES (?, ?, ?, ?, ?)"
  ).bind(technology, minutes, note, learnedOn, createdAt).run();

  //  INSERT されたばかりの最新データを、自動採番された ID から取り直す！
  const lastId = insertResult.meta.last_row_id;
  const row = await c.env.DB.prepare(
    "SELECT id, technology, minutes, note, learned_on, created_at FROM study_logs WHERE id = ?"
  )
    .bind(lastId)
    .first<StudyLogRow>();

  if (!row) {
    return c.json({ error: "Failed to retrieve created log" }, 500);
  }

  return c.json(toStudyLog(row), 201);
})

app.put("/api/logs/:id", zValidator("json", studyLogSchema), async (c) => {
  const id = c.req.param("id");
  const { technology, minutes, note, learnedOn } = c.req.valid("json");

  const result = await c.env.DB.prepare(
    "UPDATE study_logs SET technology = ?, minutes = ?, note = ?, learned_on = ? WHERE id = ?"
  ).bind(technology, minutes, note, learnedOn, id).run();

  if (result.meta.changes === 0) {
    return c.json({ error: "Study log not found" }, 404);
  }

  const row = await c.env.DB.prepare(
    "SELECT id, technology, minutes, note, learned_on, created_at FROM study_logs WHERE id = ?"
  ).bind(id).first<StudyLogRow>();

  if (!row) {
    return c.json({ error: "Failed to retrieve updated log" }, 500);
  }

  return c.json(toStudyLog(row));
});

app.delete("/api/logs/:id", async (c) => {
  const id = c.req.param("id");

  const result = await c.env.DB.prepare(
    "DELETE FROM study_logs WHERE id = ?"
  ).bind(id).run();

  if (result.meta.changes === 0) {
    return c.json({ error: "Study log not found" }, 404);
  }

  return c.body(null, 204);
});

app.notFound((c) => c.json({ error: "Not found" }, 404));

export default app;
