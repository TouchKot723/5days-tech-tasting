---
title: Honoのルーティング
summary: HTTPメソッドとパスから処理を選ぶ仕組みを整理する
tags: [hono, api]
updatedAt: 2026-09-19
---

## ルートの役割

ルートはHTTPメソッドとパスをハンドラーへ対応づけます。

ハンドラーはHonoのContextを受け取り、最終的にResponseを返します。

## 確認方法

同じパスへGETとPOSTを送り、異なるハンドラーが選ばれることを確認します。

