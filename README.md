# okorion · AI와 함께 만드는 도구와 웹

제품의 목적과 사용 흐름을 정하고, AI로 구현한 결과를 확인하며 화면과 동작을 다듬습니다. 이 사이트는 개인 결과물의 화면, 사용 흐름과 제작 역할을 소개합니다.

| 화면 | 주소 | 내용 |
| --- | --- | --- |
| 대표 결과물 | [홈](https://okorion.github.io/) | Rust 3D Engine Lab → 정기 재무 보고서 검토 지원 도구 → Aether Studio |
| 전체 프로젝트 | [프로젝트 목록](https://okorion.github.io/?view=projects) | Ember Studio, Mermaid Sky Exporter, VizPort Studio, LocalMesh Studio 등 |
| 소개 | [소개·제작 방식](https://okorion.github.io/?view=about) | 사람이 정한 방향과 피드백, AI가 맡은 구현, 자격·특허 |
| 3D 경험 | [3D 열기](https://okorion.github.io/?view=3d) | 선택해서 들어가는 인터랙티브 장면 |

개별 사례에는 확인한 기능과 사용 범위를 적었습니다. 보고서 도구의 화면은 실제 UI에 식별 텍스트와 데이터를 예시로 교체한 자료입니다.

## 로컬 실행

```bash
npm ci
npm run dev -- --host 127.0.0.1
```

```bash
npm run lint
npm run typecheck
npm run test:portfolio
npm run build
```

## 콘텐츠와 화면

- `src/portfolio/portfolioContent.ts`: 소개, 프로젝트별 사실·역할·링크, 대표 순서, 자격·특허
- `src/portfolio/`: 행 목록, 프로젝트 상세, 소개와 반응형 스타일
- `src/app/siteView.ts`: 기본 화면과 선택형 3D 화면의 경로
- `src/legacy/`: 선택형 3D 경험. 기본 화면에서는 3D 코드를 지연 로딩합니다.
- `public/images/projects/`: 공개용으로 검수한 프로젝트 화면
- `index.html`: 기본 제목·설명·공유 이미지·JavaScript 미사용 시 안내

프로젝트를 추가하거나 상태를 바꿀 때 중앙 콘텐츠와 해당 화면·링크를 함께 확인합니다. 사용자 판단과 AI 구현 역할, 사용 보고와 자동 검사 결과를 구분합니다.

## 빌드와 배포

이 저장소는 소스입니다. `main` 변경 시 GitHub Actions가 설치·검사·빌드 후 `dist`를 `okorion/okorion.github.io`의 `main`으로 게시합니다. 배포 저장소의 생성물을 직접 편집하지 않습니다. 로컬 `npm run deploy`는 별도 경로이므로 이 배포 흐름에서는 사용하지 않습니다.

## 공개 콘텐츠 검사

개인 결과물 소개에 승인된 VizPort Studio·LocalMesh Studio는 현재 사이트에서 소개합니다. 기존 경력 문서 분류 카탈로그는 별도로 보존합니다. 공개 자산·메타데이터·소스와 빌드 결과에서 내부 주소, 로컬 경로, 민감정보가 섞이지 않는지 검사합니다.
