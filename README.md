# okorion.github.io

주요 업무와 역할, 기술적 판단을 빠르게 살펴볼 수 있도록 구성한 포트폴리오입니다.

| 화면 | 경로 | 역할 |
| --- | --- | --- |
| Portfolio | [okorion.github.io](https://okorion.github.io/) | 업무 사례, 공개 프로젝트, 경력·자격 |
| 3D Lab | [okorion.github.io/?view=3d](https://okorion.github.io/?view=3d) | 이전 포트폴리오의 인터랙티브 3D 장면 |
| Technical Writing | [velog.io/@okorion](https://velog.io/@okorion) | 구현·트러블슈팅·기술 판단 기록 |

기본 화면은 `src/app/siteView.ts`의 `DEFAULT_SITE_VIEW` 한 줄로 전환할 수 있으며, 이전 3D 구현은 `src/legacy/` 아래에서 유지합니다.

## 공개 프로젝트 분류

- `LocalMesh Studio`와 `VizPort Studio`는 AI 보조로 빠르게 만든 토이 프로젝트로, 공개 결과와 구현 범위를 보여줍니다.
- `Mermaid Sky Exporter`는 실제 사용 흐름을 유지하는 개인 웹 도구입니다.
- 각 프로젝트의 세부 README는 현재 구현 범위와 실행 방법을 설명하므로 별도 표현 변경 없이 유지합니다.

## 현재 포트폴리오

![콘텐츠 우선 포트폴리오](./docs/pr-evidence/portfolio-hybrid-landing/after.png)

```bash
npm run lint
npm run typecheck
npm run test:portfolio
npm run build
```

## 3D Lab UI

|메인 장면|브랜드 패널 확장 상태|
|-|-|
|![메인 장면](./docs/images/main-scene-overview.png)|![브랜드 패널 확장 상태](./docs/images/brand-panel-expanded.png)|

- 좌측 상단 브랜드 패널을 최소화/확장 가능한 glass UI로 정리했습니다.
- 우측 3D overlay menu를 카드형 패널로 재구성하고, 링크 정보 계층과 배치를 다듬었습니다.
- 전체 카피를 한국어 중심으로 정리해 장면을 유지한 채 원하는 링크로 바로 이동할 수 있도록 구성했습니다.

### 🖼 시각 효과
#### 수렴 애니메이션 효과
|1|2|3|4|
|-|-|-|-|
|![](https://velog.velcdn.com/images/okorion/post/0ae26f20-86fd-4699-8ce4-9e9de3cd884f/image.png)|![](https://velog.velcdn.com/images/okorion/post/a1facbff-ae0e-42b8-a5c0-75eee29bc09e/image.png)|![](https://velog.velcdn.com/images/okorion/post/a637f3c4-6ae4-451e-ace8-bd65b5fa4219/image.png)|![](https://velog.velcdn.com/images/okorion/post/4f6aee6d-b24d-4be3-9536-ac41e33b1c8f/image.png)|

#### 시야 별 입자 효과
|카메라 위치 y >= 0|카메라 위치 y < 0|
|-|-|
|![image](https://github.com/user-attachments/assets/48394588-3675-46fd-b138-72e97a012ae3)|![Image](https://github.com/user-attachments/assets/dea57a8f-b304-4579-96f2-5e87e3515445)|


|첫 화면|
|-|
|![](https://velog.velcdn.com/images/okorion/post/840e940f-6b21-4c47-9154-c67ee0a1fd5b/image.png)|


|가이드 포인트|마우스 인터렉션|
|-|-|
|![image](https://github.com/user-attachments/assets/9a53191d-f089-4af0-b2e4-a4ca480cfc1a)|![image](https://github.com/user-attachments/assets/355904b2-2577-418b-8eed-da19f78b5ded)|

- 그 외
  - 버드나무 내부 Falling Particle 효과
  - 버드나무 Points 색상 그라데이션, 입자 운동
  - 바닥 Floor Points 오브젝트 중앙 입자 밀도 조절, 중심 기준 회전
  - 마우스 인터렉션 보간 적용(Camera Control)



#### 제작 과정
|1|2|
|-|-|
|![image](https://github.com/user-attachments/assets/a6cea46b-2742-4d0b-bafc-bf4001f2a194)|![image](https://github.com/user-attachments/assets/04fb8d83-563b-4a79-ab52-b4da3491e660)|

|3|4|
|-|-|
|![image](https://github.com/user-attachments/assets/383c4fc5-86c2-47c9-9550-40e3329c6122)|![image](https://github.com/user-attachments/assets/6e15fa2f-3e24-4fdc-8f03-f9e7dc24381b)|

## Docs
- [Codex performance testing docs](./docs/README.md)
- [Learning Archive — 이전 강의 및 기술 학습 기록](https://okorion.github.io/tech-blog/)
