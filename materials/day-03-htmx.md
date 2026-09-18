# Day 3：htmx

## 今日のゴール

Reactを使わず、追加、完了、削除、絞り込みができる学習トピックボードを作ります。

サーバーはJSONではなく、画面へ差し替えられるHTMLフラグメントを返します。

## 時間割

| 時刻 | 内容 |
| --- | --- |
| 10:00〜11:00 | HypermediaとHTMLフラグメント |
| 11:00〜12:00 | 属性による部分更新の小演習 |
| 12:00〜13:00 | 休憩 |
| 13:00〜16:00 | 学習トピックボード |
| 16:00〜17:00 | エラー表示と発展課題 |
| 17:00〜18:00 | テストと振り返り |

## 10:00 概念理解

通常のリンクとフォームは、サーバーへHTTPリクエストを送り、返されたHTMLでページ全体を更新します。

htmxは同じHTTPとHTMLを使いながら、更新対象と差し替え方をHTML属性で指定します。

`hx-get`や`hx-post`は送るリクエストを指定し、`hx-target`は返されたHTMLを置く要素を指定します。

`hx-swap`は対象要素の内側を置き換えるのか、要素自体を置き換えるのかを決めます。

このアプリでは、トピックの状態をサーバーが持ち、ブラウザには表示に必要なHTMLを返します。

## 11:00 小演習

```sh
cd starters/day-03-htmx
npm install
npm run dev
```

ボタンから`GET /fragments/greeting`を送り、返された`<p>`を`#result`へ入れます。

次にフォームを`POST /fragments/echo`へ送り、通信中だけインジケーターを表示します。

ブラウザのNetworkタブで、レスポンスがJSONではなくHTMLになっていることを確認します。

<details>
<summary>ヒント1</summary>

リクエスト元の要素に`hx-get`または`hx-post`を付けます。

</details>

<details>
<summary>ヒント2</summary>

`hx-target="#result"`は差し替え先をCSSセレクターで指定します。

</details>

<details>
<summary>ヒント3</summary>

フォームの入力値は通常の`name`属性を使って送ります。

</details>

## 13:00 ミニアプリ制作

| メソッドとパス | 返すHTML |
| --- | --- |
| `GET /` | 完全なページ |
| `GET /topics?status=all` | トピック一覧 |
| `POST /topics` | 追加後の一覧またはエラー付きフォーム |
| `PATCH /topics/:id/toggle` | 状態を反転した`<li>` |
| `DELETE /topics/:id` | 空のレスポンス |

データはメモリ上に置くため、開発サーバーを再起動すると初期状態へ戻ります。

これはhtmxの制約ではなく、この日の焦点をHTML交換へ絞るための選択です。

実装順序は、初期データ、完全なページ、追加、完了状態の反転、削除、絞り込みとします。

利用者が入力した文字列はHTMLへ埋め込む前にエスケープします。

文字列連結を使う場合、`&`、`<`、`>`、`"`、`'`を変換しないと、入力がHTMLとして解釈されます。

<details>
<summary>ヒント1</summary>

更新ボタンには`hx-patch`、`hx-target="closest li"`、`hx-swap="outerHTML"`を組み合わせます。

</details>

<details>
<summary>ヒント2</summary>

削除には`hx-delete`と`hx-swap="delete"`を使えます。

</details>

<details>
<summary>ヒント3</summary>

完成例は入力エラーを200で返し、フォーム領域を交換する単純な方式を採用しています。

</details>

## 16:00 発展とテスト

`npm test`でHTML生成関数と主要ルートを検証します。

発展課題は、`hx-push-url`、Out of Band Swap、通信失敗表示、通常のフォーム送信への対応から一つを選びます。

## 完成条件

- ページ遷移なしで追加、完了、削除、絞り込みが動く。
- Networkタブで各レスポンスのHTMLを説明できる。
- `<script>`を含むタイトルがスクリプトとして実行されない。
- `npm test`と`npm run check`が成功する。

## 振り返り

1. JSON APIとHTMLフラグメントAPIで、画面構築を担当する場所の違いを書く。
2. `innerHTML`と`outerHTML`を使った箇所と理由を書く。
3. サーバーが持つ状態とブラウザが持つ状態を分けて書く。
4. クライアント状態管理が適する機能を一つ挙げる。

## 公式資料

- [htmx Documentation](https://htmx.org/docs/)
- [htmx Reference](https://htmx.org/reference/)
- [hx-target](https://htmx.org/attributes/hx-target/)
- [hx-swap](https://htmx.org/attributes/hx-swap/)

