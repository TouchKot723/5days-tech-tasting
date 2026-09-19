import { Hono } from "hono";

type Env = { Bindings: { DB: D1Database } };

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

// TODO: 小演習のルートと学習ログAPIを実装する。
app.all("/api/*", (c) => c.json({ error: "Not implemented" }, 501));

app.notFound((c) => c.json({ error: "Not found" }, 404));

export default app;
