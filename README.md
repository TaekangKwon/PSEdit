# PSEdit

> A Claude Code skill that writes and polishes Korean and Japanese business documents so the reader sees the conclusion, the decisions and the next actions on the first screen.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**English** · [日本語](README.ja.md) · [한국어](README.ko.md)

PSEdit stands for **P**olishing / **S**tylistic **Edit**ing (윤문 / ブラッシュアップ).

```text
Notion을 Confluence로 바꿀지 검토자료 써줘. 사용자 120명, Notion 1인당 월 15달러, Confluence 11달러, 갱신일 12월 31일.
```

With PSEdit installed, Claude answers a request like this with a review document in a fixed order: a conclusion of three lines or fewer (the recommendation, one reason, who does what by when), then a **Decisions needed** list that recommends an option for each item, and only then the background, evidence and comparison table. You do not have to mention the skill.

---

## Why this exists

When I work with AI, it writes many documents for me, such as designs, review documents, research notes and user manuals, and it explains what it is doing as it works. The content is not wrong. But it is often wordy and repetitive, and above all it does not make clear **what the conclusion is, what I need to choose, or what I need to do**. That often left me stuck.

So PSEdit fixes the **structure first** (conclusion → decisions → background → evidence → details) and the **style second**, and it never changes the facts, numbers, conditions or certainty of the original. With the optional global rules, the same principle also applies to what the AI explains while it works.

## What it does

| Area | What you get |
| --- | --- |
| Three modes | **Write** a new document · **Polish** an existing document or pasted text · **Convert** a document to another level of detail or the other language |
| Six document types | Design, review (decision request), research, user manual, work report, meeting minutes — each with a Korean and a Japanese template |
| Tech-stack diagrams | Technical specs and detailed tech explanations get a stack diagram, a role-per-technology table and an integration flow without being asked. The format — Markdown (Mermaid) or HTML (SVG) — is settled first; if nothing settles it, you are asked, with a recommendation |
| Numbered screenshots in manuals | User manuals show each screen as an image with numbered markers and a matching short list of actions. If a screen cannot be captured, a look-alike mock image is made and labelled as such. HTML manuals with four or more chapters get a fixed table of contents on the left and a title banner |
| Structure check | A self-check list: is the conclusion on the first screen, are decisions in one place, is anything repeated |
| Style dictionaries | Korean and Japanese pattern dictionaries (hedging, preambles, inanimate subjects and passives, translated-sounding phrases, overused words, symbols), each pattern with a severity |
| Invariants | No new facts, numbers or names; no changes to negation, conditions, tense, certainty or units; code blocks and table data stay as they are |
| Detail levels | `short` · `normal` · `detailed`, chosen by words in your request ("짧게", "詳しく", …) and recorded in the document's frontmatter |
| Your taste | Say "don't use this phrase" once; the rule is saved to `~/.claude/psedit/taste.md` and applied from then on |
| Project standards | If a project has its own document templates, PSEdit keeps their structure; it only moves the conclusion to the top and checks the style |
| Optional hook | A `UserPromptSubmit` hook that reminds Claude to use the skill when a prompt mentions a document type. Can be turned off per project |

## Requirements

- [Claude Code](https://claude.com/claude-code) (desktop app or CLI)
- Node.js — only for the optional hook

## Installation

### 1. Get the repository and link the skill

macOS / Linux:

```bash
git clone https://github.com/TaekangKwon/PSEdit.git
ln -s "$PWD/PSEdit/skills/psedit" ~/.claude/skills/psedit
```

Windows (PowerShell):

```powershell
git clone https://github.com/TaekangKwon/PSEdit.git
New-Item -ItemType Junction -Path "$HOME\.claude\skills\psedit" -Target "$PWD\PSEdit\skills\psedit"
```

A link (instead of a copy) means `git pull` updates the skill for every project. Start a new Claude Code session afterwards and type `/psedit` to check that it is listed.

### 2. (Optional) Add the writing rules to your global `CLAUDE.md`

[`install/CLAUDE.snippet.md`](install/CLAUDE.snippet.md) holds short writing rules (conclusion first, recommend one option, collect decisions in one place, no closing summary). Appended to `~/.claude/CLAUDE.md`, they apply to **every** answer Claude gives you, not only to documents, and they tell Claude to use PSEdit for the six document types. The rules are written in Korean with Japanese terms. Back up your `CLAUDE.md` first. Step-by-step commands are in the [manual](manual/psedit-manual.ko.md#1-설치).

### 3. (Optional) Register the hook

Add this to `hooks.UserPromptSubmit` in `~/.claude/settings.json`:

```json
"UserPromptSubmit": [
  {
    "hooks": [
      { "type": "command", "command": "node \"$HOME/.claude/skills/psedit/hooks/psedit-prompt.mjs\"" }
    ]
  }
]
```

To change the behavior for one project, put `.claude/psedit.json` in its root:

| `hook` | Behavior |
| --- | --- |
| `auto` (default) | Add the hint only when the prompt contains a keyword such as 설계서, 회의록, 윤문, 議事録, ブラッシュアップ |
| `always` | Add the hint to every prompt (for repositories that hold only documents) |
| `off` | Never add the hint (for projects with their own document tooling) |

## Usage

Ask in Korean or Japanese as you normally would:

```text
회의록 써줘. (메모를 붙여 넣는다)
docs/plan/api-design.md 윤문해줘
この設計書の日本語版を作って（簡潔に）
"활용하다" 앞으로 쓰지 마. "쓰다"로 써.
```

When polishing, PSEdit keeps the author's voice (polite or plain form, favorite phrases) and reports what it changed:

```text
구조: moved the two recommendation sentences from section 5 to the top and collected 3 decisions
문체: 16/33   (sentences changed / total)
확인 필요: facts that cannot be confirmed from the original
```

If the original has no conclusion, PSEdit does not invent one. It offers two or three candidates built from the original's facts, recommends one, and adds the one you pick.

## How it works

| Layer | Where | Role |
| --- | --- | --- |
| Skill description | `skills/psedit/SKILL.md` | Tells Claude when to use PSEdit and holds the procedure |
| Global rules (optional) | `~/.claude/CLAUDE.md` | Writing rules for every session |
| Hook (optional) | `skills/psedit/hooks/psedit-prompt.mjs` | Adds a one-line hint when a prompt mentions a document type |

When rules conflict, PSEdit follows this order: your instruction in this request > invariants (facts, numbers, meaning) > your taste rules > templates and pattern dictionaries.

## Limitations

- Korean and Japanese only. English documents are not covered.
- The instructions inside the skill are written in Korean; Claude reads them fine, but you may want a translator if you plan to modify them.
- Templates are not applied to README, CHANGELOG, code comments, commit messages or prompt files.
- PSEdit guides Claude; it is not a linter. Results depend on the model and on the facts you provide.

## Project layout

```text
skills/psedit/
  SKILL.md                 the skill: modes, invariants, procedures
  templates/{ko,ja}/       design, review, research, manual, report, minutes
  references/              structure checklist, style pattern dictionaries, tech-stack diagram rules, manual screenshot rules, sources
  hooks/                   optional UserPromptSubmit hook
install/CLAUDE.snippet.md  optional global writing rules
manual/                    user manual (Korean, Japanese)
```

## Documentation

- User manual: [한국어](manual/psedit-manual.ko.md) · [日本語](manual/psedit-manual.ja.md)
- Hook settings: [skills/psedit/hooks/README.md](skills/psedit/hooks/README.md) (Korean)
- Sources and licenses: [skills/psedit/references/SOURCES.md](skills/psedit/references/SOURCES.md) (Korean)

## Acknowledgements

PSEdit's dictionaries, checklists and templates were written from scratch. The ideas behind them come from these projects and guides; details and licenses are in [SOURCES.md](skills/psedit/references/SOURCES.md).

- [dotoridot/korean-humanizer](https://github.com/dotoridot/korean-humanizer), [epoko77-ai/im-not-ai](https://github.com/epoko77-ai/im-not-ai), [iKora128/stop-ai-slop-jp](https://github.com/iKora128/stop-ai-slop-jp), [@textlint-ja/textlint-rule-preset-ai-writing](https://www.npmjs.com/package/@textlint-ja/textlint-rule-preset-ai-writing), [thkt/dotclaude](https://github.com/thkt/dotclaude), [byungjunjang/slop-rewrite](https://github.com/byungjunjang/slop-rewrite) (all MIT)
- [aktsmm/Agent-Skills](https://github.com/aktsmm/Agent-Skills) (CC BY-NC-SA 4.0) — only the idea of separating always-on rules from the skill; no content was copied
- Barbara Minto, *The Pyramid Principle*; [Diátaxis](https://diataxis.fr/); [Federal Plain Language Guidelines](https://digital.gov/guides/plain-language); 文化審議会「公用文作成の考え方」; 국립국어원「쉬운 공문서 쓰기 길잡이」

## About us

This project is maintained by Kwon at **SYSTEM EMUZU CO.,LTD.** (株式会社システム・エムズ), a small software company in Kasaoka, Okayama, Japan, founded in 2000.\
Our motto is _create rich time_: software that cuts mistakes and busywork so the people who use it get their time back. We design, build and maintain web systems for businesses, such as event registration, cost estimation for civil engineering and construction, and production management.

- 🌐 [Website](https://msap2.jp/emuzu/)
- ✍️ [Tech blog](https://msap2.jp/emuzu/blog/) — the apps we make and how we use AI (Japanese)

## License

[MIT](LICENSE).
