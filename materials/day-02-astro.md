# Day 2：Astro

## 今日のゴール

Markdownを追加すると一覧と詳細ページが生成されるTech Wikiを作ります。

記事データの不備をビルド時に検出できる状態を完成とします。

## 時間割

| 時刻 | 内容 |
| --- | --- |
| 10:00〜11:00 | Astroの生成モデルとコンポーネント |
| 11:00〜12:00 | ページ、レイアウト、propsの小演習 |
| 12:00〜13:00 | 休憩 |
| 13:00〜16:00 | MarkdownベースのTech Wiki |
| 16:00〜17:00 | タグページと発展課題 |
| 17:00〜18:00 | ビルド確認と振り返り |

## 10:00 概念理解

Astroは`.astro`ファイルをHTMLへ変換し、既定ではページのJavaScriptをブラウザへ送りません。

ブラウザ上の状態が不要なTech Wikiでは、記事一覧と本文をビルド時に作ることで、配信する処理を減らせます。

`.astro`ファイルのコードフェンス部分はサーバーまたはビルド時に動き、その下のテンプレートがHTMLになります。

**Content Collection**は、同じ形のコンテンツを読み込み、schemaによってfrontmatterを検証する仕組みです。

Markdownを単なる文字列として読む場合と異なり、記事のタイトルやタグに型が付きます。

## 11:00 小演習

```sh
cd starters/day-02-astro
npm install
npm run dev
```

共通レイアウトへ`title`を渡し、`/about`ページとカードコンポーネントを作ります。

ブラウザのページソースを開き、表示に不要なJavaScriptが配信されていないことを確認します。

<details>
<summary>ヒント1</summary>

propsはコードフェンス内で`Astro.props`から受け取ります。

</details>

<details>
<summary>ヒント2</summary>

レイアウトの本文位置には`<slot />`を置きます。

</details>

<details>
<summary>ヒント3</summary>

`src/pages/about.astro`は自動的に`/about`へ対応します。

</details>

## 13:00 ミニアプリ制作

記事は次のfrontmatterを持ちます。

```yaml
---
title: Honoのルーティング
summary: HTTPメソッドとパスから処理を選ぶ仕組みを整理する
tags:
  - hono
  - api
updatedAt: 2026-09-20
draft: false
---
```

`title`と`summary`は空でない文字列、`tags`は一つ以上の文字列、`updatedAt`は日付、`draft`は省略可能な真偽値とします。

| URL | 内容 |
| --- | --- |
| `/` | 公開記事の一覧とタグ |
| `/wiki/[id]/` | Markdownから生成した記事本文 |
| `/tags/[tag]/` | 同じタグを持つ記事一覧 |
| `/about` | Wikiの目的と追加方法 |

`draft: true`の記事はどの一覧にも詳細ページにも出しません。

実装順序は、Collection、記事三つ、トップページ、記事詳細、タグページ、共通CSSとします。

<details>
<summary>ヒント1</summary>

Collectionは`defineCollection({ loader: glob(...), schema: ... })`で定義します。

</details>

<details>
<summary>ヒント2</summary>

記事本文は`const { Content } = await render(entry)`として取得できます。

</details>

<details>
<summary>ヒント3</summary>

タグ集合は`[...new Set(entries.flatMap((entry) => entry.data.tags))]`で作れます。

</details>

## 16:00 発展

RSS、関連記事、前後の記事へのリンク、CSS Custom Propertiesの整理から一つを選びます。

追加した機能がビルド時に生成されるのか、ブラウザで実行されるのかも記録します。

## 17:00 検証

```sh
npm run check
npm run build
npm run preview
```

frontmatterの`title`を一時的に削除し、ビルドが失敗することも確認します。

## 完成条件

- Markdownを一つ追加すると一覧と詳細ページが増える。
- 下書き記事が公開ページへ出ない。
- タグページから該当記事だけを開ける。
- `npm run check`と`npm run build`が成功する。

## 振り返り

1. `.astro`のコードフェンスが実行される場所を書く。
2. Content Collectionを使わずにMarkdownを直接importする構成との差を書く。
3. schema違反がいつ検出されたかを書く。
4. このWikiにブラウザ側JavaScriptが必要になる機能を一つ挙げる。

## 公式資料

- [Astro Getting Started](https://docs.astro.build/en/getting-started/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Dynamic routes](https://docs.astro.build/en/guides/routing/#dynamic-routes)

