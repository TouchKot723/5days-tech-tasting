# Day 1：HonoとCloudflare Workers

## 今日のゴール

D1に学習記録を保存するAPIを作り、Cloudflare Workersへデプロイします。

ローカルで動くだけでは完了にせず、公開URLへ`curl`を送り、保存した記録を取得できるところまで確認します。

## 時間割

| 時刻 | 内容 |
| --- | --- |
| 10:00〜11:00 | Workers、Hono、Web標準API、Binding |
| 11:00〜12:00 | ルーティングとレスポンスの小演習 |
| 12:00〜13:00 | 休憩 |
| 13:00〜16:00 | D1を使う学習ログAPI |
| 16:00〜17:00 | テスト、入力検証、発展課題 |
| 17:00〜18:00 | デプロイ、動作確認、振り返り |

## 10:00 概念理解

Cloudflare Workersは、HTTPリクエストを受け取り、Web標準の`Response`を返す実行環境です。

常駐プロセスを起動するNode.jsサーバーとは、アプリケーションの入口が異なります。

Honoは、この`Request`と`Response`の上にルーティング、Context、ミドルウェアを提供します。

**Binding**は、WorkerからD1やKVなどのCloudflareリソースへアクセスするための接続口です。

ローカルD1とリモートD1は別のデータベースです。

この区別があるため、開発中の操作が公開データを誤って変更する可能性を減らせます。

リクエストは、Wrangler、Honoのルーター、ハンドラー、D1、JSONレスポンスの順に処理されます。

## 11:00 小演習

```sh
cd starters/day-01-hono-workers
npm install
npm run dev
```

`src/index.ts`に次のルートを順番に実装します。

1. `GET /`で`Hello Hono!`というテキストを返す。
2. `GET /api/hello`で`{"message":"Hello Hono!"}`を返す。
3. `GET /api/hello/:name`でパスパラメータをJSONへ入れる。
4. 定義していないパスで404を返す。

```sh
curl -i http://localhost:8787/api/hello/Astro
curl -i http://localhost:8787/missing
```

<details>
<summary>ヒント1</summary>

Honoでは`app.get()`の第一引数にパス、第二引数にハンドラーを渡します。

</details>

<details>
<summary>ヒント2</summary>

パスパラメータは`c.req.param("name")`で取得できます。

</details>

<details>
<summary>ヒント3</summary>

JSONとステータスコードは`c.json({ error: "Not found" }, 404)`の形で返せます。

</details>

## 13:00 ミニアプリ制作

学習ログは次の形で表します。

```json
{
  "id": 1,
  "technology": "Hono",
  "minutes": 90,
  "note": "D1 Bindingを試した",
  "learnedOn": "2026-09-19",
  "createdAt": "2026-09-19T07:00:00.000Z"
}
```

| メソッドとパス | 成功時 | 用途 |
| --- | --- | --- |
| `GET /api/logs` | 200 | 新しい順で一覧を返す |
| `GET /api/logs/:id` | 200または404 | 1件を返す |
| `POST /api/logs` | 201または400 | 記録を追加する |
| `DELETE /api/logs/:id` | 204または404 | 記録を削除する |

`technology`は空でない文字列、`minutes`は1以上1440以下の整数、`learnedOn`は`YYYY-MM-DD`形式とします。

`note`を省略した場合は空文字列として保存します。

`migrations/0001_create_study_logs.sql`へテーブル定義を書き、ローカルDBへ適用します。

```sh
npm run db:migrate:local
```

ハンドラーからは`c.env.DB.prepare(...)`でSQLを準備し、値を`bind()`へ渡します。

利用者が送った値をSQL文字列へ直接連結すると、入力がSQLの一部として解釈されるため避けます。

実装順序は、型定義、一覧、1件取得、入力検証、追加、削除、404とします。

```sh
curl -i -X POST http://localhost:8787/api/logs \
  -H 'content-type: application/json' \
  -d '{"technology":"Hono","minutes":90,"note":"D1を試した","learnedOn":"2026-09-19"}'
curl -i http://localhost:8787/api/logs/1
curl -i -X DELETE http://localhost:8787/api/logs/1
```

<details>
<summary>ヒント1</summary>

一覧取得には`SELECT ... FROM study_logs ORDER BY learned_on DESC, id DESC`を使えます。

</details>

<details>
<summary>ヒント2</summary>

1件取得には`first()`、一覧取得には`all()`が使えます。

</details>

<details>
<summary>ヒント3</summary>

追加後のIDは`result.meta.last_row_id`から取得し、そのIDで保存済みの行を読み直します。

</details>

## 16:00 発展とテスト

`npm test`を実行し、副作用のない入力検証をテストします。

発展課題は、技術名による絞り込み、更新API、ページング、CORSから一つを選びます。

## 17:00 デプロイ

```sh
npx wrangler login
npx wrangler d1 create five-days-study-log
```

表示された`database_id`を`wrangler.jsonc`へ設定します。

```sh
npm run db:migrate:remote
npm run deploy
```

## 完成条件

- ローカルD1へ追加したデータを取得できる。
- 不正入力が400、存在しないIDが404になる。
- `npm test`と`npm run check`が成功する。
- 公開URLへ追加したデータが次のリクエストでも残る。

## 振り返り

1. Honoが担当した処理とWorkersが担当した処理を分けて書く。
2. Bindingを通常の環境変数と比べ、渡しているものの違いを書く。
3. ローカルD1とリモートD1を分ける理由を書く。
4. 次に追加するAPIを一つ選び、必要な入力とレスポンスを書く。

## 公式資料

- [Hono Getting Started](https://hono.dev/docs/getting-started/basic)
- [Hono Testing](https://hono.dev/docs/guides/testing)
- [Cloudflare D1 Getting Started](https://developers.cloudflare.com/d1/get-started/)
- [Wrangler commands](https://developers.cloudflare.com/workers/wrangler/commands/)

