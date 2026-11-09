# psedit 안내 훅

문서 작성·윤문 요청에 키워드가 있으면, psedit 스킬을 쓰라는 안내를 Claude 문맥에 자동으로 넣는다. 안내를 넣을지는 프로젝트마다 `.claude/psedit.json`으로 정한다.

## 프로젝트별 설정

프로젝트 루트에 `.claude/psedit.json`을 둔다. 파일이 없으면 `auto`로 동작한다.

```json
{ "hook": "auto" }
```

| 값 | 동작 | 쓸 곳 |
|---|---|---|
| `auto` (기본) | 요청에 키워드(설계서·회의록·윤문·議事録·推敲 등)가 있을 때만 안내 | 대부분의 프로젝트 |
| `always` | 모든 요청에 안내 | 문서만 다루는 저장소 |
| `off` | 안내하지 않음 | 자체 문서 도구·양식만 쓰는 프로젝트 |

- 작업 폴더에서 위로 올라가며 처음 찾은 `.claude/psedit.json`을 쓴다. 작업 트리(`.claude/worktrees/…`)에서는 원래 저장소의 설정이 적용된다.
- `/`로 시작하는 명령, `psedit`을 직접 언급한 요청에는 덧붙이지 않는다.
- 설정 파일이 깨졌거나 오류가 나면 기본값으로 동작하거나 아무것도 하지 않는다. 요청을 막지 않는다.

## 설치 (이 PC는 설치됨)

`~/.claude/settings.json`의 `hooks.UserPromptSubmit`에 아래 항목을 추가한다. 스킬 폴더가 `~/.claude/skills/psedit`에 있어야 한다.

```json
{ "type": "command", "command": "node \"$HOME/.claude/skills/psedit/hooks/psedit-prompt.mjs\"" }
```

키워드 목록은 `psedit-prompt.mjs`의 `KEYWORDS`에 있다.
