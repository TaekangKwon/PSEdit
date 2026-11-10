---
detail: detailed
audience: team
---

# PSEdit 사용설명서

## 이 문서로 할 수 있는 것

PSEdit 스킬을 설치해 Claude Code에 한국어·일본어 문서를 쓰고 다듬게 할 수 있다. 자동 안내는 프로젝트마다 켜고 끌 수 있다.

1. 스킬 폴더를 `~/.claude/skills/psedit`에 연결한다.
2. 아무 프로젝트에서 "회의록 써줘", "이 설계서 윤문해줘"라고 요청한다.
3. 자동 안내가 필요 없는 프로젝트에는 `.claude/psedit.json`에 `{ "hook": "off" }`를 둔다.

## 시작 전에

- Claude Code (데스크톱 앱 또는 CLI)
- PSEdit 저장소를 받아 둔 폴더 (`git clone https://github.com/TaekangKwon/PSEdit.git`)
- Node.js (자동 안내 훅을 실행할 때 쓴다. 훅을 쓰지 않으면 필요 없다)

1번 「설치」의 PowerShell 명령은 같은 창에서 실행한다. 먼저 `$repo`에 저장소를 받은 폴더를 넣어 둔다 (예: `$repo = "C:\path\to\PSEdit"`).

## 절차

### 1. 설치

1. 스킬 폴더를 사용자 스킬 위치에 연결한다. 연결(디렉터리 정션: Windows에서 폴더를 다른 위치에 있는 것처럼 보이게 하는 링크)을 쓰면 저장소의 파일을 고치는 즉시 모든 프로젝트에 반영된다.
   ```powershell
   New-Item -ItemType Junction -Path "$HOME\.claude\skills\psedit" -Target "$repo\skills\psedit"
   ```
   macOS·Linux에서는 `ln -s <저장소>/skills/psedit ~/.claude/skills/psedit`로 심볼릭 링크를 만든다.
   - 확인 방법: `Test-Path "$HOME\.claude\skills\psedit\SKILL.md"`가 `True`를 반환한다.
2. 전역 `CLAUDE.md`를 백업한다.
   ```powershell
   Copy-Item "$HOME\.claude\CLAUDE.md" "$HOME\.claude\CLAUDE.md.bak_$(Get-Date -Format yyyyMMdd)"
   ```
   - 확인 방법: `~/.claude/`에 `CLAUDE.md.bak_날짜` 파일이 생긴다.
3. 글쓰기 규칙을 전역 `CLAUDE.md` 끝에 붙인다. 표시 주석으로 감싸 두면 나중에 그 부분만 찾아 지울 수 있다.
   ```powershell
   $snip = Get-Content -Raw "$repo\install\CLAUDE.snippet.md"
   Add-Content -Encoding utf8 "$HOME\.claude\CLAUDE.md" "`n<!-- psedit:rules -->`n$snip<!-- /psedit:rules -->"
   ```
   - 확인 방법: `Select-String -Path "$HOME\.claude\CLAUDE.md" -Pattern "psedit:rules"`가 두 줄(시작·끝)을 찾는다.
4. 자동 안내 훅을 등록한다. `~/.claude/settings.json`의 `hooks.UserPromptSubmit`(메시지를 보낼 때마다 실행되는 훅)에 아래 항목을 넣는다. 이미 다른 훅이 있으면 같은 `hooks` 배열에 추가한다.
   ```json
   "UserPromptSubmit": [
     {
       "hooks": [
         { "type": "command", "command": "node \"$HOME/.claude/skills/psedit/hooks/psedit-prompt.mjs\"" }
       ]
     }
   ]
   ```
   - 확인 방법: `node -e "JSON.parse(require('fs').readFileSync(require('os').homedir()+'/.claude/settings.json','utf8'))"`가 오류 없이 끝난다 (JSON이 깨지지 않았다는 뜻).
5. Claude Code에서 새 세션을 연다. Claude Code는 세션을 시작할 때 스킬·훅·CLAUDE.md를 읽는다.
   - 확인 방법: 아무 프로젝트에서 "회의록 써줘"라고 보내면, Claude가 psedit 스킬을 불러온 뒤 결정 사항부터 쓴 회의록을 낸다. 입력창에 `/psedit`를 쳐서 스킬이 목록에 나오는지 봐도 된다.

### 2. 문서 새로 쓰기 (작성 모드)

1. 문서 종류와 재료(사실·숫자·결정된 것)를 함께 요청한다. 스킬 이름은 말하지 않아도 된다.
   ```
   Notion을 Confluence로 바꿀지 검토자료 써줘. 사용자 120명, Notion 1인당 월 15달러, Confluence 11달러, 갱신일 12월 31일.
   ```
   - 확인 방법: 문서 맨 앞에 3줄 이내의 「결론」이, 바로 아래에 「결정 필요」가 있다.
2. 분량을 정하고 싶으면 같은 요청에 상세도 표현을 넣는다. 지정하지 않으면 문서는 `보통`이다.

   | 표현 (한 / 日) | 상세도 | 문서 모습 |
   |---|---|---|
   | 짧게, 간단히 / 短く, 簡潔に | 요약 `short` | 결론·결정 필요·근거(항목당 1줄)만 |
   | (지정 없음), 보통으로 / 普通で | 보통 `normal` | 템플릿 전체. 상세는 핵심만 |
   | 자세히, 구체적으로 / 詳しく, 具体的に | 자세히 `detailed` | 템플릿 전체 + 예시·절차·비교표·이유·자주 묻는 질문 |

   - 확인 방법: 파일로 저장한 문서는 맨 위 frontmatter에 `detail: <단계>`가 적힌다.
3. 결과를 읽고 「결정 필요」 항목에 답한다. 작성 모드에서는 Claude가 주어진 사실로 반드시 추천안을 낸다. 정보가 부족하면 "A를 추천. 단, X이면 B"처럼 조건부로 쓴다.

문서 종류는 요청 표현으로 정해진다.

| 요청 표현 | 템플릿 | 맨 앞 섹션 |
|---|---|---|
| 설계서, 아키텍처, 기술명세서 / 設計書, 技術仕様書 | `design` | 결론 (설계 방침) |
| 검토자료, 비교, 선정, 제안 / 検討資料, 提案書 | `review` | 결론 (추천안) |
| 조사자료, 리서치, 분석 / 調査資料 | `research` | 결론 (우리에게 의미하는 것) |
| 사용자설명서, 매뉴얼, 가이드 / 手順書 | `manual` | 이 문서로 할 수 있는 것 |
| 작업보고, 진행·완료 보고 / 作業報告 | `report` | 결과 |
| 회의록 / 議事録 | `minutes` | 결정 사항 |

「보고서」만 있으면 내용으로 고른다: 결정을 구하면 검토자료, 발견을 전하면 조사자료, 진행 상황이면 작업보고.

기술명세서를 쓰거나 문서가 기술을 3개 이상 다루면, 따로 말하지 않아도 「기술 스택과 연동」 소절에 ① 구성도 ② 기술별 역할 표(이름 · 한 줄 역할 · 없으면?) ③ 대표 동작 하나의 연동 흐름이 들어간다. 그리기 전에 Claude가 형식을 정한다. 요청에 형식이 있거나 고칠 파일·같은 종류 문서가 있으면 그 형식을 따르고, 없으면 "HTML(SVG)과 Markdown(Mermaid) 중 무엇으로 할지"를 추천과 함께 한 번 묻는다. 배포·공유용이거나 구성 요소가 많으면 HTML, 저장소 안에서 함께 고쳐 나갈 문서면 Markdown을 추천한다. 규칙은 `skills/psedit/references/tech-stack.md`에 있다.

사용자설명서의 절차에 화면 조작이 있으면, 화면마다 이미지에 번호표(①②③)를 붙이고 그 아래에 같은 번호의 동작을 한 문장씩 쓴다. 이미지는 내가 준 캡처나 저장소의 캡처를 먼저 쓰고, 없으면 Claude가 직접 캡처하고, 그것도 안 되면 비슷한 재현 이미지를 만들어 캡션에 「재현 이미지」라고 표시한다. 형식은 정하지 않으면 HTML이다. 규칙은 `skills/psedit/references/manual-screens.md`에 있다.

### 3. 기존 문서 다듬기 (윤문 모드)

1. 파일 경로를 주거나 글을 붙여 넣고 "윤문해줘", "다듬어줘", "ブラッシュアップして"라고 요청한다.
   ```
   docs/plan/api-design.md 윤문해줘
   ```
2. Claude가 아래 순서로 고친다. 구조를 먼저, 문체를 나중에 고친다.
   1. 결론이 원문 어딘가에 있으면 맨 앞으로 옮긴다. 원문이 추측으로 쓴 결론은 옮긴 뒤에도 추측 표현을 하나 남긴다.
   2. 흩어진 선택지·결정 사항을 「결정 필요」로 모은다. 원문에 추천이 없으면 질문만 쓴다.
   3. 내용 없는 첫머리·맺음("~에 대해 알아보겠습니다", "도움이 되셨길 바랍니다")과 반복을 지운다.
   4. 패턴 사전으로 문체를 고친다 (입장 → 주체 → 구조 → 어휘 → 기호 순서).
   - 확인 방법: 고친 글 뒤에 아래 형식의 보고가 붙는다.
   ```
   구조: 5절 결론의 추천 두 문장을 맨 앞으로 옮기고, 결정 필요 3건을 모았다
   문체: 16/33
   확인 필요: 사내 직접 이전의 비용 환산액이 없어 외부 견적과 비교할 수 없다
   ```
3. 보고의 「확인 필요」에 답하거나 원문을 고친다. 「결론 후보」가 나왔다면 원문에 결론이 없었다는 뜻이다. 후보 중 하나를 고르면 Claude가 그 후보를 본문에 넣는다.

윤문은 저자의 글을 저자의 글로 남긴다. 사실·숫자·부정·조건·시제·확실도·단위, 코드 블록, 표 안의 데이터는 바꾸지 않는다. 경어·평어(敬体·常体) 같은 말투도 그대로 둔다. 전체 문장의 절반 넘게 고쳤다면 보고에 이유가 한 줄 붙는다.

### 4. 다른 판본 만들기

1. 같은 문서의 다른 상세도나 다른 언어판을 요청한다.
   ```
   이 검토자료의 요약판 만들어줘
   この設計書の日本語版を作って（簡潔に）
   ```
   - 확인 방법: 요약판·상세판은 「결론」과 「결정 필요」 문구가 원본과 글자 그대로 같다. 언어판은 직역하지 않고 대상 언어 템플릿의 제목·순서로 다시 쓴다. 결론·결정 필요·숫자의 뜻은 원본과 같다.

### 5. 내 취향 규칙 남기기

1. 결과를 읽다가 마음에 들지 않는 표현이 있으면 그대로 말한다.
   ```
   "활용하다" 앞으로 쓰지 마. "쓰다"로 써.
   ```
   - 확인 방법: Claude가 규칙을 추가했다고 한 줄로 알리고, `~/.claude/psedit/taste.md`에 아래 형식의 줄이 생긴다.
   ```
   - [규칙] 활용하다 → 쓰다 (ko, 2026-11-09)
   ```
2. 이후 Claude는 모든 작성·윤문의 마지막 단계에서 이 파일을 적용한다. 규칙을 지우려면 그 줄을 직접 지운다.

`taste.md`는 스킬 폴더 밖에 있어서 스킬을 다시 설치해도 남고 저장소에 커밋되지 않는다.

### 6. 프로젝트별 자동 안내 정하기

1. 프로젝트 루트에 `.claude/psedit.json`을 만든다.
   ```json
   { "hook": "off" }
   ```
   값의 뜻은 「설정 항목」 표에 있다. 파일이 없으면 `auto`로 동작한다.
2. 이 설정을 팀과 공유하려면 파일을 커밋한다. 혼자만 쓰려면 커밋하지 않는다.
   - 확인 방법: 그 프로젝트에서 새 세션을 열고 "회의록 써줘"라고 보낸다. `auto`·`always`면 psedit 스킬을 불러오고, `off`면 훅 안내 없이 처리된다 (전역 CLAUDE.md 규칙과 스킬 설명에 따라 스킬이 쓰일 수는 있다).

### 7. 제거

1. 연결을 지운다. 정션만 지워지고 저장소의 원본은 남는다.
   ```powershell
   cmd /c rmdir "$HOME\.claude\skills\psedit"
   ```
2. 전역 `CLAUDE.md`에서 `<!-- psedit:rules -->`부터 `<!-- /psedit:rules -->`까지 지운다.
3. `~/.claude/settings.json`에서 `psedit-prompt.mjs` 줄이 있는 훅 항목을 지운다.
4. 취향 규칙도 지우려면 `~/.claude/psedit/` 폴더를 지운다.
   - 확인 방법: 새 세션에서 `/psedit`가 목록에 나오지 않는다.

## 설정 항목

### 프로젝트 설정 `.claude/psedit.json`

| 항목 | 기본값 | 값과 동작 |
|---|---|---|
| `hook` | `auto` | `auto`: 요청에 문서 키워드가 있을 때만 안내한다. 대부분의 프로젝트에 맞다 |
| | | `always`: 모든 요청에 안내한다. 문서만 다루는 저장소에 맞다 |
| | | `off`: 안내하지 않는다. 자체 문서 도구·양식만 쓰는 프로젝트에 맞다 |

- 작업 폴더에서 위로 올라가며 처음 찾은 `.claude/psedit.json`을 쓴다. 그래서 워크트리(`.claude/worktrees/…`)에서는 원래 저장소의 설정이 적용된다.
- `/`로 시작하는 명령과 `psedit`을 직접 언급한 요청에는 안내를 붙이지 않는다.
- 파일이 깨졌으면 `auto`로 동작한다. 훅에서 오류가 나도 요청은 막히지 않는다.
- 키워드 목록은 `skills/psedit/hooks/psedit-prompt.mjs`의 `KEYWORDS`에 있다. 예: 설계서, 사양서, 회의록, 윤문, 다듬어, 設計書, 議事録, ブラッシュアップ.

### 문서 frontmatter

| 항목 | 값 | 설명 |
|---|---|---|
| `detail` | `short` / `normal` / `detailed` | 문서의 상세도. 상세도를 지정하면 Claude가 기록한다 |
| `audience` | `self` / `team` / `stakeholder` / `end-user` | 독자. `stakeholder`·`end-user`면 전문 용어를 처음 나올 때 풀고 수치에 "좋은지 나쁜지"를 붙인다. 없으면 문서 종류로 추정한다 (설계서=team, 검토자료=stakeholder, 설명서=end-user, 나머지=team) |

### 파일 위치

| 무엇 | 위치 |
|---|---|
| 스킬 본체 | `skills/psedit/SKILL.md` (`~/.claude/skills/psedit`로 연결) |
| 문서 골격 | `skills/psedit/templates/{ko,ja}/{design,review,research,manual,report,minutes}.md` |
| 구조 점검표 | `skills/psedit/references/structure-checklist.md` |
| 기술 스택 그림 규칙 | `skills/psedit/references/tech-stack.md` |
| 설명서 화면 규칙 | `skills/psedit/references/manual-screens.md` |
| 문체 패턴 사전 | `skills/psedit/references/patterns-ko.md`, `patterns-ja.md` |
| 자동 안내 훅 | `skills/psedit/hooks/psedit-prompt.mjs` |
| 전역 규칙 원본 | `install/CLAUDE.snippet.md` |
| 취향 규칙 | `~/.claude/psedit/taste.md` (첫 지적 때 생긴다) |

## 문제가 생기면

| 증상 | 조치 |
|---|---|
| 문서를 부탁했는데 psedit 스킬을 쓰지 않는다 | 요청에 문서 종류(설계서·회의록 등)를 넣는다. 그래도 안 되면 `/psedit`로 직접 부른다. 설치 직후라면 새 세션을 연다 |
| 훅 안내가 들어가지 않는다 | `settings.json`에 훅 항목이 있는지, 프로젝트의 `.claude/psedit.json`이 `off`가 아닌지, `node`가 PATH에 있는지 본다. 설정을 바꾼 뒤에는 새 세션을 연다 |
| 문서와 상관없는 요청에 안내가 붙는다 | 키워드가 우연히 들어간 경우다. Claude는 문서 작업이 아니면 안내를 무시한다. 자주 거슬리면 그 프로젝트를 `off`로 둔다 |
| 너무 많이 고쳤다 | 요청에 범위를 적는다: "구조는 그대로 두고 문체만 다듬어줘". 사용자의 이번 지시가 스킬 규칙보다 앞선다 |
| 뜻이나 확실도가 바뀌었다 ("~로 보인다"가 "~이다"로) | 불변식 위반이다. 그 문장을 되돌리라고 말한다. 같은 일이 반복되면 PSEdit 저장소의 패턴 사전에 단서를 추가한다 |
| 프로젝트 문서 양식이 무시됐다 | 규칙상 프로젝트 양식이 PSEdit 템플릿보다 앞선다. "이 프로젝트 양식을 지켜서 다시 써줘"라고 말하고, 양식 위치(`_TEMPLATE` 등)를 알려 준다 |
| 스킬을 고쳤는데 반영되지 않는다 | 정션이라 파일은 바로 바뀐다. 이미 열린 세션은 시작할 때 읽은 내용을 쓰므로 새 세션을 연다 |

## 알아 둘 것

### 스킬이 자동으로 쓰이는 이유

세 장치가 겹쳐 있다. 위의 둘은 스킬을 쓸지 Claude가 판단하고, 훅은 키워드가 있으면 매번 안내를 넣는다.

| 장치 | 위치 | 하는 일 |
|---|---|---|
| 스킬 설명 | `SKILL.md`의 `description` | 쓸 상황과 키워드를 Claude에게 알린다 |
| 전역 규칙 | `~/.claude/CLAUDE.md`의 `psedit:rules` 블록 | 모든 세션에 "이런 문서는 psedit을 따른다"는 규칙을 넣는다 |
| 안내 훅 | `settings.json`의 `UserPromptSubmit` | 키워드가 있는 요청에 "psedit 스킬을 불러라"는 안내를 붙인다. 프로젝트마다 끄고 켤 수 있다 |

### 스킬이 하지 않는 것

- 원문·자료에 없는 사실·숫자·고유명사를 만들지 않는다.
- 프로젝트에 자체 문서 양식이 있으면 그 구조를 덮어쓰지 않는다. 결론을 첫 섹션(또는 첫 문단)에 두고 문체를 점검하는 것만 한다.
- README·CHANGELOG·코드 주석·커밋 메시지·프롬프트 파일에는 템플릿을 적용하지 않는다.

### 규칙이 부딪힐 때의 순서

사용자의 이번 지시 > 불변식(사실·숫자·뜻을 바꾸지 않는다) > 취향 규칙(`taste.md`) > 템플릿·패턴 사전.

## 자주 묻는 질문

**Q. 프로젝트 `.claude/psedit.json`을 `off`로 두면 스킬도 못 쓰나?**
훅 안내만 꺼진다. 스킬은 그대로 설치되어 있으므로 "윤문해줘"라고 하거나 `/psedit`로 부르면 쓸 수 있다.

**Q. 다른 사람과 같이 쓰려면?**
각자 PSEdit 저장소를 받아 1번 「설치」를 따라 한다. 프로젝트별 설정 `.claude/psedit.json`은 프로젝트에 커밋하면 함께 적용된다. 취향 규칙 `taste.md`는 개인 파일이라 공유되지 않는다.

**Q. 한국어 요청으로 일본어 문서를 쓸 수 있나?**
"일본어로 써줘"처럼 언어를 지정하면 된다. 지정이 없으면 요청 언어로 쓰고, "팀 공유용"이라고 하면 일본어로 쓴다.
