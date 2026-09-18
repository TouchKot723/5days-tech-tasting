import { Hono } from "hono";
import { escapeHtml, renderBoard, renderList, renderPage, renderTopic, type Status, type Topic } from "./view";

export const app = new Hono();
export const topics: Topic[] = [
  { id: 1, title: "HTMLフラグメントを返す", done: true },
  { id: 2, title: "hx-swapを試す", done: false },
];
let nextId = 3;

app.get("/", (c) => c.html(renderPage(topics)));
app.get("/fragments/greeting", (c) => c.html("<p>Hello htmx!</p>"));
app.post("/fragments/echo", async (c) => {
  const body = await c.req.parseBody();
  return c.html(`<p>${escapeHtml(String(body.message ?? ""))}</p>`);
});

app.get("/topics", (c) => {
  const value = c.req.query("status");
  const status: Status = value === "open" || value === "done" ? value : "all";
  return c.html(renderList(topics, status));
});

app.post("/topics", async (c) => {
  const body = await c.req.parseBody();
  const title = String(body.title ?? "").trim();
  if (!title || title.length > 100) {
    return c.html(renderBoard(topics, "タイトルは1文字以上100文字以下で入力してください。"));
  }
  topics.push({ id: nextId++, title, done: false });
  return c.html(renderBoard(topics));
});

app.patch("/topics/:id/toggle", (c) => {
  const topic = topics.find((item) => item.id === Number(c.req.param("id")));
  if (!topic) return c.html("<p>トピックが見つかりません。</p>", 404);
  topic.done = !topic.done;
  return c.html(renderTopic(topic));
});

app.delete("/topics/:id", (c) => {
  const index = topics.findIndex((item) => item.id === Number(c.req.param("id")));
  if (index < 0) return c.html("<p>トピックが見つかりません。</p>", 404);
  topics.splice(index, 1);
  return c.body(null, 204);
});
