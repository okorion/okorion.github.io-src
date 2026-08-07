export interface EvidenceItem {
  id: string;
  index: string;
  title: string;
  context: string;
  period: string;
  problem: string;
  contribution: string;
  decision: string;
  validation: string;
  technologies: readonly string[];
}

export interface ProjectLink {
  label: "Demo" | "Source" | "Architecture";
  href: string;
}

export interface PublicProject {
  id: string;
  index: string;
  title: string;
  category: string;
  description: string;
  boundary: string;
  image: string;
  imageAlt: string;
  technologies: readonly string[];
  links: readonly ProjectLink[];
}

export const evidenceItems: readonly EvidenceItem[] = [
  {
    id: "builder-consistency",
    index: "01",
    title: "2D Web Builder — 페이지·Header 저장 일관성",
    context: "GAIA / FX Studio · 프로젝트 참여",
    period: "프로젝트 2025.12–현재",
    problem:
      "페이지 구조를 직접 변경하면 화면은 바뀌어도 저장 가능한 변경 이력이 남지 않았고, 기존 Header 동작과 신규 버튼 이벤트가 충돌했습니다.",
    contribution:
      "페이지 추가·삭제·이름 변경·순서 이동을 전용 동기화 이벤트와 command batch로 연결하고 client·Runtime·server·DB 저장 경계를 따라 동작을 확인했습니다.",
    decision:
      "페이지 변경과 Header 재구성을 묵시적 side effect로 두지 않고 하나의 저장 가능한 명령 흐름으로 묶어 중간 상태를 줄였습니다.",
    validation:
      "Studio에서 페이지 구조를 바꾼 뒤 저장·불러오기와 Runtime 실행을 대조해 페이지 식별자·이름·순서가 일치하는지 검증했습니다.",
    technologies: ["React", "TypeScript", "MobX", "WebSocket"],
  },
  {
    id: "smartmap-contract",
    index: "02",
    title: "SmartMap — Studio·Runtime 상태 계약과 현장 검증",
    context: "티맥스가이아 · 지도 제품",
    period: "2026.03–2026.07",
    problem:
      "Studio 편집 상태, 저장 모델, Runtime 표시와 서버 메타데이터가 같은 의미를 유지해야 했고, 모바일에서는 터치·현재 위치·시설 선택·유효하지 않은 좌표도 함께 다뤄야 했습니다.",
    contribution:
      "현재 위치·선택·추적·좌표 보정의 저장·파싱·fallback과 이벤트 흐름을 client·Runtime·server 경계에 연결했습니다.",
    decision:
      "Studio에서는 위치 추적을 차단하고 Runtime이 실제 사용자 상호작용을 소유하도록 편집·실행 환경의 책임을 분리했습니다.",
    validation:
      "저장·불러오기와 Runtime 실행을 확인한 뒤 공식 행사 앱에 적용했고, 출시 전 송도와 행사 중 현장에서 현재 위치·방향을 검증했습니다.",
    technologies: ["React", "TypeScript", "Mobile WebView", "Runtime"],
  },
  {
    id: "editor-consistency",
    index: "03",
    title: "3D Interactive Content Editor — 편집 상태 일관성",
    context: "티맥스메타에이아이 (구 티맥스메타버스)",
    period: "2023.05–2025.12",
    problem:
      "캔버스 선택, 계층 구조, 속성 패널, 씬 설정과 저장 데이터가 서로 다른 시점의 상태를 가리키면 이전 객체가 수정되거나 불러오기 후 속성이 달라질 수 있었습니다.",
    contribution:
      "오브젝트·씬 편집 UI, 계층 구조 UX와 상호작용·이벤트 오류를 수정하고 생성·삭제·변경을 추적 가능한 상태와 기존 command·Undo/Redo 흐름에 연결했습니다.",
    decision:
      "Three.js 객체 직접 변경에 의존하지 않고 UI가 구독할 상태 모델을 두어 단일·다중 선택과 기본 도형·외부 에셋을 같은 편집 경계로 맞췄습니다.",
    validation:
      "저장·불러오기, 복제·삭제, Undo/Redo, 선택 전환·입력 포커스 시나리오에서 캔버스·패널·계층이 같은 사용자 의도를 반영하도록 안정화했습니다.",
    technologies: ["React", "TypeScript", "Three.js", "MobX"],
  },
];

export const publicProjects: readonly PublicProject[] = [
  {
    id: "localmesh",
    index: "01",
    title: "LocalMesh Studio",
    category: "Local-first 3D · AI experiment",
    description:
      "3D 장면 편집, 로컬 LLM 명령과 브라우저 저장을 하나의 SceneCommand·Yjs 문서 흐름으로 연결한 local-first Studio 실험입니다. 모델 응답은 스키마 검증과 사용자 승인 뒤 장면에 적용됩니다.",
    boundary:
      "공개 데모는 IndexedDB 기반 로컬 모드입니다. 협업 서버는 로컬 개발용이며 운영 인증·접근 제어·서버 영속 저장을 갖춘 서비스가 아닙니다.",
    image:
      "https://raw.githubusercontent.com/okorion/localmesh-studio/main/public/og.png",
    imageAlt: "LocalMesh Studio의 3D 편집 화면",
    technologies: ["React", "Three.js", "WebGPU", "WebLLM", "Yjs"],
    links: [
      {
        label: "Demo",
        href: "https://localmesh-studio.okorion.chatgpt.site",
      },
      {
        label: "Source",
        href: "https://github.com/okorion/localmesh-studio",
      },
      {
        label: "Architecture",
        href: "https://github.com/okorion/localmesh-studio/blob/main/docs/architecture.md",
      },
    ],
  },
  {
    id: "vizport",
    index: "02",
    title: "VizPort Studio",
    category: "Data visualization studio",
    description:
      "CSV·TSV·JSON을 브라우저에서 분석해 규칙 기반 그래프 후보와 추천 근거를 제시하고, 실제 미리보기에서 React 코드·LLM 프롬프트·VizSpec까지 내보내는 시각화 Studio입니다.",
    boundary:
      "AI는 선택적 추천 보정 기능입니다. 차트는 현재 Canvas 기반이며 WebGPU 렌더러는 확장 경계만 정의됐습니다.",
    image:
      "https://raw.githubusercontent.com/okorion/vizport-studio/main/public/og.png",
    imageAlt: "VizPort Studio의 데이터 시각화 작업 화면",
    technologies: ["React", "TypeScript", "Canvas", "ECharts"],
    links: [
      {
        label: "Demo",
        href: "https://vizport-studio.okorion.chatgpt.site",
      },
      {
        label: "Source",
        href: "https://github.com/okorion/vizport-studio",
      },
      {
        label: "Architecture",
        href: "https://github.com/okorion/vizport-studio/blob/main/ARCHITECTURE.md",
      },
    ],
  },
  {
    id: "mermaid-sky",
    index: "03",
    title: "Mermaid Sky Exporter",
    category: "Diagram export · PWA",
    description:
      "Mermaid 다이어그램을 실시간 렌더링하고 SVG·PNG·JPG로 내보내며, URL 공유·모바일 공유 fallback·설치 가능한 PWA 흐름을 제공하는 공개 웹 도구입니다.",
    boundary:
      "브라우저에서 바로 사용할 수 있는 단일 목적 도구로, 다이어그램 편집·내보내기·공유 흐름에 범위를 집중했습니다.",
    image:
      "https://raw.githubusercontent.com/okorion/mermaid-sky-exporter/main/public/homepage.png",
    imageAlt: "Mermaid Sky Exporter의 편집기와 미리보기 화면",
    technologies: ["Next.js", "React", "TypeScript", "Mermaid", "PWA"],
    links: [
      {
        label: "Demo",
        href: "https://mermaid-sky-exporter.vercel.app",
      },
      {
        label: "Source",
        href: "https://github.com/okorion/mermaid-sky-exporter",
      },
    ],
  },
];

export const experienceItems = [
  {
    company: "티맥스가이아",
    role: "Frontend Engineer",
    period: "2026.02–현재",
    details: [
      "GAIA 2D Web Builder·FX Studio · 현 소속 참여 2026.02–현재",
      "Editor·Builder의 모드, 위젯, 이벤트, 저장과 Runtime 연계",
    ],
  },
  {
    company: "티맥스메타에이아이 (구 티맥스메타버스)",
    role: "Frontend Engineer",
    period: "2023.05–2026.01",
    details: [
      "3D Interactive Content Editor · 2023.05–2025.12",
      "3D 임상시험 교육 시뮬레이션 · 2024.07–2025.11",
    ],
  },
] as const;

export const credentials = [
  "SSAFY 7기 · 1,600시간 · 2022",
  "AWS Certified Solutions Architect – Associate · 2025.07 · 2028.07까지 유효",
  "정보처리기사 · 2022.11",
  "SQL 개발자(SQLD) · 2021.12",
] as const;
