# 5 Days Tech Tasting

5日間で五つのWeb系技術を試し、毎日一つの小さなプロダクトを完成させる個人学習用教材です。

題材は「技術学習ログ」で揃えていますが、各日のプロジェクトは単独で実行できます。

## 5日間の成果物

| 日 | 技術 | 成果物 |
| --- | --- | --- |
| [Day 1](materials/day-01-hono-workers.md) | HonoとCloudflare Workers | D1に保存する学習ログAPI |
| [Day 2](materials/day-02-astro.md) | Astro | MarkdownベースのTech Wiki |
| [Day 3](materials/day-03-htmx.md) | htmx | 学習トピックボード |
| [Day 4](materials/day-04-deno.md) | Deno | 学習リソースチェッカーCLI |
| [Day 5](materials/day-05-rust.md) | Rust | 学習時間記録CLI |

## 教材の使い方

各日は10:00から18:00までを想定しています。

教材を読みながら、対応する`starters/day-XX-*`だけを編集してください。

演習には三段階のヒントがあります。

最初はヒントを閉じたまま試し、15分以上進まないときに一段ずつ開きます。

完成例は`solutions/`に分離しています。

振り返りを記入するまでは、`solutions/`を開かない進め方を推奨します。

## 事前準備

- Git
- Node.js 22.12以降とnpm
- Cloudflareアカウント
- [Deno](https://docs.deno.com/runtime/getting_started/installation/)
- [RustとCargo](https://www.rust-lang.org/tools/install)

開始前に次のコマンドが実行できることを確認します。

```sh
git --version
node --version
npm --version
deno --version
rustc --version
cargo --version
```

Cloudflareへのデプロイ以外はローカルで完結します。

認証情報、`.dev.vars`、実データ、Cloudflareが生成するローカル状態はGitに追加しません。

## 検証環境

教材と完成例は2026年9月18日時点の公式ドキュメントに基づいています。

依存関係の正確なバージョンは各プロジェクトの設定ファイルとlockfileを正とします。

外部サービスの画面やCLIは変更されるため、教材と表示が異なる場合は各日の「公式資料」を確認してください。

## 模範解答

模範解答には課題の実装がすべて含まれます。

自分の実装をコミットしてから比較すると、差分を学習記録として残せます。

- [模範解答の案内](solutions/README.md)
