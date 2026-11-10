# PSEdit

> 日本語・韓国語の業務文書を、読み手が最初の画面で結論・決めること・やることが分かるように書き、ブラッシュアップする Claude Code のスキルです。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](README.md) · **日本語** · [한국어](README.ko.md)

PSEdit は **P**olishing / **S**tylistic **Edit**ing（ブラッシュアップ / 윤문）の略です。

```text
勤怠システムを A 社から B 社に替えるかの検討資料を書いて。利用者 120 人、A 社は 1 人月 500 円、B 社は 380 円、契約更新は 12 月 31 日。
```

PSEdit を入れてからこう頼むと、Claude は決まった順で検討資料を書きます。先頭に 3 行以内の結論（推奨案、理由 1 行、誰がいつ何をするか）、その下に項目ごとに推奨を付けた**要判断**、そのあとにようやく背景・根拠・比較表が来ます。スキル名を言う必要はありません。

---

## なぜ作ったか

AI と作業していると、AI が設計書、検討資料、調査資料、利用者マニュアルなどの文書をたくさん書いてくれ、作業中は説明もしてくれます。内容が間違っているわけではありません。ただ、文章が長く、同じ説明が繰り返され、何より**結局結論は何なのか、自分は何を選べばよいのか、どうすればよいのか**がはっきりせず、困ることがよくありました。

そこで PSEdit は**構成を先に**（結論 → 要判断 → 背景 → 根拠 → 詳細）、**文体をあとで**直し、原文の事実・数字・条件・確度は変えません。任意のグローバルルールを入れると、作業中の説明にも同じ原則が適用されます。

## できること

| 領域 | 内容 |
| --- | --- |
| 3 つのモード | 新しい文書の**作成** ・ 既存の文書や貼り付けた文章の**ブラッシュアップ** ・ 別の詳しさや別の言語への**版の変換** |
| 6 種類の文書 | 設計書、検討資料、調査資料、利用者マニュアル、作業報告、議事録。それぞれ日本語・韓国語のテンプレート |
| 技術スタックの図 | 技術仕様書や詳しい技術説明に、構成図・技術ごとの役割表・連携の流れを頼まなくても入れる。Markdown（Mermaid）と HTML（SVG）のどちらにするかを先に決め、決まらなければ推奨を付けて尋ねる |
| 構成チェック | 結論が最初の画面にあるか、決めることが 1 か所にまとまっているか、繰り返しがないかを見るセルフチェック表 |
| 文体パターン辞書 | 日本語・韓国語の辞書（結論の回避、前置き、無生物主語・受け身、翻訳調、口癖語、記号）。パターンごとに重大度を表示 |
| 不変条件 | 新しい事実・数字・固有名詞を作らない。否定・条件・時制・確度・単位を変えない。コードブロックと表の中のデータはそのまま |
| 詳しさ | `short` ・ `normal` ・ `detailed`。依頼の言葉（「簡潔に」「詳しく」など）で決まり、文書の frontmatter に記録 |
| 自分の好み | 「この言い方はやめて」と 1 回言えば `~/.claude/psedit/taste.md` に保存され、以後ずっと適用 |
| プロジェクトの文書標準 | プロジェクトに独自の文書様式があればその構成を守り、結論を先頭に移して文体をチェックするだけ |
| 案内フック（任意） | 依頼に文書の種類が出てきたら、スキルを使うよう Claude に知らせる `UserPromptSubmit` フック。プロジェクトごとにオフにできる |

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
要確認: 原文だけでは確かめられない事実
```

原文に結論がなければ、結論を作り出しません。原文の事実から作れる結論の候補を 2〜3 個、推奨付きで示し、利用者が選んだ候補を入れます。

## 仕組み

| 仕掛け | 場所 | 役割 |
| --- | --- | --- |
| スキルの説明 | `skills/psedit/SKILL.md` | いつ PSEdit を使うかを Claude に伝え、手順を持つ |
| グローバルルール（任意） | `~/.claude/CLAUDE.md` | すべてのセッションに文章ルールを入れる |
| 案内フック（任意） | `skills/psedit/hooks/psedit-prompt.mjs` | 依頼に文書の種類が出てきたら 1 行の案内を足す |

ルールがぶつかったときの順番: 今回の依頼の指示 > 不変条件（事実・数字・意味） > 好みのルール > テンプレート・パターン辞書。

## 制限事項

- 対象は日本語と韓国語だけです。英語の文書は対象外です。
- スキル内部の指示は韓国語で書かれています。Claude は問題なく読みますが、手を入れるときは翻訳が要るかもしれません。
- README・CHANGELOG・コードのコメント・コミットメッセージ・プロンプトファイルにはテンプレートを当てません。
- PSEdit は Claude への指示であって、検査ツール（linter）ではありません。結果はモデルと与えた事実によって変わります。

## ディレクトリ構成

```text
skills/psedit/
  SKILL.md                 スキル本体: モード、不変条件、手順
  templates/{ko,ja}/       設計書、検討資料、調査資料、マニュアル、作業報告、議事録
  references/              構成チェック表、文体パターン辞書、技術スタックの図のルール、出典
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
