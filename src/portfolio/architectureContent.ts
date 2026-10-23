export type PreviewKind =
  | "scene"
  | "document"
  | "table"
  | "review"
  | "timeline"
  | "code"
  | "diagram"
  | "chart"
  | "files";

export type ArchitectureStep = {
  id: string;
  title: string;
  subtitle: string;
  preview: PreviewKind;
  labels: string[];
  description: string;
  position: { x: number; y: number };
};

export type ArchitectureLink = {
  from: string;
  to: string;
  label: string;
  optional?: boolean;
  vertical?: boolean;
};

export type ProjectArchitectureContent = {
  summary: string;
  note: string;
  steps: ArchitectureStep[];
  links: ArchitectureLink[];
};

const left = { x: 0, y: 140 };
const middle = { x: 340, y: 140 };
const upper = { x: 680, y: 0 };
const lower = { x: 680, y: 280 };

// These are explanatory miniatures, not live app views or performance measurements.
export const architectures: Record<string, ProjectArchitectureContent> = {
  "rust-lab": {
    summary: "하나의 장면 문서로 두 렌더링 경로를 비교합니다.",
    note: "비교할 때는 같은 문서를 두 엔진에 순차 적용·캡처합니다.",
    steps: [
      {
        id: "editor",
        title: "장면 편집",
        subtitle: "React · Inspector · Gizmo",
        preview: "scene",
        labels: ["Scene", "Transform"],
        position: left,
        description:
          "오브젝트 선택과 이동, 속성 편집을 공통 명령으로 처리합니다. 편집 세션에서 선택 상태와 되돌리기 이력을 관리합니다.",
      },
      {
        id: "document",
        title: "공통 장면 문서",
        subtitle: "SceneDocument · EnginePort",
        preview: "document",
        labels: ["objects", "materials", "camera"],
        position: middle,
        description:
          "장면 문서와 에셋을 렌더러와 분리해 보관합니다. 공통 EnginePort가 같은 문서를 각 엔진에 전달합니다.",
      },
      {
        id: "rust",
        title: "Rust 렌더러",
        subtitle: "Rust · wgpu",
        preview: "scene",
        labels: ["wgpu", "Preview"],
        position: upper,
        description:
          "Rust와 wgpu 경로가 장면을 렌더링합니다. 엔진 전환 시 이전 렌더러를 해제한 뒤 다음 렌더러를 초기화합니다.",
      },
      {
        id: "three",
        title: "Three.js 렌더러",
        subtitle: "Three.js · WebGPU",
        preview: "scene",
        labels: ["WebGPU", "Preview"],
        position: lower,
        description:
          "독립적인 Three.js WebGPU 경로에 같은 장면 문서를 적용합니다. 순차 캡처한 결과를 비교 화면에서 확인합니다.",
      },
    ],
    links: [
      { from: "editor", to: "document", label: "편집 명령" },
      { from: "document", to: "rust", label: "장면 적용" },
      { from: "document", to: "three", label: "장면 적용" },
    ],
  },
  "report-review-tool": {
    summary: "수치 집계와 검토 의견을 분리하고, 사람이 최종 확인합니다.",
    note: "공개된 업무 흐름을 요약했습니다. AI 검토 의견은 원본 금액을 변경하지 않습니다.",
    steps: [
      {
        id: "input",
        title: "보고서 입력",
        subtitle: "Excel · 기간 선택",
        preview: "table",
        labels: ["계정", "당기", "전기"],
        position: left,
        description:
          "검토할 Excel 자료와 대상 기간을 입력합니다. 원본 자료를 기준으로 집계와 검토를 진행합니다.",
      },
      {
        id: "aggregate",
        title: "수치 집계",
        subtitle: "코드 기반 계산 · 기본 점검",
        preview: "table",
        labels: ["집계", "비교", "확인"],
        position: middle,
        description:
          "정해진 코드로 금액을 집계하고 기본적인 수치 검사를 수행합니다. 계산 결과와 AI의 검토 의견을 구분합니다.",
      },
      {
        id: "ai",
        title: "검토 후보 제안",
        subtitle: "AI · 확인 질문",
        preview: "review",
        labels: ["검토 계정", "확인할 질문"],
        position: upper,
        description:
          "AI가 추가로 확인할 계정 후보와 질문을 제안합니다. 원본 금액이나 집계 결과를 자동으로 수정하지 않습니다.",
      },
      {
        id: "human",
        title: "담당자 검토",
        subtitle: "수치와 의견 함께 확인",
        preview: "review",
        labels: ["집계 결과", "검토 의견"],
        position: lower,
        description:
          "담당자가 집계 수치와 검토 의견을 함께 확인하고 최종 판단합니다.",
      },
    ],
    links: [
      { from: "input", to: "aggregate", label: "원본 자료" },
      { from: "aggregate", to: "ai", label: "검토 대상" },
      { from: "aggregate", to: "human", label: "집계 결과" },
      { from: "ai", to: "human", label: "검토 의견", vertical: true },
    ],
  },
  "aether-studio": {
    summary: "스크롤 진행률을 3D 장면과 페이지 콘텐츠에 함께 연결합니다.",
    note: "장면의 카메라·입력·미디어 수명은 Scene에서 관리합니다.",
    steps: [
      {
        id: "input",
        title: "스크롤과 포인터",
        subtitle: "페이지 이동 · 포인터 움직임",
        preview: "timeline",
        labels: ["Scroll", "Pointer"],
        position: left,
        description:
          "스크롤 위치와 포인터 움직임을 입력으로 받습니다. 스크롤은 장면 진행률로, 포인터는 반응형 시각 효과의 입력으로 전달합니다.",
      },
      {
        id: "timeline",
        title: "진행률과 입력 매핑",
        subtitle: "ScrollTimeline · PointerFlow",
        preview: "timeline",
        labels: ["Progress", "Input field"],
        position: middle,
        description:
          "ScrollTimeline이 페이지 위치와 장면 진행률을 대응시킵니다. PointerFlow가 포인터 입력을 장면에 전달할 필드로 만듭니다.",
      },
      {
        id: "scene",
        title: "3D 장면",
        subtitle: "Three.js · 카메라 · 효과",
        preview: "scene",
        labels: ["Camera", "World"],
        position: upper,
        description:
          "진행률에 맞춰 카메라와 장면을 갱신하고, 포인터 필드를 시각 효과에 반영합니다. 장면 팩터리는 갱신과 해제 경로를 갖습니다.",
      },
      {
        id: "overlay",
        title: "페이지 콘텐츠",
        subtitle: "HTML · 텍스트 전환",
        preview: "document",
        labels: ["Section", "Heading", "Copy"],
        position: lower,
        description:
          "페이지의 텍스트와 콘텐츠 전환이 같은 스크롤 매핑을 사용합니다. 3D 장면과 페이지 설명이 같은 진행 구간을 따라갑니다.",
      },
    ],
    links: [
      { from: "input", to: "timeline", label: "사용자 입력" },
      { from: "timeline", to: "scene", label: "장면 갱신" },
      { from: "timeline", to: "overlay", label: "스크롤 매핑" },
    ],
  },
  "ember-studio": {
    summary: "빠른 제작과 상세 편집이 하나의 문서와 명령 체계를 사용합니다.",
    note: "플레이 상태는 편집 문서와 분리되며, 플레이를 멈추면 편집 상태로 돌아옵니다.",
    steps: [
      {
        id: "editor",
        title: "두 가지 편집 방식",
        subtitle: "Quick Create · 상세 편집",
        preview: "scene",
        labels: ["Quick Create", "Inspector"],
        position: left,
        description:
          "빠른 제작 화면과 상세 편집기가 같은 명령과 되돌리기 체계를 사용합니다. 편집 방식이 달라도 같은 프로젝트를 다룹니다.",
      },
      {
        id: "document",
        title: "프로젝트 문서",
        subtitle: "ProjectDocument · Assets",
        preview: "document",
        labels: ["scene", "assets", "settings"],
        position: middle,
        description:
          "장면과 설정은 ProjectDocument에, 에셋 처리는 AssetManager에 모읍니다. 문서가 미리보기와 저장·내보내기의 기준이 됩니다.",
      },
      {
        id: "preview",
        title: "미리보기와 플레이",
        subtitle: "Three.js WebGPU · Rapier",
        preview: "scene",
        labels: ["Preview", "Play"],
        position: upper,
        description:
          "Three.js WebGPU로 장면을 미리 봅니다. 플레이 중에는 별도 GameSession과 Rapier 물리 상태를 사용합니다.",
      },
      {
        id: "output",
        title: "저장과 내보내기",
        subtitle: "IndexedDB · OPFS · 파일",
        preview: "files",
        labels: ["프로젝트", "플레이어 ZIP", "영상"],
        position: lower,
        description:
          "문서와 스냅샷은 IndexedDB, 에셋은 OPFS에 보관합니다. 정적 플레이어 ZIP과 WebCodecs·Mediabunny 기반 영상 내보내기를 제공합니다.",
      },
    ],
    links: [
      { from: "editor", to: "document", label: "공통 명령" },
      { from: "document", to: "preview", label: "장면과 에셋" },
      { from: "document", to: "output", label: "저장·내보내기" },
    ],
  },
  "mermaid-sky": {
    summary: "텍스트는 다이어그램으로, 편집 상태는 공유 링크로 이어집니다.",
    note: "공유 링크에는 압축한 편집 상태가 담깁니다. 이미지 내보내기는 렌더링된 SVG를 사용합니다.",
    steps: [
      {
        id: "editor",
        title: "텍스트 편집",
        subtitle: "Mermaid 코드 · 테마",
        preview: "code",
        labels: ["flowchart LR", "A --> B", "B --> C"],
        position: left,
        description:
          "Mermaid 코드와 테마, 배경 등의 편집 설정을 입력합니다. 코드가 바뀌면 미리보기 렌더링을 요청합니다.",
      },
      {
        id: "render",
        title: "다이어그램 렌더링",
        subtitle: "Mermaid · SVG",
        preview: "diagram",
        labels: ["Parse", "Render"],
        position: middle,
        description:
          "Mermaid가 코드를 해석해 SVG로 렌더링합니다. 유효한 결과가 있을 때 이미지 내보내기를 사용할 수 있습니다.",
      },
      {
        id: "export",
        title: "미리보기와 이미지",
        subtitle: "SVG · PNG · JPG",
        preview: "files",
        labels: ["SVG", "PNG", "JPG"],
        position: { x: 680, y: 140 },
        description:
          "렌더링된 SVG를 미리 보고 파일로 저장합니다. PNG와 JPG는 배경·비율·배율 설정을 반영해 변환합니다.",
      },
      {
        id: "share",
        title: "편집 상태 공유",
        subtitle: "JSON · lz-string · URL",
        preview: "code",
        labels: ["code + settings", "compress", "?s=…"],
        position: { x: 0, y: 420 },
        description:
          "코드와 설정을 JSON으로 직렬화하고 lz-string으로 압축해 URL의 s 쿼리에 넣습니다. 링크를 열면 편집 상태를 복원합니다.",
      },
    ],
    links: [
      { from: "editor", to: "render", label: "코드" },
      { from: "render", to: "export", label: "SVG" },
      { from: "editor", to: "share", label: "코드와 설정", vertical: true },
    ],
  },
  vizport: {
    summary: "데이터를 분석해 차트 명세를 만들고, 화면과 코드로 내보냅니다.",
    note: "AI 추천은 선택 기능입니다. 후보의 순서와 설명을 보조하며, 규칙 기반 추천을 유지합니다.",
    steps: [
      {
        id: "input",
        title: "데이터 입력",
        subtitle: "CSV · PapaParse",
        preview: "table",
        labels: ["필드", "값", "유형"],
        position: left,
        description:
          "CSV 입력을 행 데이터로 파싱하고 필드별 특성을 분석할 수 있는 형태로 정리합니다.",
      },
      {
        id: "analysis",
        title: "분석과 차트 명세",
        subtitle: "필드 프로파일 · 규칙 · VizSpec",
        preview: "document",
        labels: ["fields", "chart type", "encoding"],
        position: middle,
        description:
          "필드 프로파일을 바탕으로 규칙이 차트 후보를 추천합니다. 사용자의 선택으로 VizSpec을 만들며, 선택적 AI는 후보 순서와 설명을 보조합니다.",
      },
      {
        id: "chart",
        title: "차트 미리보기",
        subtitle: "ECharts · Canvas",
        preview: "chart",
        labels: ["Category", "Value"],
        position: upper,
        description:
          "VizSpec을 ECharts 옵션으로 변환해 차트를 렌더링합니다. 데이터와 시각화 설정을 화면에서 확인합니다.",
      },
      {
        id: "export",
        title: "차트 코드 내보내기",
        subtitle: "React ECharts · VizSpec",
        preview: "code",
        labels: ["React component", "ECharts option", "VizSpec"],
        position: lower,
        description:
          "선택한 시각화를 React ECharts 코드와 명세로 내보냅니다. 분석·명세 로직과 외부 렌더러·내보내기 통합을 분리합니다.",
      },
    ],
    links: [
      { from: "input", to: "analysis", label: "행 데이터" },
      { from: "analysis", to: "chart", label: "VizSpec" },
      { from: "analysis", to: "export", label: "VizSpec" },
    ],
  },
  localmesh: {
    summary:
      "편집과 AI 제안을 공통 명령으로 모아 장면과 로컬 저장에 반영합니다.",
    note: "공개 데모는 로컬 저장 모드입니다. 협업 소켓에는 연결하지 않습니다.",
    steps: [
      {
        id: "input",
        title: "편집과 AI 제안",
        subtitle: "UI · 승인한 AI 명령",
        preview: "review",
        labels: ["편집 명령", "AI 제안 확인"],
        position: left,
        description:
          "직접 편집하거나 AI가 제안한 명령을 확인합니다. AI 제안은 사용자가 미리 보고 승인한 뒤 적용합니다.",
      },
      {
        id: "document",
        title: "명령과 장면 문서",
        subtitle: "SceneCommand · Y.Doc",
        preview: "document",
        labels: ["commands", "objects", "properties"],
        position: middle,
        description:
          "공통 SceneCommand로 SceneDocument를 갱신합니다. 장면 문서는 Y.Doc을 기반으로 관리합니다.",
      },
      {
        id: "scene",
        title: "3D 뷰포트",
        subtitle: "Three.js",
        preview: "scene",
        labels: ["Scene", "Viewport"],
        position: upper,
        description:
          "장면 문서의 오브젝트와 속성 변경을 Three.js 뷰포트에 반영합니다.",
      },
      {
        id: "storage",
        title: "브라우저에 저장",
        subtitle: "IndexedDB · 로컬 모드",
        preview: "files",
        labels: ["장면 문서", "로컬 저장"],
        position: lower,
        description:
          "공개 데모에서는 장면을 브라우저의 IndexedDB에 보관합니다. 별도 로컬 협업 서버를 사용하는 구성과 공개 데모의 실행 범위를 구분합니다.",
      },
    ],
    links: [
      { from: "input", to: "document", label: "공통 명령" },
      { from: "document", to: "scene", label: "장면 반영" },
      { from: "document", to: "storage", label: "문서 저장" },
    ],
  },
};
