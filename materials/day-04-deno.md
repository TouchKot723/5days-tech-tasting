# Day 4：Deno

## 今日のゴール

URL一覧を検査し、結果をJSONへ保存するCLIを作ります。

Denoの権限モデル、Web API、組み込みのテスト、lint、formatを一つのプログラムで確認します。

## 時間割

| 時刻 | 内容 |
| --- | --- |
| 10:00〜11:00 | DenoとNode.jsの実行モデル |
| 11:00〜12:00 | 引数、ファイル、権限の小演習 |
| 12:00〜13:00 | 休憩 |
| 13:00〜16:00 | リソースチェッカーCLI |
| 16:00〜17:00 | テスト、lint、compile |
| 17:00〜18:00 | 検証と振り返り |

## 10:00 概念理解

DenoはTypeScriptを直接実行し、`fetch`、`Request`、`Response`などのWeb APIを標準で提供します。

`deno.json`のtaskは、Node.jsプロジェクトにおける`package.json`のscriptsに近い役割を持ちます。

ただし、ファイル、ネットワーク、環境変数へのアクセスは既定で拒否されます。

**権限フラグ**は、プログラムが利用できる外部資源を実行時に限定します。

`--allow-all`でも動作しますが、どの資源が必要なのかを確認できなくなるため、この演習では使いません。

## 11:00 小演習

```sh
cd starters/day-04-deno
deno task start --input resources.txt --output report.json
```

最初はtaskへ権限を追加せず、エラーを読みます。

`Deno.args`、`Deno.readTextFile()`、`fetch()`、`Deno.writeTextFile()`を順番に使い、必要な権限を一つずつ追加します。

権限エラーは、プログラムが要求した資源を示す観察材料です。

<details>
<summary>ヒント1</summary>

実行時の引数は`Deno.args`へ文字列の配列として入ります。

</details>

<details>
<summary>ヒント2</summary>

テキストファイルは`await Deno.readTextFile(path)`で読めます。

</details>

<details>
<summary>ヒント3</summary>

taskへ読み取り、書き込み、ネットワークの許可を必要な範囲で指定します。

</details>

## 13:00 ミニアプリ制作

```sh
deno task start --input resources.txt --output report.json
```

入力ファイルは1行に一つURLを書き、空行と`#`から始まる行を無視します。

出力は次の形のJSON配列です。

```json
[
  {
    "url": "https://docs.deno.com/",
    "ok": true,
    "status": 200,
    "elapsedMs": 124,
    "error": null
  }
]
```

HTTPエラーや接続失敗があっても、ほかのURLの検査を続けます。

一件以上失敗した場合はレポートを書いたあと、終了コードを1にします。

実装順序は、引数解析、入力解析、時間計測、並行取得、JSON出力、終了コードとします。

<details>
<summary>ヒント1</summary>

引数解析は`@std/cli/parse-args`を使えます。

</details>

<details>
<summary>ヒント2</summary>

`fetch()`がHTTP 404を受け取っても例外にはならないため、`response.ok`を別に確認します。

</details>

<details>
<summary>ヒント3</summary>

接続失敗を`catch`で結果へ変換すると、`Promise.all()`が途中で失敗しません。

</details>

## 16:00 テストと発展

URL検査関数へ`fetch`互換関数を渡せるようにし、テストでは固定レスポンスを返します。

```sh
deno test
deno lint
deno fmt --check
deno check main.ts
```

発展課題は、タイムアウト、同時接続数の制限、Markdown出力、`deno compile`から一つを選びます。

## 完成条件

- 成功と失敗を同じレポートへ保存できる。
- 読み取り、書き込み、ネットワークの権限を必要な範囲だけ許可する。
- 一件の失敗で残りの検査が中断しない。
- test、lint、format、checkが成功する。

## 振り返り

1. 実行中に要求された権限と、その権限が必要だったコードを書く。
2. Node.jsで同じCLIを作る場合に別途選ぶ必要がある道具を書く。
3. HTTPエラーと接続エラーの処理が異なる理由を書く。
4. このCLIを定期実行するときに追加したい情報を一つ挙げる。

## 公式資料

- [Run code](https://docs.deno.com/runtime/run/)
- [Build CLI apps](https://docs.deno.com/runtime/cli_apps/)
- [Permissions](https://docs.deno.com/runtime/fundamentals/security/)
- [Testing](https://docs.deno.com/runtime/fundamentals/testing/)
- [Linting and formatting](https://docs.deno.com/runtime/lint_and_format/)

