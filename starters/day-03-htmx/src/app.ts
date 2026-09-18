import { Hono } from "hono";

export const app = new Hono();

app.get("/", (c) => c.html(`<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><title>Learning Topics</title>
<script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.10/dist/htmx.min.js"></script>
</head><body><main id="board"><h1>Learning Topics</h1>
<!-- TODO: フォーム、絞り込み、一覧を実装する。 -->
</main></body></html>`));

// TODO: 小演習のフラグメントとトピック操作のルートを実装する。

