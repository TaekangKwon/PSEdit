# 참고 자료와 라이선스

확인일: 2026-11-09. 저장소는 클론하지 않았고, README·LICENSE·패턴 파일을 읽어 아이디어만 참고했다. PSEdit의 패턴 사전·체크리스트·템플릿 문장은 모두 새로 썼다. 짧은 예시 표현(「~에 있어서」, 「〜と言えるでしょう」 등)은 일반적인 언어 표현이라 출처 저장소와 겹칠 수 있다.

## 저장소·패키지

| 출처 | 라이선스 | 참고한 아이디어 | 비고 |
|---|---|---|---|
| [dotoridot/korean-humanizer](https://github.com/dotoridot/korean-humanizer) | MIT | 한국어 AI 문체 신호 분류(번역투, 격식체, 「것이다/이러한/해당」, 틀에 박힌 첫머리·맺음, 피동, 접속어, 셋 나열, 고빈도 어휘) | 구 이름 `dotoricode/korean-humanizer`(리다이렉트). **고정 비율(20%) 수정 상한은 이 저장소에 없다.** 변경 비율은 검토 지표일 뿐이고 기준은 정보 보존이다. PSEdit도 이를 따라 고정 상한 대신 정보 보존을 기준으로 하고 변경 비율은 보고만 한다 |
| [epoko77-ai/im-not-ai](https://github.com/epoko77-ai/im-not-ai) | MIT | 심각도 3단계(1회만 나와도 고침 / 3회 이상 고침 / 다른 신호와 겹칠 때만), 신호 하나로 판정하지 않기 | 원래 명칭은 S1 결정적 / S2 강함 / S3 약함 |
| [iKora128/stop-ai-slop-jp](https://github.com/iKora128/stop-ai-slop-jp) | MIT | 일본어 구조·어휘 패턴, 수정 순서 立場→主体→構造→語彙→記号 | 수정 순서의 원 출처는 이 저장소다 |
| [@textlint-ja/textlint-rule-preset-ai-writing](https://www.npmjs.com/package/@textlint-ja/textlint-rule-preset-ai-writing) | MIT | 기계 검사 규칙 5종(목록 서식, 과장 표현, 강조, 콜론 뒤 목록, 기술 문서 지침) | 확인 버전 1.7.0. Phase 2 일본어 hook에서 사용 예정 |
| [thkt/dotclaude](https://github.com/thkt/dotclaude) `kousei` | MIT | 결론 1~3줄 먼저, 사실·가정·제안 분리, 독자의 행동을 구체적으로 | 현재 `main`에서 삭제됨. 커밋 `ff07c400` 기준 |
| [aktsmm/Agent-Skills](https://github.com/aktsmm/Agent-Skills) `humanize-writing` | **CC BY-NC-SA 4.0** | 상시 규칙(CLAUDE.md)과 스킬 분리 구조, 작성자의 목소리 유지 | 비영리·동일 조건 라이선스라 **내용을 복사하지 않았다**. 구조 아이디어만 참고 |
| [byungjunjang/slop-rewrite](https://github.com/byungjunjang/slop-rewrite) | MIT | 지적을 취향 규칙으로 쌓기, 불변식(새 사실 금지, 부정·조건·시제·확실도·단위 변경 금지), 우선순위(사용자 지시 > 불변식 > 취향 > 문체 사전) | |

## 공개 작성 지침

| 출처 | URL |
|---|---|
| Barbara Minto, *The Pyramid Principle* | https://barbaraminto.com/ (책. 원문 공개 없음) |
| Diátaxis (Daniele Procida) | https://diataxis.fr/ |
| Federal Plain Language Guidelines | https://digital.gov/guides/plain-language |
| 文化審議会 建議「公用文作成の考え方」(2022) | https://www.bunka.go.jp/seisaku/bunkashingikai/kokugo/hokoku/93650001_01.html |
| 국립국어원 「쉬운 공문서 쓰기 길잡이」(2022) | https://www.korean.go.kr/front/etcData/etcDataView.do?etc_seq=700 |
