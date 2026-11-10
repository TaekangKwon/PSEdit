# PSEdit

> 日本語・韓国語の業務文書を、読み手が最初の画面で結論・決めること・やることが分かるように書き、ブラッシュアップする Claude Code のスキルです。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](README.md) · **日本語** · [한국어](README.ko.md)

PSEdit は **P**olishing / **S**tylistic **Edit**ing（ブラッシュアップ / 윤문）の略です。

## 使用例

頼むだけで、結論が先頭に来る文書が出てきます。スキル名を言う必要はありません。

依頼：

```text
勤怠システムを A 社から B 社に替えるかの検討資料を書いて。利用者 120 人、A 社は 1 人月 500 円、B 社は 380 円、契約更新は 12 月 31 日。
```

結果の最初の画面：

```markdown
## 結論
B 社への切り替えを推奨します。
理由：120 人で年 172,800 円のコスト減になります。
やること：12 月 31 日の契約更新までに A 社の解約と B 社の契約を済ませます。

## 要判断
1. A 社との契約を更新するか — 推奨：更新しない（1 人月 120 円安い）。期限：12 月 31 日
```

ここだけ読めば、何を決めればよいかが分かります。背景・根拠・比較表はその下に続きます。

---

## なぜ作ったか

AI と作業していると、AI が設計書、検討資料、調査資料、利用者マニュアルなどの文書をたくさん書いてくれ、作業中は説明もしてくれます。内容が間違っているわけではありません。ただ、文章が長く、同じ説明が繰り返され、何より**結局結論は何なのか、自分は何を選べばよいのか、どうすればよいのか**がはっきりせず、困ることがよくありました。

そこで PSEdit は**構成を先に**（結論 → 要判断 → 背景 → 根拠 → 詳細）、**文体をあとで**直し、原文の事実・数字・条件・確度は変えません。`~/.claude/CLAUDE.md` に文章ルールを貼り付けると（インストールの手順 2、任意）、文書だけでなく作業中の説明にも同じ原則が適用されます。

## できること

### 頼めること

| 依頼 | 結果 |
| --- | --- |
| 新しい文書を書く | 設計書、検討資料、調査資料、利用者マニュアル、作業報告、議事録の 6 種類を、結論が先頭に来る日本語・韓国語の様式で書く |
| 既存の文章をブラッシュアップ | 文書や貼り付けた文章の結論を先頭に移し、結論をぼかす言い方・中身のない前置き・翻訳調・繰り返しを減らす。何を直したかを報告する |
| 別の版を作る | 同じ文書の要約版・詳細版、日本語版・韓国語版。版が違っても結論は同じ |
| 分量の調整 | 「簡潔に」「詳しく」「짧게」などの言葉で `short`・`normal`・`detailed` のどれかを選ぶ。ファイルに保存する文書は frontmatter に記録 |
| 言い方の禁止 | 「この言い方はやめて」と 1 回言えば `~/.claude/psedit/taste.md` に保存され、以後ずっと適用 |
| 技術仕様書・技術スタックの説明 | 構成図、技術ごとの役割表、連携の流れを頼まなくても入れる。形式（Markdown＋Mermaid / HTML＋SVG）が決まっていなければ、推奨を付けて先に尋ねる |
| 画面操作のある利用者マニュアル | 画面画像＋番号札＋同じ番号の短い操作リストで書く。キャプチャできなければ似た再現イメージを作り、そう明記する。章が 4 つ以上の HTML マニュアルは左固定の目次とタイトル帯で組む |

### 守られること

- 原文にない事実・数字・名前を作りません。否定・条件・時制・確度・単位も変えません。コードブロックと表の中のデータはそのままです。
- プロジェクトに独自の文書様式があればその構成を守り、結論を先頭に移して文体をチェックするだけにします。

## 必要なもの

- [Claude Code](https://claude.com/claude-code)（デスクトップアプリまたは CLI）
- Node.js — 案内フックを使うときだけ

## インストール

### 1. リポジトリを取得してスキルをリンクする

macOS / Linux:

```bash
git clone https://github.com/TaekangKwon/PSEdit.git
ln -s "$PWD/PSEdit/skills/psedit" ~/.claude/skills/psedit
```

Windows（PowerShell）:

```powershell
git clone https://github.com/TaekangKwon/PSEdit.git
New-Item -ItemType Junction -Path "$HOME\.claude\skills\psedit" -Target "$PWD\PSEdit\skills\psedit"
```

コピーではなくリンクなので、`git pull` 1 回で全プロジェクトのスキルが更新されます。入れたあとは Claude Code で新しいセッションを開き、`/psedit` と打って一覧に出るかを確かめます。

### 2. （任意）グローバルの `CLAUDE.md` に文章ルールを足す

[`install/CLAUDE.snippet.md`](install/CLAUDE.snippet.md) には短い文章ルール（結論を先に、選択肢は 1 つを推奨、決めることは 1 か所に、締めの要約を付けない）があります。`~/.claude/CLAUDE.md` に足すと、文書だけでなく Claude の**すべて**の回答に効き、6 種類の文書では PSEdit を使うよう案内します。ルールは韓国語（一部日本語）で書かれています。足す前に `CLAUDE.md` をバックアップしてください。コマンドは[利用マニュアル](manual/psedit-manual.ja.md#1-導入)にあります。

### 3. （任意）案内フックを登録する

`~/.claude/settings.json` の `hooks.UserPromptSubmit` に入れます:

```json
"UserPromptSubmit": [
  {
    "hooks": [
      { "type": "command", "command": "node \"$HOME/.claude/skills/psedit/hooks/psedit-prompt.mjs\"" }
    ]
  }
]
```

プロジェクトごとに動きを変えるには、そのプロジェクトのルートに `.claude/psedit.json` を置きます:

| `hook` | 動き |
| --- | --- |
| `auto`（既定） | 依頼に設計書・議事録・ブラッシュアップ・회의록・윤문 などのキーワードがあるときだけ案内 |
| `always` | すべての依頼に案内（文書だけを扱うリポジトリ向け） |
| `off` | 案内しない（独自の文書ツールを使うプロジェクト向け） |

## 使い方

いつもどおり日本語か韓国語で頼みます:

```text
議事録を書いて。（メモを貼り付ける）
docs/plan/api-design.md をブラッシュアップして
이 설계서의 한국어판을 만들어 줘 (짧게)
「活用する」は今後使わないで。「使う」にして。
```

ブラッシュアップでは書き手の口調（敬体・常体、よく使う言い回し）を残し、何を直したかを報告します:

```text
構成: 5 節の結論にあった推奨の 2 文を先頭に移し、要判断 3 件をまとめた
文体: 16/33
要確認: 3 節の「応答時間 30% 短縮」は測定条件が原文にない
```

`文体: 16/33` は全 33 文のうち 16 文を直したという意味です。`要確認` には原文だけでは確かめられない事実が出ます。

原文に結論がなければ、結論を作り出しません。原文の事実から作れる結論の候補を 2〜3 個、推奨付きで示し、利用者が選んだ候補を入れます。

## 制限事項

- 対象は日本語と韓国語だけです。英語の文書は対象外です。
- スキル内部の指示は韓国語で書かれています。Claude は問題なく読みますが、手を入れるときは翻訳が要るかもしれません。
- README・CHANGELOG・コードのコメント・コミットメッセージ・プロンプトファイルにはテンプレートを当てません。決まった形式がある文章なので、結論から書く構成が合わないためです。
- PSEdit は Claude への指示であって、検査ツール（linter）ではありません。結果はモデルと与えた事実によって変わります。

## ディレクトリ構成

```text
skills/psedit/
  SKILL.md                 スキル本体: モード、不変条件、手順
  templates/{ko,ja}/       設計書、検討資料、調査資料、マニュアル、作業報告、議事録
  references/              構成チェック表、文体パターン辞書、技術スタックの図のルール、マニュアル画面のルール、出典
  hooks/                   任意の UserPromptSubmit フック
install/CLAUDE.snippet.md  任意のグローバル文章ルール
manual/                    利用マニュアル（日本語、韓国語）
```

## ドキュメント

- 利用マニュアル: [日本語](manual/psedit-manual.ja.md) ・ [한국어](manual/psedit-manual.ko.md)
- フックの設定: [skills/psedit/hooks/README.md](skills/psedit/hooks/README.md)（韓国語）
- 参考資料とライセンス: [skills/psedit/references/SOURCES.md](skills/psedit/references/SOURCES.md)（韓国語）

## 謝辞

PSEdit のパターン辞書・チェック表・テンプレートはすべて新しく書きました。考え方は次のプロジェクトと指針から得ています。詳細とライセンスは [SOURCES.md](skills/psedit/references/SOURCES.md) にあります。

- [dotoridot/korean-humanizer](https://github.com/dotoridot/korean-humanizer)、[epoko77-ai/im-not-ai](https://github.com/epoko77-ai/im-not-ai)、[iKora128/stop-ai-slop-jp](https://github.com/iKora128/stop-ai-slop-jp)、[@textlint-ja/textlint-rule-preset-ai-writing](https://www.npmjs.com/package/@textlint-ja/textlint-rule-preset-ai-writing)、[thkt/dotclaude](https://github.com/thkt/dotclaude)、[byungjunjang/slop-rewrite](https://github.com/byungjunjang/slop-rewrite)（いずれも MIT）
- [aktsmm/Agent-Skills](https://github.com/aktsmm/Agent-Skills)（CC BY-NC-SA 4.0）— 常時のルールとスキルを分ける構成の考え方だけを参考にし、内容は写していません
- Barbara Minto『The Pyramid Principle』、[Diátaxis](https://diataxis.fr/)、[Federal Plain Language Guidelines](https://digital.gov/guides/plain-language)、文化審議会「公用文作成の考え方」、국립국어원「쉬운 공문서 쓰기 길잡이」

## 開発元

このプロジェクトは、岡山県笠岡市の小さなソフトウェア会社 **株式会社システム・エムズ**（SYSTEM EMUZU CO.,LTD.、2000 年設立）の Kwon がメンテナンスしています。\
私たちは「create rich time」をモットーに、ミスや手間を減らして使う人の時間を豊かにするシステムを作っているチームです。イベントの受付、土木・建築の積算、生産管理など、業務で使う Web システムを設計から保守まで手がけています。

- 🌐 [公式ホームページ](https://msap2.jp/emuzu/)
- ✍️ [技術ブログ](https://msap2.jp/emuzu/blog/) — 自社で作ったアプリや AI の活用について

## ライセンス

[MIT](LICENSE)。
