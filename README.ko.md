# PSEdit

> 한국어·일본어 업무 문서를 독자가 첫 화면에서 결론·결정할 것·할 일을 알 수 있게 쓰고 다듬는 Claude Code 스킬입니다.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](README.md) · [日本語](README.ja.md) · **한국어**

PSEdit은 **P**olishing / **S**tylistic **Edit**ing(윤문 / ブラッシュアップ)의 약자입니다.

```text
Notion을 Confluence로 바꿀지 검토자료 써줘. 사용자 120명, Notion 1인당 월 15달러, Confluence 11달러, 갱신일 12월 31일.
```

PSEdit을 설치한 뒤 이렇게 요청하면 Claude는 정해진 순서로 검토자료를 씁니다. 맨 앞에 3줄 이내의 결론(추천안, 이유 한 줄, 누가 언제 무엇을 할지), 그 아래 항목마다 추천이 붙은 **결정 필요**, 그다음에야 배경·근거·비교표가 옵니다. 스킬 이름을 말하지 않아도 됩니다.

---

## 만들게 된 계기

AI와 함께 작업하면 AI가 설계서, 검토자료, 조사자료, 사용자설명서 같은 문서를 많이 써 주고, 작업 중에는 설명도 해 줍니다. 내용이 틀린 것은 아닙니다. 그런데 글이 장황하고 같은 설명이 되풀이되며, 무엇보다 **결국 결론이 무엇인지, 내가 무엇을 골라야 하는지, 어떻게 해야 하는지**가 분명하지 않아 힘들 때가 많았습니다.

그래서 PSEdit은 **구조를 먼저**(결론 → 결정 필요 → 배경 → 근거 → 상세), **문체를 나중에** 고치고, 원문의 사실·숫자·조건·확실도는 바꾸지 않습니다. 선택 사항인 전역 규칙을 넣으면 작업 중에 하는 설명에도 같은 원칙이 적용됩니다.

## 할 수 있는 것

| 영역 | 내용 |
| --- | --- |
| 세 가지 모드 | 새 문서 **작성** · 기존 문서나 붙여 넣은 글 **윤문** · 다른 상세도나 다른 언어로 **판본 변환** |
| 여섯 가지 문서 | 설계서, 검토자료, 조사자료, 사용자설명서, 작업보고, 회의록. 각각 한국어·일본어 템플릿 |
| 기술 스택 그림 | 기술명세서나 자세한 기술 설명에 구성도·기술별 역할 표·연동 흐름을 따로 말하지 않아도 넣음. Markdown(Mermaid)과 HTML(SVG) 중 형식을 먼저 정하고, 정해지지 않았으면 추천과 함께 물음 |
| 설명서 화면 번호표 | 사용자설명서의 화면 절차를 화면 이미지 + 번호표 + 같은 번호의 짧은 동작 목록으로 씀. 캡처할 수 없으면 비슷한 재현 이미지를 만들고 그렇다고 표시 |
| 구조 점검 | 결론이 첫 화면에 있는지, 결정할 것이 한곳에 모였는지, 되풀이가 없는지 보는 자기 점검표 |
| 문체 패턴 사전 | 한국어·일본어 사전(결론 회피, 앞말, 사물 주어·피동, 번역투, 고빈도 어휘, 기호). 패턴마다 심각도 표시 |
| 불변식 | 새 사실·숫자·고유명사를 만들지 않음. 부정·조건·시제·확실도·단위를 바꾸지 않음. 코드 블록과 표 안의 데이터는 그대로 |
| 상세도 | `short` · `normal` · `detailed`. 요청의 표현("짧게", "詳しく" 등)으로 정하고 문서 frontmatter에 기록 |
| 내 취향 | "이 표현 쓰지 마"라고 한 번 말하면 `~/.claude/psedit/taste.md`에 저장되어 이후 계속 적용 |
| 프로젝트 문서 표준 | 프로젝트에 자체 문서 양식이 있으면 그 구조를 지키고, 결론을 맨 앞으로 옮기고 문체를 점검하는 것만 함 |
| 안내 훅 (선택) | 요청에 문서 종류가 나오면 스킬을 쓰라고 Claude에게 알리는 `UserPromptSubmit` 훅. 프로젝트마다 끌 수 있음 |

## 필요한 것

- [Claude Code](https://claude.com/claude-code) (데스크톱 앱 또는 CLI)
- Node.js — 안내 훅을 쓸 때만

## 설치

### 1. 저장소를 받아 스킬을 연결

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

복사가 아니라 연결이므로 `git pull` 한 번으로 모든 프로젝트의 스킬이 갱신됩니다. 설치한 뒤 Claude Code에서 새 세션을 열고 `/psedit`를 쳐서 목록에 나오는지 확인합니다.

### 2. (선택) 전역 `CLAUDE.md`에 글쓰기 규칙 추가

[`install/CLAUDE.snippet.md`](install/CLAUDE.snippet.md)에는 짧은 글쓰기 규칙(결론 먼저, 선택지는 하나를 추천, 결정할 것은 한곳에, 마무리 요약 금지)이 있습니다. `~/.claude/CLAUDE.md`에 붙이면 문서뿐 아니라 Claude의 **모든** 답변에 적용되고, 여섯 가지 문서에서 PSEdit을 쓰도록 안내합니다. 붙이기 전에 `CLAUDE.md`를 백업하세요. 명령은 [사용설명서](manual/psedit-manual.ko.md#1-설치)에 있습니다.

### 3. (선택) 안내 훅 등록

`~/.claude/settings.json`의 `hooks.UserPromptSubmit`에 넣습니다:

```json
"UserPromptSubmit": [
  {
    "hooks": [
      { "type": "command", "command": "node \"$HOME/.claude/skills/psedit/hooks/psedit-prompt.mjs\"" }
    ]
  }
]
```

프로젝트마다 동작을 바꾸려면 그 프로젝트 루트에 `.claude/psedit.json`을 둡니다:

| `hook` | 동작 |
| --- | --- |
| `auto` (기본) | 요청에 설계서·회의록·윤문·議事録·ブラッシュアップ 같은 키워드가 있을 때만 안내 |
| `always` | 모든 요청에 안내 (문서만 다루는 저장소용) |
| `off` | 안내하지 않음 (자체 문서 도구를 쓰는 프로젝트용) |

## 사용법

평소처럼 한국어나 일본어로 요청합니다:

```text
회의록 써줘. (메모를 붙여 넣는다)
docs/plan/api-design.md 윤문해줘
この設計書の日本語版を作って（簡潔に）
"활용하다" 앞으로 쓰지 마. "쓰다"로 써.
```

윤문할 때는 저자의 말투(경어·평어, 즐겨 쓰는 표현)를 남기고, 무엇을 고쳤는지 보고합니다:

```text
구조: 5절 결론의 추천 두 문장을 맨 앞으로 옮기고, 결정 필요 3건을 모았다
문체: 16/33
확인 필요: 원문만으로는 확인할 수 없는 사실
```

원문에 결론이 없으면 지어내지 않습니다. 원문의 사실로 만들 수 있는 결론 후보 2~3개를 추천과 함께 보여 주고, 사용자가 고른 후보를 넣습니다.

## 동작 방식

| 장치 | 위치 | 하는 일 |
| --- | --- | --- |
| 스킬 설명 | `skills/psedit/SKILL.md` | 언제 PSEdit을 쓸지 Claude에게 알리고 절차를 담음 |
| 전역 규칙 (선택) | `~/.claude/CLAUDE.md` | 모든 세션에 글쓰기 규칙을 넣음 |
| 안내 훅 (선택) | `skills/psedit/hooks/psedit-prompt.mjs` | 요청에 문서 종류가 나오면 한 줄 안내를 붙임 |

규칙이 부딪히면 이 순서를 따릅니다: 이번 요청의 지시 > 불변식(사실·숫자·뜻) > 취향 규칙 > 템플릿·패턴 사전.

## 제한 사항

- 한국어와 일본어만 다룹니다. 영어 문서는 대상이 아닙니다.
- README·CHANGELOG·코드 주석·커밋 메시지·프롬프트 파일에는 템플릿을 적용하지 않습니다.
- PSEdit은 Claude에게 주는 지침이지 검사기(linter)가 아닙니다. 결과는 모델과 주어진 사실에 따라 달라집니다.

## 프로젝트 구조

```text
skills/psedit/
  SKILL.md                 스킬 본체: 모드, 불변식, 절차
  templates/{ko,ja}/       설계서, 검토자료, 조사자료, 설명서, 작업보고, 회의록
  references/              구조 점검표, 문체 패턴 사전, 기술 스택 그림 규칙, 설명서 화면 규칙, 출처
  hooks/                   선택 사항인 UserPromptSubmit 훅
install/CLAUDE.snippet.md  선택 사항인 전역 글쓰기 규칙
manual/                    사용설명서 (한국어, 일본어)
```

## 문서

- 사용설명서: [한국어](manual/psedit-manual.ko.md) · [日本語](manual/psedit-manual.ja.md)
- 훅 설정: [skills/psedit/hooks/README.md](skills/psedit/hooks/README.md)
- 참고 자료와 라이선스: [skills/psedit/references/SOURCES.md](skills/psedit/references/SOURCES.md)

## 감사의 말

PSEdit의 패턴 사전·점검표·템플릿은 모두 새로 썼습니다. 아이디어는 아래 프로젝트와 지침에서 얻었고, 자세한 내용과 라이선스는 [SOURCES.md](skills/psedit/references/SOURCES.md)에 있습니다.

- [dotoridot/korean-humanizer](https://github.com/dotoridot/korean-humanizer), [epoko77-ai/im-not-ai](https://github.com/epoko77-ai/im-not-ai), [iKora128/stop-ai-slop-jp](https://github.com/iKora128/stop-ai-slop-jp), [@textlint-ja/textlint-rule-preset-ai-writing](https://www.npmjs.com/package/@textlint-ja/textlint-rule-preset-ai-writing), [thkt/dotclaude](https://github.com/thkt/dotclaude), [byungjunjang/slop-rewrite](https://github.com/byungjunjang/slop-rewrite) (모두 MIT)
- [aktsmm/Agent-Skills](https://github.com/aktsmm/Agent-Skills) (CC BY-NC-SA 4.0) — 상시 규칙과 스킬을 나누는 구조 아이디어만 참고했고 내용은 복사하지 않았습니다
- Barbara Minto, *The Pyramid Principle*; [Diátaxis](https://diataxis.fr/); [Federal Plain Language Guidelines](https://digital.gov/guides/plain-language); 文化審議会「公用文作成の考え方」; 국립국어원「쉬운 공문서 쓰기 길잡이」

## 만든 곳

이 프로젝트는 일본 오카야마현 가사오카시의 작은 소프트웨어 회사 **주식회사 시스템 엠즈**(SYSTEM EMUZU CO.,LTD., 2000년 설립)의 Kwon이 관리하고 있습니다.\
저희는 "create rich time"을 모토로, 실수와 수고를 줄여 쓰는 사람의 시간을 풍요롭게 하는 시스템을 만드는 팀입니다. 이벤트 접수, 토목·건축 적산, 생산 관리 같은 업무용 웹 시스템을 설계부터 유지보수까지 맡고 있습니다.

- 🌐 [공식 홈페이지](https://msap2.jp/emuzu/)
- ✍️ [기술 블로그](https://msap2.jp/emuzu/blog/)(일본어) — 직접 만든 앱과 AI 활용 이야기

## 라이선스

[MIT](LICENSE).
