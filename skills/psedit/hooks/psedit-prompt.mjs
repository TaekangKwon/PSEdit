#!/usr/bin/env node
/**
 * UserPromptSubmit 훅: 문서 작성·윤문 요청으로 보이면 psedit 스킬을 쓰라는 안내를 문맥에 넣는다.
 *
 * 프로젝트별 설정: 작업 폴더에서 위로 올라가며 처음 찾은 `.claude/psedit.json`
 *   { "hook": "auto" }    기본값. 키워드가 있는 요청에만 안내한다
 *   { "hook": "always" }  모든 요청에 안내한다 (문서 위주 저장소용)
 *   { "hook": "off" }     이 프로젝트에서는 안내하지 않는다
 * 설정 파일이 없으면 auto. 어떤 오류든 조용히 끝낸다 (요청을 막지 않는다).
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const KEYWORDS = [
  // 한국어
  '설계서', '사양서', '기획서', '검토자료', '검토 자료', '조사자료', '조사 자료', '설명서', '매뉴얼', '안내서',
  '보고서', '작업보고', '진행 보고', '완료 보고', '회의록', '제안서', '윤문', '퇴고', '다듬어', '결론이 안 보',
  // 日本語
  '設計書', '仕様書', '検討資料', '調査資料', '調査報告', 'マニュアル', '手順書', '報告書', '作業報告', '進捗報告',
  '議事録', '提案書', 'ブラッシュアップ', '推敲', '校正', 'リライト', '結論が分からない', '長すぎる',
];

function done() {
  process.exit(0);
}

function findConfig(start) {
  for (let dir = start; ; dir = dirname(dir)) {
    const p = join(dir, '.claude', 'psedit.json');
    if (existsSync(p)) return p;
    if (dirname(dir) === dir) return null;
  }
}

try {
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  const input = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  const prompt = String(input.prompt || '');
  const cwd = input.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();

  const cfgPath = findConfig(cwd);
  let mode = 'auto';
  if (cfgPath) {
    try {
      mode = String(JSON.parse(readFileSync(cfgPath, 'utf8')).hook || 'auto');
    } catch {
      mode = 'auto'; // 설정 파일이 깨졌으면 기본값
    }
  }
  if (mode === 'off') done();

  // 슬래시 명령이나 스킬을 직접 부른 요청에는 덧붙이지 않는다
  const trimmed = prompt.trim();
  if (trimmed.startsWith('/') || /psedit/i.test(trimmed)) done();

  const hit = KEYWORDS.find((k) => trimmed.includes(k));
  if (mode !== 'always' && !hit) done();

  const why = hit ? `키워드 「${hit}」` : '프로젝트 설정 always';
  const text =
    `[psedit 훅] 이 요청은 문서 작성·윤문일 수 있다(${why}). ` +
    '설계서·검토자료·조사자료·설명서·보고서·회의록을 새로 쓰거나 다듬는 작업이면 Skill 도구로 psedit 스킬을 불러 그 지시를 따른다. ' +
    '문서 작업이 아니거나 README·CHANGELOG·코드 주석·커밋 메시지·프롬프트 파일이면 이 안내는 무시한다.';
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: text } }),
  );
} catch {
  // 입력이 깨졌거나 예상 밖 오류: 아무것도 하지 않는다
}
done();
