# 사용자설명서의 화면과 번호표 / 利用者マニュアルの画面と番号札

화면을 조작하는 절차는 **화면 이미지 1장 + 번호표 + 같은 번호의 동작 목록**으로 쓴다. 독자는 그림에서 번호를 찾아 목록의 같은 번호대로 누르기만 하면 된다. 위치 설명은 번호표가 맡으므로 문장은 짧아진다.

```
[화면 이미지]  ← 누를 곳마다 테두리와 번호 ①②③
① 사용자 ID를 입력합니다.
② 비밀번호를 입력합니다.
③ 로그인을 누릅니다.
```

## 1. 언제 적용하는가

- `manual` 템플릿으로 쓰고, 절차에 화면(웹·데스크톱 앱·외부 서비스 콘솔) 조작이 있다.
- 명령줄만 쓰는 단계는 화면 대신 명령 블록과 결과 한 줄을 쓴다.
- 윤문 모드에서는 이미지를 새로 넣지 않는다. 결과 보고에 "화면 이미지와 번호표를 넣을 수 있음" 한 줄만 제안한다.

## 2. 형식

1. 사용자가 말한 형식, 고치려는 파일의 형식.
2. 프로젝트에 이미 있는 설명서의 형식과 스타일(CSS·이미지 폴더 규칙). 있으면 6절 부품보다 그것을 따른다.
3. 그 밖에는 **HTML**. 번호표를 CSS로 겹치므로 이미지를 다시 찍어도 좌표만 고치면 된다. 정했다고 한 줄로 알리고 묻지 않는다.

Markdown이면 번호표를 이미지에 구워 넣는다 (8절).

## 3. 화면 이미지 구하기

위에서부터 되는 것을 쓴다.

| 순서 | 방법 | 쓸 때 |
|---|---|---|
| 1 | 사용자가 준 캡처, 저장소에 있는 캡처 | 있으면 항상 먼저 |
| 2 | 직접 캡처 (7절) | 로컬에서 띄울 수 있는 웹 앱·데스크톱 앱 |
| 3 | **재현 이미지**: 화면을 HTML로 비슷하게 만들어 PNG로 렌더링 (7절) | 캡처할 수 없을 때 |

- 외부 서비스(AWS·Slack 등)나 실제 계정 로그인이 필요한 화면은 직접 로그인하지 않는다. 먼저 사용자에게 캡처를 부탁하고, 받을 수 없으면 재현 이미지로 만든다.
- 재현 이미지는 **재료에 있는 것만** 그린다: 소스 코드의 화면 문구·컴포넌트 순서, 기존 문서, 사용자 설명. 없는 버튼·메뉴를 지어내지 않는다. 확인하지 못한 부분은 회색 빈 상자로 둔다.
- 재현 이미지는 캡션에 `(재현 이미지)` / `（再現イメージ）`를 붙인다. 다른 회사의 로고·상표는 그리지 않는다.
- 비밀값(토큰·비밀번호·키·메일 주소·계정 ID)은 가린다. 재현 이미지에는 처음부터 가짜 값(`user01`, `example.com`, `123456789012`)을 쓴다.
- 이미지는 문서 옆 `img/{주제}/{NN}_{화면이름}.png`에 둔다. 원본 캡처와 번호표를 구운 이미지를 둘 다 둘 때는 구운 쪽에 `.pins`를 붙인다.

## 4. 번호표 규칙

- 화면 하나에 그림 하나. 화면이 바뀌면(대화상자가 열리면) 새 그림이다.
- 번호는 그림마다 1부터 다시 센다. 그림의 번호와 아래 동작 목록의 번호가 **1:1**이다.
- 번호는 누르는 순서다. 같은 화면에서 보기만 하는 곳(결과 확인)도 순서 안에 넣는다.
- 그림에 위치가 없는 동작(다른 프로그램에서 하는 일, 기다리기)은 목록에서 **회색 번호**로 쓰고 그림에는 표시하지 않는다.
- 한 그림에 번호표 5개 이하. 넘으면 화면을 위·아래로 나눠 두 그림으로 한다.
- 테두리는 누를 요소에 딱 맞춘다. 번호 원은 테두리 왼쪽 위 **바깥**에 놓여 요소 안의 글자를 가리지 않는다. 대상이 이미지 왼쪽·위 끝에 붙어 있어 원이 잘리면 잘라 낼 때 그쪽 여백을 30px쯤 남긴다.
- 이미지는 대상 부분이 화면 폭을 채우도록 잘라 낸다. 빈 여백이 절반을 넘지 않게 한다. 위치를 알기 어려우면 메뉴·제목줄이 보이는 만큼은 남긴다.

## 5. 문장 — 짧고 매끄럽게

독자는 그림과 목록을 번갈아 보며 손을 움직인다. 문장은 그 흐름을 끊지 않을 만큼만 쓴다.

- **한 번호에 한 동작, 한 문장.** "{화면 요소}를 누릅니다/입력합니다/선택합니다." 경어체로 통일한다 (ko `~합니다`, ja `〜します`).
- 화면 요소 이름은 화면에 보이는 글자 그대로 **굵게** 쓴다. 따옴표·코드 표기와 섞지 않는다.
- 위치("오른쪽 아래 초록 버튼")는 쓰지 않는다. 번호표가 위치를 보여 준다. 같은 이름이 화면에 둘 이상일 때만 위치를 붙인다.
- 보충은 그 단계에서 막히지 않으려면 꼭 필요한 것만, 동작 아래 작은 글씨 한 줄로 쓴다. 이유·배경은 「알아 둘 것」으로 보내거나 지운다.
- 주의 상자는 되돌릴 수 없는 일(삭제·덮어쓰기·비밀값 노출)에만 쓰고, 한 화면에 하나까지.
- 단계 묶음 제목은 독자가 하는 일로 쓴다 ("로그인하기"). 화면 이름은 캡션에 쓴다.
- 캡션은 화면 이름 한 줄. 동작을 캡션에 다시 쓰지 않는다. `alt`는 "{화면 이름}. {무엇이 보이는지}".
- 다음 화면이 그림으로 바로 이어지면 "~ 화면이 열립니다"를 쓰지 않는다. 결과가 그림에 없을 때만 마지막에 "확인: {보여야 하는 것}" 한 줄.
- 내부 용어(`.env`, 컨테이너, API 등)는 독자가 실제로 만지는 것일 때만 쓰고, 처음 나올 때 한 줄로 푼다.

| 길게 쓴 예 | 이렇게 쓴다 |
|---|---|
| 화면 오른쪽 위에 있는 「로그인」이라고 쓰인 파란 버튼을 클릭해 주세요. 그러면 다음 화면으로 넘어갑니다. | ③ **로그인**을 누릅니다. |
| 「ファイルの形式」は「JSON」のままにしておいてください。なお、XML を選ぶと読み込めないので注意が必要です。 | ② **ファイルの形式**は **JSON** のままにします。<br><small>XML はこのツールで読み込めません。</small> |

## 6. HTML 부품

프로젝트에 설명서 스타일이 없을 때 쓴다. 색은 CSS 변수라 다크 모드에서도 덮어쓸 수 있다.

```html
<style>
:root{--card:#fff;--line:#cfd5dd;--mut:#5c6573;--mark:#e0620f;--marks:rgba(224,98,15,.22)}
figure.shot{margin:16px 0 12px;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px}
figure.shot .img{position:relative}
figure.shot img{display:block;width:100%;height:auto;border-radius:4px}
figure.shot figcaption{font-size:12px;color:var(--mut);padding:8px 2px 0}
.pin{position:absolute;left:calc(var(--x)/var(--iw)*100%);top:calc(var(--y)/var(--ih)*100%);width:calc(var(--w)/var(--iw)*100%);height:calc(var(--h)/var(--ih)*100%);
  border:3px solid var(--mark);border-radius:6px;box-shadow:0 0 0 4px var(--marks);pointer-events:none}
.pin::after,ol.do>li::before{content:attr(data-n);position:absolute;width:24px;height:24px;border-radius:50%;background:var(--mark);color:#fff;font:700 13px/24px system-ui,sans-serif;text-align:center}
.pin::after{top:-27px;left:-27px}
ol.do{list-style:none;margin:0 0 24px;padding:0;display:grid;gap:8px}
ol.do>li{position:relative;padding:8px 12px 8px 46px;background:var(--card);border:1px solid var(--line);border-radius:8px}
ol.do>li::before{left:12px;top:10px}
ol.do>li.plain::before{background:var(--mut)}
ol.do small{display:block;color:var(--mut);font-size:13px}
@media print{figure.shot,ol.do>li{break-inside:avoid}.pin,.pin::after,ol.do>li::before{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style>

<h3>로그인하기</h3>
<figure class="shot"><div class="img" style="--iw:960;--ih:540">
  <img src="img/login/01_login.png" alt="로그인 화면. 사용자 ID·비밀번호 입력란과 로그인 버튼" width="960" height="540">
  <span class="pin" data-n="1" style="--x:290;--y:204;--w:380;--h:36"></span>
  <span class="pin" data-n="2" style="--x:290;--y:274;--w:380;--h:36"></span>
  <span class="pin" data-n="3" style="--x:290;--y:332;--w:380;--h:40"></span>
</div><figcaption>로그인 화면 (재현 이미지)</figcaption></figure>
<ol class="do">
  <li data-n="1"><b>사용자 ID</b>를 입력합니다.</li>
  <li data-n="2"><b>비밀번호</b>를 입력합니다.<small>대소문자를 구분합니다.</small></li>
  <li data-n="3"><b>로그인</b>을 누릅니다.</li>
</ol>
```

- `--iw`·`--ih`는 이미지 원래 크기(픽셀), `--x --y --w --h`는 그 이미지 위의 좌표다. 화면 폭이 바뀌어도 번호표가 따라 줄어든다.
- 회색 번호는 `<li data-n="4" class="plain">`.

## 7. 만드는 법

**좌표는 눈대중으로 정하지 않는다.** 가능하면 화면 요소에서 직접 얻고, 안 되면 이미지를 보고 정한 뒤 반드시 8절처럼 렌더링해서 확인한다.

**웹 앱 캡처**
- 뷰포트를 고정하고(예: 1280×800, 배율 1) 캡처한다. 브라우저 자동화 도구(Playwright 등)가 있으면 같은 페이지에서 대상 요소의 `getBoundingClientRect()`로 좌표를 얻는다. 배율이 2면 좌표에 2를 곱한다.
- 로그인이 필요 없는 페이지는 Edge·Chrome 헤드리스로도 찍을 수 있다 (아래 명령).

**데스크톱 앱 캡처 (Windows)**
- 앱을 띄우고 창 영역만 캡처한다 (PowerShell `System.Drawing.Graphics.CopyFromScreen`). 좌표는 UI Automation의 요소 영역에서 창 위치를 빼서 얻거나, 이미지를 보고 정한다.

**재현 이미지**
1. 화면 하나를 HTML 한 파일로 만든다. `body`의 폭·높이를 이미지 크기로 고정하고, 번호표를 달 요소에 `data-pin="1"`…을 붙인다.
2. 파일 끝에 좌표를 꺼내는 스크립트를 둔다.
   ```html
   <script>
   const r=[...document.querySelectorAll('[data-pin]')].map(e=>{const b=e.getBoundingClientRect();
     return{n:+e.dataset.pin,x:Math.round(b.left),y:Math.round(b.top),w:Math.round(b.width),h:Math.round(b.height)}});
   const p=document.createElement('script');p.type='application/json';p.id='pins';p.textContent=JSON.stringify(r);document.body.append(p);
   </script>
   ```
3. 헤드리스 브라우저로 PNG를 찍고, 같은 파일의 DOM에서 좌표를 꺼낸다.
   ```bash
   B="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"   # 또는 chrome
   "$B" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=960,540 --screenshot="C:\\path\\01_login.png" "file:///C:/path/01_login.html"
   "$B" --headless=new --disable-gpu --window-size=960,540 --dump-dom "file:///C:/path/01_login.html" | grep -o '<script type="application/json" id="pins">[^<]*'
   ```
   `--screenshot`에는 Windows 경로를 준다. 재현용 HTML은 이미지 옆에 남겨 두어 나중에 고칠 수 있게 한다.

## 8. 확인과 Markdown용 이미지

- 완성한 그림(이미지 + 번호표)을 헤드리스 브라우저로 렌더링하고 결과 PNG를 직접 본다. 테두리가 요소에서 어긋나거나 번호 원이 글자를 가리면 좌표를 고친다.
- Markdown 문서에는 번호표를 구운 이미지를 넣는다. `<div class="img">` 부분만 담은 HTML을 `body{margin:0}`, 창 크기 = 이미지 크기(`--window-size={iw},{ih}`)로 찍어 `NN_화면이름.pins.png`로 저장하고, 아래에 같은 번호의 목록을 쓴다. 목록 앞에는 번호 원 문자(①②③)를 쓴다.
  ```markdown
  ![로그인 화면 (재현 이미지)](img/login/01_login.pins.png)

  ① **사용자 ID**를 입력합니다.
  ② **비밀번호**를 입력합니다.
  ③ **로그인**을 누릅니다.
  ```

## 9. 상세도별 분량

| 단계 | 넣는 것 |
|---|---|
| `short` | 최단 절차 3단계만. 이미지 없음 |
| `normal` | 화면마다 이미지 + 번호표 + 동작 목록 |
| `detailed` | `normal` + 끝난 뒤 결과 화면 이미지 + 「문제가 생기면」 표의 증상마다 그 화면 이미지 |

## 10. 자기 점검

- [ ] 화면 조작 단계마다 이미지가 있고, 번호표와 목록의 번호가 1:1이다.
- [ ] 번호표 위치를 렌더링 결과에서 눈으로 확인했다.
- [ ] 한 그림에 번호표가 5개 이하이고, 빈 여백이 절반을 넘지 않는다.
- [ ] 재현 이미지는 캡션에 표시했고, 재료에 없는 버튼·메뉴가 없다.
- [ ] 비밀값이 보이지 않는다.
- [ ] 한 번호에 한 동작, 한 문장이다. 위치 설명·캡션 반복·배경 설명이 절차 안에 없다.
- [ ] 화면 요소 이름이 화면 글자 그대로이고 굵게 되어 있다.
