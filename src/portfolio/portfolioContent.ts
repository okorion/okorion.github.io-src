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

export interface TechnicalWritingItem {
  id: string;
  index: string;
  category: "Troubleshooting" | "Implementation" | "Architecture Decision";
  title: string;
  summary: string;
  takeaway: string;
  publishedAt: string;
  publishedLabel: string;
  technologies: readonly string[];
  href: string;
}

export const evidenceItems: readonly EvidenceItem[] = [
  {
    id: "builder-consistency",
    index: "01",
    title: "2D Web Builder — 페이지·Header 저장 일관성",
    context: "B2B 2D Web Builder / Studio · 프로젝트 참여",
    period: "프로젝트 2025.12–현재",
    problem:
      "페이지 구조를 직접 변경하면 화면은 바뀌어도 저장 가능한 변경 이력이 남지 않았고, 기존 Header 동작과 신규 버튼 이벤트가 충돌했습니다.",
    contribution:
      "페이지 추가·삭제·이름 변경·순서 이동을 전용 동기화 이벤트와 command batch로 처리하고, 저장한 변경 내용이 Studio와 Runtime, 서버와 DB에 동일하게 반영되는지 확인했습니다.",
    decision:
      "페이지 변경과 Header 재구성이 암묵적으로 실행되지 않도록 저장 가능한 하나의 명령 흐름으로 묶어, 중간 상태를 줄였습니다.",
    validation:
      "Studio에서 페이지 구조를 바꾼 뒤 저장·불러오기와 Runtime 실행을 대조해 페이지 식별자·이름·순서가 일치하는지 확인했습니다.",
    technologies: ["React", "TypeScript", "MobX", "WebSocket"],
  },
  {
    id: "smartmap-contract",
    index: "02",
    title: "B2B Map Studio — Studio·Runtime 상태 계약과 현장 검증",
    context: "B2B 지도 제품 · 프로젝트 참여",
    period: "2026.03–2026.07",
    problem:
      "Studio 편집 상태, 저장 모델, Runtime 표시와 서버 메타데이터가 같은 의미를 유지해야 했고, 모바일에서는 터치·현재 위치·시설 선택·유효하지 않은 좌표도 함께 다뤄야 했습니다.",
    contribution:
      "현재 위치·선택·추적·좌표 보정이 client·Runtime·server에서 같은 방식으로 저장되고 해석되도록 구현했습니다. 잘못된 좌표를 처리하는 fallback과 이벤트 흐름도 정리했습니다.",
    decision:
      "위치 추적은 Studio에서 실행하지 않고 Runtime에서만 동작하도록 나눴습니다. 편집 중 상태와 실제 사용자의 위치 추적이 섞이지 않게 하기 위한 선택이었습니다.",
    validation:
      "저장·불러오기와 Runtime 실행을 확인한 뒤 운영 앱에 적용했고, 출시 전과 운영 기간 중 실제 모바일·현장 환경에서 현재 위치와 방향을 확인했습니다.",
    technologies: ["React", "TypeScript", "Mobile WebView", "Runtime"],
  },
  {
    id: "editor-consistency",
    index: "03",
    title: "3D Interactive Content Editor — 편집 상태 일관성",
    context: "B2B 3D Interactive Content Editor · 프로젝트 참여",
    period: "2023.05–2025.12",
    problem:
      "캔버스 선택, 계층 구조, 속성 패널, 씬 설정과 저장 데이터가 서로 다른 시점의 상태를 가리키면 이전 객체가 수정되거나 불러오기 후 속성이 달라질 수 있었습니다.",
    contribution:
      "오브젝트·씬 편집 UI와 계층 구조 UX를 개선하고 상호작용·이벤트 오류를 수정했습니다. 생성·삭제·변경은 기존 command와 Undo/Redo에 기록되도록 연결했습니다.",
    decision:
      "Three.js 객체를 직접 바꾸는 대신 UI가 구독하는 상태 모델을 두었습니다. 단일·다중 선택과 기본 도형·외부 에셋을 같은 방식으로 편집할 수 있게 했습니다.",
    validation:
      "저장·불러오기, 복제·삭제, Undo/Redo, 선택 전환·입력 포커스 시나리오에서 캔버스·패널·계층 UI가 서로 다른 상태를 보여주지 않도록 안정화했습니다.",
    technologies: ["React", "TypeScript", "Three.js", "MobX"],
  },
];

export const publicProjects: readonly PublicProject[] = [
  {
    id: "localmesh",
    index: "01",
    title: "LocalMesh Studio",
    category: "3D mesh studio · AI-assisted toy project",
    description:
      "브라우저에서 3D 오브젝트를 배치·변형하고, 로컬 AI가 만든 명령을 확인한 뒤 장면에 적용해 보는 실험용 Studio입니다. 장면은 브라우저에 저장되며 로컬 개발 환경에서는 Yjs 기반 동기화 흐름도 확인할 수 있습니다.",
    boundary:
      "AI 보조로 빠르게 만든 토이 프로젝트입니다. 로컬 저장과 개발용 동기화 흐름을 중심으로 공개하며, 운영 인증·권한·서버 저장은 제공하지 않습니다.",
    image:
      "https://raw.githubusercontent.com/okorion/localmesh-studio/main/public/og.png",
    imageAlt:
      "LocalMesh Studio 로고와 네트워크·AI 아이콘이 있는 보라색 3D 큐브 브랜드 그래픽",
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
    category: "Chart codegen · AI-assisted toy project",
    description:
      "샘플 데이터에서 차트 추천을 고르고 미리 본 뒤 React 코드를 복사해 보는 데이터 시각화 코드젠 실험입니다. CSV·TSV·JSON 파일은 브라우저에서 분석합니다.",
    boundary:
      "AI 보조로 빠르게 만든 토이 프로젝트입니다. 규칙 기반 추천과 Canvas 미리보기를 중심으로 공개하며, AI 보정은 선택 사항입니다.",
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
      "Mermaid 다이어그램을 실시간으로 미리 보고 SVG·PNG·JPG로 내보낼 수 있는 웹 도구입니다. URL 및 모바일 공유와 PWA 설치도 지원합니다.",
    boundary:
      "브라우저에서 바로 사용할 수 있으며, 다이어그램 편집·내보내기·공유에 필요한 기능만 담았습니다.",
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

export const technicalWritingItems: readonly TechnicalWritingItem[] = [
  {
    id: "pwa-service-worker-cache",
    index: "01",
    category: "Troubleshooting",
    title: "PWA 서비스워커가 MyHits 조회수 배지를 캐시한 문제 해결기",
    summary:
      "일반 브라우저에서만 오래된 조회수가 보이는 증상을 시크릿 모드와 비교하고, 서비스워커가 동적 이미지 응답을 캐시한 원인을 좁혀 예외 처리했습니다.",
    takeaway:
      "조회수처럼 요청할 때마다 최신 값이 필요한 리소스는 서비스워커 캐시에서 제외하고, 실제 업데이트 시점까지 확인해야 합니다.",
    publishedAt: "2026-05-29",
    publishedLabel: "2026.05",
    technologies: ["PWA", "Service Worker", "Cache Storage"],
    href: "https://velog.io/@okorion/PWA-서비스워커가-MyHits-조회수-배지를-캐시한-문제-해결기-rfvfju0v",
  },
  {
    id: "github-pages-points-web",
    index: "02",
    category: "Implementation",
    title: "🌆 GitHub.io 페이지 제작기 (2) - Points 컨셉의 3D Web 구현",
    summary:
      "Points 기반 수렴·입자 효과와 카메라 인터랙션을 구현하고, 이동 시 오브젝트가 사라지는 절두체 컬링 이슈를 기록했습니다.",
    takeaway:
      "Points 기반 시각 효과를 구현하면서 마주친 절두체 컬링 문제를 기록한 글입니다.",
    publishedAt: "2025-04-20",
    publishedLabel: "2025.04",
    technologies: ["Three.js", "Particles", "Camera Interaction"],
    href: "https://velog.io/@okorion/GitHub.io-페이지-제작기-2-Points-web",
  },
  {
    id: "mermaid-url-sharing",
    index: "03",
    category: "Architecture Decision",
    title: "URL 기반 다이어그램 공유 설계 및 구현 (완전 클라이언트 방식)",
    summary:
      "Mermaid Sky Exporter에서 서버 저장소 없이 다이어그램 상태를 URL로 공유하기 위해 JSON 직렬화와 LZ-String 압축·복원 흐름을 설계하고, 버전 호환성과 URL 길이·민감 정보 노출 한계를 정리했습니다.",
    takeaway:
      "작은 공유 도구라면 서버를 바로 추가하기보다 URL로 상태를 전달하는 방식도 선택지가 됩니다. 다만 데이터 크기와 보안, 확장 범위는 먼저 정해야 합니다.",
    publishedAt: "2025-10-04",
    publishedLabel: "2025.10",
    technologies: ["TypeScript", "LZ-String", "Client Architecture"],
    href: "https://velog.io/@okorion/URL-기반-다이어그램-공유-설계-및-구현완전-클라이언트-방식",
  },
];

export const experienceItems = [
  {
    company: "티맥스가이아",
    role: "Frontend Engineer",
    period: "2026.02–현재",
    details: [
      "B2B 2D Web Builder / Studio · 현 소속 참여 2026.02–현재",
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
  "리눅스마스터 2급 · 2025.07",
  "정보처리기사 · 2022.11",
  "SQL 개발자(SQLD) · 2021.12",
] as const;

export const additionalCredentials = [
  "빅데이터분석기사 · 2025.12",
  "데이터분석 준전문가(ADsP) · 2025.09",
  "투자자산운용사 · 한국금융투자협회 · 2026.05",
] as const;
