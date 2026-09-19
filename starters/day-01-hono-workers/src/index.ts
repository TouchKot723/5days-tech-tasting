import { Hono } from "hono";
import { StudyLogRow, StudyLog } from "./types";

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
    ok: true,
    message: 'Hello, Hono!',
  });
});

// **`GET /api/hello/:name`**：URL パスパラメータを受け取り、`{"message": "Hello <name>!"}` の JSON を返す
app.get("/api/hello/:name", (c) => {
  const name = c.req.param("name");
  return c.json({
    ok: true,
    message: `Hello ${name}!`
  });
});

// TODO: 学習ログAPIを実装する。
app.get("/api/logs", async (c) => {
  const result = await c.env.DB.prepare(
    "SELECT id, technology, minutes, note, learned_on, created_at FROM study_logs ORDER BY learned_on DESC, id DESC"
  ).all<StudyLogRow>();

  const logs = (result.results ?? []).map(toStudyLog);
  return c.json(logs);
});

app.all("/api/*", (c) => c.json({ error: "Not implemented" }, 501));

app.notFound((c) => c.json({ error: "Not found" }, 404));

export default app;
