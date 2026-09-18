---
title: ランタイムをまたぐWeb標準API
summary: Request、Response、fetchを共通語彙として捉える
tags: [api, deno]
updatedAt: 2026-09-21
---

## 共通するインターフェース

ブラウザ、Cloudflare Workers、Denoは`fetch`や`Response`を提供します。

実行環境ごとの差を学ぶ前に、共通するインターフェースを確認すると比較しやすくなります。

