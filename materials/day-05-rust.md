# Day 5：Rust入門

## 今日のゴール

学習時間をファイルへ記録し、一覧と技術別集計を表示するCLIを完成させます。

所有権、借用、`Result`を、ファイルを扱う小さなプロダクトの中で使います。

## 時間割

| 時刻 | 内容 |
| --- | --- |
| 10:00〜11:00 | Cargo、型、所有権、借用 |
| 11:00〜12:00 | 所有権エラーを直す小演習 |
| 12:00〜13:00 | 休憩 |
| 13:00〜16:00 | 学習時間記録CLI |
| 16:00〜17:00 | テスト、エラー処理、発展課題 |
| 17:00〜18:00 | 品質チェックと振り返り |

## 10:00 概念理解

CargoはRustプロジェクトの作成、ビルド、依存関係、テストを扱います。

`cargo check`は実行ファイルの生成を省き、型と借用の問題を短い周期で検査します。

Rustでは、一つの値に対して所有者が定まり、所有者のスコープを抜けると値が破棄されます。

**借用**は、所有権を移さずに参照を一時的に渡す仕組みです。

回復可能な失敗は`Result<T, E>`で表し、呼び出し側が成功と失敗の両方を処理します。

## 11:00 小演習

```sh
cd starters/day-05-rust
cargo run
```

次のコードの`length`へ`topic`を渡したあと、もう一度`topic`を使い、コンパイルエラーを確認します。

```rust
fn length(text: String) -> usize {
    text.len()
}
```

`length`の引数を`&str`へ変え、呼び出し側から`&topic`を渡して修正します。

<details>
<summary>ヒント1</summary>

`String`を値として渡すと、既定では所有権が呼び出し先へ移動します。

</details>

<details>
<summary>ヒント2</summary>

読み取りだけなら`&str`や`&[StudyLog]`を引数にできます。

</details>

<details>
<summary>ヒント3</summary>

借用した参照から値を変更する必要がなければ、`&mut`は不要です。

</details>

## 13:00 ミニアプリ制作

```sh
cargo run -- add rust 45 "所有権を試した"
cargo run -- list
cargo run -- summary
```

`add`は技術名、1以上1440以下の分数、空でないメモを受け取ります。

記録は作業ディレクトリの`study-log.tsv`へ追記します。

1行は`technology<TAB>minutes<TAB>note`とし、タブと改行を含む入力を拒否します。

`list`は保存順に全件を表示し、`summary`は技術ごとの合計時間を技術名順に表示します。

`main.rs`は引数の取得、エラー表示、終了コードを担当し、`lib.rs`は解析、保存、集計を担当します。

実装順序は、データ型、引数解析、TSV変換、追記、読み込み、集計、エラー表示とします。

<details>
<summary>ヒント1</summary>

コマンドごとに異なる値は`enum Command { Add { ... }, List, Summary }`で表せます。

</details>

<details>
<summary>ヒント2</summary>

エラーを呼び出し元へ返す関数は`Result<成功時の型, String>`から始められます。

</details>

<details>
<summary>ヒント3</summary>

ファイルが存在しない場合だけ空配列を返し、ほかのI/Oエラーは返します。

</details>

## 16:00 テストと発展

副作用のない引数解析、TSV変換、集計を単体テストします。

```sh
cargo fmt --check
cargo clippy -- -D warnings
cargo test
```

発展課題は、日付、CSV出力、`clap`、`serde`から一つを選びます。

## 完成条件

- `add`した記録が別の実行でも残る。
- `list`が全件を表示し、`summary`が技術別合計を表示する。
- 不正な分数、未知のコマンド、壊れたTSVでpanicしない。
- fmt、clippy、testが成功する。

## 振り返り

1. 所有権を移動した箇所と借用した箇所を一つずつ挙げる。
2. `struct`と`enum`が表した対象の違いを書く。
3. `Result`を返す関数と、エラーを表示する場所を分けた理由を書く。
4. TypeScriptで同じCLIを書く場合と比べ、コンパイル時に見つかった問題を書く。

## 公式資料

- [The Rust Programming Language](https://doc.rust-lang.org/book/)
- [Understanding Ownership](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)
- [Error Handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html)
- [Writing Automated Tests](https://doc.rust-lang.org/book/ch11-00-testing.html)
- [Cargo Guide](https://doc.rust-lang.org/cargo/guide/)

