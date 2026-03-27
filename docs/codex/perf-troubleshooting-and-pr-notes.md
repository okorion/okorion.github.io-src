# Codex 성능 테스트 트러블슈팅 및 PR 메모

## 빠른 트러블슈팅

| 원인 | 증상 | 해결 |
| --- | --- | --- |
| repo 내부 Chrome 프로필 캐시 사용 | `vite build`가 `transforming...`에서 오래 머물거나 비정상적으로 느려짐 | remote-debug Chrome 프로필을 `%TEMP%`로 옮기고, repo 내부 프로필 디렉터리를 정리한다. |
| `gh` 인증 만료 또는 무효 | PR 생성, PR 코멘트 수정, 코멘트 조회 자동화가 막힘 | 작업 시작 전에 `gh auth status`를 확인하고 필요하면 `gh auth login`으로 복구한다. |
| Codex app/Playwright 브라우저 경로 불안정 | 페이지 로드, trace, screenshot 수집이 들쭉날쭉함 | Chrome DevTools 수동 측정 또는 raw CDP 접근으로 우회한다. |
| PowerShell UTF-8 BOM | JSON 결과를 후처리할 때 `Unexpected token` 같은 parse 오류 발생 | BOM을 제거하고 파싱하거나 BOM 없는 방식으로 결과를 저장한다. |

## 측정 전 체크리스트

- 기준 브랜치와 대상 브랜치가 모두 로컬에 있고 최신 기준으로 정리되어 있는가
- 4173, 9222 포트가 비어 있는가
- preview 실행 전에 `npm run build`가 성공했는가
- Chrome 버전, 해상도, trace 길이를 메모해 둘 준비가 되었는가
- PR 코멘트 수정이 필요하면 `gh auth status`가 정상인가

## 측정 후 체크리스트

- `longest task`, `peak JS heap 증가량`, 시각 결과를 모두 정리했는가
- 3회 중앙값과 범위를 구분해서 적었는가
- 기준 브랜치와 현재 MR 모두 같은 측정 조건인지 다시 확인했는가
- preview 서버, 임시 Chrome, 결과 파일을 정리했는가
- 최종 PR 코멘트에 브라우저 버전과 trace 반복 횟수를 적었는가

## 성능 비교용 PR 코멘트 템플릿

```md
## 성능 비교 시나리오
1. 기준 브랜치 `develop` 과 이 MR 브랜치를 각각 실행합니다.
2. Chrome DevTools `Performance`에서 하드 새로고침 직후 8~10초를 기록합니다.
3. 모델 포인트가 화면에 잡히는 시점까지 메인 스레드 스파이크와 JS heap 변화를 비교합니다.
4. 인물과 나무의 포인트 외형이 이전과 동일하게 보이는지 확인합니다.

## 성능 비교 메모
| 항목 | 변경 전 | 변경 후 | 의미 |
| --- | --- | --- | --- |
| 모델 포인트 준비 | 모델별 중복 준비 경로 존재 | 준비 geometry 1회 재사용 | 초기 계산량 감소 |
| 시각 결과 | 인물/나무 포인트 렌더 | 동일 | 회귀 없이 최적화 |
| 정량 수치 | 직접 측정 필요 | 직접 측정 필요 | GPU/브라우저 차이 큼 |

## 기록용 표
| 측정 항목 | 기준 브랜치 | 현재 MR | 메모 |
| --- | --- | --- | --- |
| 첫 렌더 직후 longest task | 직접 측정 | 직접 측정 | 3회 중앙값 |
| 초기 JS heap 증가량 | 직접 측정 | 직접 측정 | peak heap 증가량 기준 |
```

## 기록용 표 템플릿

```md
| 측정 항목 | 기준 브랜치 | 현재 MR | 메모 |
| --- | --- | --- | --- |
| 첫 렌더 직후 longest task | 00.00ms | 00.00ms | 범위 메모 |
| 초기 JS heap 증가량 | +0.00MB | +0.00MB | peak heap 증가량 기준 |
```

## 최근 운영 예시

- 최근 실제 비교는 `develop` 과 `codex/perf-model-points-pipeline` 기준으로 수행했다.
- 조건은 Chrome `146.0.7680.165`, `1440x900`, hard reload 기반 `10s trace x3`였다.
- 중앙값 기준 `longest task`는 `38.93ms -> 34.61ms`였다.
- 중앙값 기준 `peak JS heap 증가량`은 `29.31MB -> 15.61MB`였다.
- 인물 포인트와 나무 포인트 외형은 동일했고, 위 수치는 문서 예시일 뿐 고정 budget으로 쓰지 않는다.
