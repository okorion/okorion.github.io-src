# Codex 성능 테스트 플레이북

## 목적

이 문서는 Codex app에서 성능 PR을 검증하고 PR 코멘트까지 정리하는 작업을 반복할 때 같은 실수를 줄이기 위한 운영 기준이다. 앱 코드 변경 방법이 아니라 측정 환경, 측정 정의, 정리 순서를 고정하는 데 초점을 둔다.

## 기본 환경 세팅

- 비교 기준은 `vite dev`가 아니라 `npm run build` 후 `vite preview`다.
- 기준 브랜치와 대상 브랜치를 같은 머신, 같은 Chrome, 같은 해상도에서 실행한다.
- 로컬 preview는 `127.0.0.1:4173`, Chrome remote debugging은 `127.0.0.1:9222`처럼 포트를 고정한다.
- Chrome remote debugging용 `--user-data-dir`는 repo 내부가 아니라 `%TEMP%` 계열 전용 디렉터리를 쓴다.
- repo 안에 브라우저 프로필 캐시를 남기지 않는다. build가 Tailwind/Vite 스캔에 끌려가며 느려질 수 있다.
- 측정 전에는 4173, 9222 포트가 이미 점유되어 있지 않은지 확인하고, 남아 있는 preview 서버와 임시 Chrome을 먼저 정리한다.

## 권장 실행 예시

```powershell
npm run build
.\node_modules\.bin\vite.cmd preview --host 127.0.0.1 --port 4173
```

```powershell
"C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --user-data-dir="$env:TEMP\codex-perf-chrome-profile" `
  --remote-debugging-port=9222 `
  --no-first-run `
  http://127.0.0.1:4173
```

## 표준 측정 절차

1. 기준 브랜치를 checkout하고 `npm run build` 후 `vite preview`로 실행한다.
2. 전용 Chrome을 띄우고 cache disabled 상태에서 하드 새로고침 기반 trace를 수집한다.
3. `Performance` 기준으로 하드 새로고침 직후 8~10초를 기록한다.
4. 모델 포인트가 화면에 잡히는 시점까지의 `longest task`와 `JS heap 증가량`을 기록한다.
5. 인물 포인트와 나무 포인트 외형이 기존과 동일한지 함께 확인한다.
6. 같은 조건으로 3회 반복하고, 표에는 중앙값을 적는다.
7. 흔들림이 있으면 숫자를 억지로 하나로 설명하지 말고 범위를 메모에 남긴다.
8. 기준 브랜치 측정이 끝나면 preview 서버를 내리고 대상 브랜치에서 같은 절차를 반복한다.

## 측정 정의

- 포인트 가시화 시점: 인물 포인트와 나무 포인트 클라우드가 둘 다 정상 실루엣으로 동시에 보이는 첫 프레임.
- `longest task`: navigation start부터 포인트 가시화 시점까지 main thread에서 가장 긴 단일 task 시간.
- `peak JS heap 증가량`: navigation start 시점 대비, 포인트 가시화 시점까지 관측된 peak `jsHeapSizeUsed` 증가량.
- 시각 결과: 인물/나무 포인트 실루엣, 밀도, 색감, 위치가 기존과 다르지 않은지 여부.

## 수치 정리 원칙

- 절대 성능 수치보다 브랜치 간 상대 비교를 우선한다.
- 표에는 3회 중앙값을 적고, 메모에는 필요 시 범위를 적는다.
- 수치는 브라우저 버전, 해상도, 장비, GPU 상태에 따라 바뀌므로 문서나 PR에서 항상 측정 조건을 같이 적는다.
- 코멘트용 숫자는 가능한 한 `ms`, `MB`, `x3 trace`처럼 단위를 포함해 바로 붙여넣을 수 있게 정리한다.

## 작업 후 정리 체크리스트

- preview 서버 프로세스 종료
- remote-debug Chrome 종료
- 4173, 9222 포트 해제 확인
- 임시 JSON, screenshot, trace 결과 정리
- repo 안에 브라우저 프로필 캐시가 생기지 않았는지 확인
- PR 코멘트에 측정 조건과 수치, 시각 회귀 여부까지 함께 기록
