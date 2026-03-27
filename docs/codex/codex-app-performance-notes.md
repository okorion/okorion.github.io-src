# Codex app 성능 실측 운영 메모

## 목적

PR #161의 문서가 Chrome DevTools 기반 표준 측정 절차를 정리했다면, 이 문서는 Codex app 안에서 비교 실행, 자동 입력, GitHub 코멘트 갱신까지 빠르게 끝낼 때 도움이 된 운영 메모를 정리한다. 일반 원칙보다 실제로 시간을 줄여 준 흐름과 함정을 우선 적는다.

## 이 문서를 먼저 보면 좋은 경우

- 현재 작업 브랜치를 건드리지 않고 기준 브랜치와 대상 브랜치를 같이 실행해야 할 때
- Codex app에서 1차 자동 비교를 하고, 최종 코멘트만 GitHub에 반영하면 될 때
- 기존 top-level PR 코멘트를 새로 쓰지 않고 수정해야 할 때

## 빠른 실행 순서

1. GitHub connector로 PR 제목, base/head 브랜치, 기존 코멘트 id를 먼저 확인한다.
2. 현재 작업 브랜치는 그대로 두고 `.codex-tmp` 아래에 `git worktree`로 기준/대상 브랜치를 분리한다.
3. 두 worktree에서 `npm run build`를 먼저 끝내고, `vite preview`를 고정 포트로 띄운다.
4. Chrome remote debugging 인스턴스를 별도 프로필로 띄우고, 로드 후 3초 대기 뒤 자동 입력을 시작한다.
5. 측정은 warm-up 1회, 실측 3회, 중앙값 기준으로 정리한다.
6. 결과를 GitHub 기존 코멘트에 업데이트하고, preview/Chrome/worktree/temp 디렉터리를 모두 정리한다.

## worktree 운영 팁

- docs 작업이 `main`에만 반영되어 있다면, 문서 PR도 `main` 기준 브랜치에서 시작하는 편이 충돌이 적다.
- 성능 비교는 현재 checkout을 바꾸기보다 `.codex-tmp/pr-<번호>` 아래 임시 worktree를 두 개 만드는 편이 안전하다.
- 기준 브랜치와 대상 브랜치의 `package-lock.json`이 같다면 root `node_modules`를 junction으로 재사용해 설치 시간을 줄일 수 있다.
- `package.json`이나 lockfile이 다르면 junction 재사용을 피하고 worktree별 설치로 분리한다.
- 정리 순서는 `백그라운드 프로세스 종료 -> git worktree remove --force -> temp 디렉터리 삭제`가 가장 깔끔했다.

## preview 서버 기동 팁

- Codex app shell에서는 장시간 유지되는 프로세스를 포그라운드로 잡아두기보다 백그라운드로 띄우는 편이 안정적이었다.
- Windows에서는 아래 형태가 가장 다루기 쉬웠다.

```powershell
cmd.exe /d /c start "" /b npm run preview -- --host 127.0.0.1 --port 4173
cmd.exe /d /c start "" /b npm run preview -- --host 127.0.0.1 --port 4174
```

- 서버 준비 여부는 `Invoke-WebRequest`로 확인하면 다음 단계 실패를 줄일 수 있다.

```powershell
Invoke-WebRequest http://127.0.0.1:4173 -UseBasicParsing
Invoke-WebRequest http://127.0.0.1:4174 -UseBasicParsing
```

## Chrome / CDP 운영 팁

- Chrome 프로필은 repo 내부가 아니라 `%TEMP%` 또는 별도 임시 디렉터리에 둔다.
- Codex app 내장 브라우저 흐름이 바로 잡히지 않으면 Chrome remote debugging과 raw CDP 스크립트로 우회할 수 있다.
- interactive PR은 로드 직후가 아니라 intro animation 종료 뒤 측정해야 해서, 자동 입력 전에 최소 3초 대기를 넣는 편이 좋았다.
- viewport, 브라우저 버전, 입력 순서를 고정하지 않으면 수치보다 노이즈가 더 커진다.

```powershell
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" `
  --headless=new `
  --disable-gpu `
  --remote-debugging-port=9222 `
  --user-data-dir="$env:TEMP\codex-perf-chrome-profile" `
  about:blank
```

## raw CDP 자동 계측에서 배운 점

- 현재 Codex app Node 런타임에는 전역 `WebSocket`이 없을 수 있다. 임시 CDP 스크립트를 쓴다면 temp 디렉터리에 `ws`만 별도로 설치하는 방식이 가장 간단했다.
- 계측 스크립트는 tracked file이 아니라 `.codex-tmp` 아래에 두고 종료 후 삭제한다.
- 자동 입력 시퀀스는 고정해야 비교가 쉬웠다. 실제로는 `wheel down -> wheel up -> drag sweep -> wheel + drag 혼합` 순서가 재현성이 좋았다.
- 실측 3회 전 warm-up 1회를 넣으면 첫 로드 노이즈를 조금 줄일 수 있었다.

## 수치 해석 원칙

- headless FPS는 절대값보다 브랜치 간 상대 비교만 신뢰한다.
- `Performance.getMetrics`의 `TaskDuration`은 headless 자동 입력 흐름에서는 거의 포화된 값처럼 보일 수 있으므로 절대적인 CPU 사용률처럼 해석하지 않는다.
- console error, runtime exception, 입력 중단 여부는 정량 수치보다 먼저 확인한다.
- 유의미한 차이가 없으면 억지로 개선이라고 쓰지 말고 `오차 범위`, `유의미한 차이 없음`으로 적는다.
- 수치 차이가 작더라도 코드상 의도된 변경점(`useFrame` 통합, `dpr` clamp 등)은 별도로 설명해 두면 리뷰 맥락이 살아난다.
- 최종 체감이 중요한 PR이면 GUI Chrome DevTools로 한 번 더 검증한다.

## GitHub 코멘트/PR 처리 팁

- PR 본문보다 먼저 PR 메타데이터와 기존 코멘트 id를 확인하면 재작업이 줄어든다.
- 목표가 기존 top-level 코멘트 수정이라면 새 코멘트를 추가하지 말고 issue comment update로 끝내는 편이 깔끔하다.
- 코멘트에는 최소한 브라우저 버전, viewport, 반복 횟수, 중앙값 사용 여부를 함께 적는다.
- 문서/운영 메모 PR은 기본적으로 새 브랜치에서 커밋하고 draft PR로 올린 뒤, 설명을 다듬는 흐름이 안전하다.

## 추천 정리 문구

```md
- headless production preview 자동 계측 기준으로는 유의미한 성능 차이를 확인하지 못했습니다.
- 다만 자동 입력 기준으로 console error / exception / 입력 중단은 없었습니다.
- 사용자 체감이 중요한 경우 GUI Chrome DevTools `Performance`로 추가 확인하는 것이 좋습니다.
```
