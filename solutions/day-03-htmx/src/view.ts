export type Topic = { id: number; title: string; done: boolean };
export type Status = "all" | "open" | "done";

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char] ?? char);
}

export function renderTopic(topic: Topic): string {
  const label = topic.done ? "未完了に戻す" : "完了にする";
  return `<li id="topic-${topic.id}" class="${topic.done ? "done" : ""}">
  <span>${escapeHtml(topic.title)}</span>
  <span class="actions">
    <button hx-patch="/topics/${topic.id}/toggle" hx-target="closest li" hx-swap="outerHTML">${label}</button>
    <button class="danger" hx-delete="/topics/${topic.id}" hx-target="closest li" hx-swap="delete">削除</button>
  </span>
</li>`;
}

export function renderList(topics: Topic[], status: Status = "all"): string {
  const visible = topics.filter((topic) => status === "all" || (status === "done") === topic.done);
  const items = visible.length ? visible.map(renderTopic).join("\n") : "<li>該当するトピックはありません。</li>";
  return `<ul id="topic-list">${items}</ul>`;
}

export function renderBoard(topics: Topic[], error = ""): string {
  return `<main id="board">
  <h1>Learning Topics</h1>
  <form hx-post="/topics" hx-target="#board" hx-swap="outerHTML">
    <label>次に学ぶこと <input name="title" autocomplete="off" required></label>
    <button>追加</button>
    ${error ? `<p class="error">${escapeHtml(error)}</p>` : ""}
  </form>
  <nav aria-label="絞り込み">
    <button hx-get="/topics?status=all" hx-target="#topic-list" hx-swap="outerHTML">すべて</button>
    <button hx-get="/topics?status=open" hx-target="#topic-list" hx-swap="outerHTML">未完了</button>
    <button hx-get="/topics?status=done" hx-target="#topic-list" hx-swap="outerHTML">完了</button>
  </nav>
  ${renderList(topics)}
  <span class="htmx-indicator">通信中...</span>
</main>`;
}

export function renderPage(topics: Topic[]): string {
  return `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Learning Topics</title>
<script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.10/dist/htmx.min.js"></script>
<style>
body{font-family:system-ui;max-width:48rem;margin:3rem auto;padding:0 1rem;background:#f7f8fa;color:#17202a}
main{background:white;padding:2rem;border-radius:1rem;box-shadow:0 8px 30px #0001}form,nav,li{display:flex;gap:.75rem;align-items:center}form{flex-wrap:wrap}input{padding:.6rem}button{padding:.55rem .8rem;cursor:pointer}ul{padding:0;list-style:none}li{justify-content:space-between;border-top:1px solid #ddd;padding:1rem 0}.done span:first-child{text-decoration:line-through;color:#657}.danger,.error{color:#a21}.actions{display:flex;gap:.5rem}.htmx-indicator{opacity:0}.htmx-request .htmx-indicator{opacity:1}
</style></head><body>${renderBoard(topics)}</body></html>`;
}

