import { Hono } from "hono";

type Env = { Bindings: { DB: D1Database } };

export const app = new Hono<Env>();

app.get("/", (c) => c.text("Hello Hono!"));

// TODO: 小演習のルートと学習ログAPIを実装する。
app.all("/api/*", (c) => c.json({ error: "Not implemented" }, 501));

app.notFound((c) => c.json({ error: "Not found" }, 404));

export default app;

