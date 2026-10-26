export interface ProjectLink {
  label: string;
  href: string;
  kind: "demo" | "source" | "article";
}

export interface ProjectSection {
  title: string;
  paragraphs: readonly string[];
}

export interface ProjectImage {
  src: string;
  alt: string;
  caption: string;
}

export interface PublicProject {
  id: string;
  title: string;
  category: string;
  description: string;
  image: ProjectImage;
  brand: ProjectImage;
  extraImages?: readonly ProjectImage[];
  flow: readonly string[];
  sections: readonly ProjectSection[];
  links: readonly ProjectLink[];
}

export const siteContent = {
  name: "okorion",
  title: "okorion · AI-native 개인 프로젝트",
  description:
    "작업을 돕는 도구와 인터랙티브 웹을 AI와 함께 만듭니다. 제품 방향과 사용 흐름을 정하고, 구현된 결과를 보며 화면과 동작을 다듬습니다.",
  eyebrow: "AI-NATIVE PERSONAL PROJECTS",
  github: "https://github.com/okorion",
  humanRole:
    "AI와 함께 개인 프로젝트를 만들며, 설계와 UI·UX의 대안을 비교해 직접 방향을 선택합니다.",
  aiRole:
    "목표와 제약을 정리하고, 구현된 화면과 동작을 확인하며 수정 방향을 정합니다.",
  aboutTitle: "소개 · 자격과 특허",
  aboutDescription:
    "AI와 함께 만드는 개인 프로젝트의 제작 방식과 자격, 공동 발명 특허를 소개합니다.",
  projectsTitle: "전체 프로젝트",
  projectsDescription:
    "편집 도구, 업무 지원과 시각 실험을 모았습니다. 각 결과물의 사용 흐름과 제작 역할을 함께 소개합니다.",
} as const;

export const featuredProjectIds = [
  "rust-lab",
  "report-review-tool",
  "aether-studio",
] as const;

export const projects: readonly PublicProject[] = [
  {
    id: "rust-lab",
    title: "Rust 3D Engine Lab",
    category: "3D 편집 스튜디오 · 렌더링 실험",
    description:
      "렌더링 비교를 위한 웹 실험실에서 출발해, 장면·재질·조명·애니메이션을 편집하고 프로젝트를 저장·내보내는 3D 웹 스튜디오로 확장했습니다.",
    image: {
      src: "/images/projects/rust-lab.jpg",
      alt: "Rust 3D Engine Lab의 3D 오브젝트와 속성 패널이 있는 편집 화면",
      caption: "현재 공개 데모 화면",
    },
    brand: {
      src: "/images/projects/brands/rust-lab.webp",
      alt: "입체 도형과 와이어프레임을 표현한 Rust 3D Engine Lab 브랜드 일러스트",
      caption: "브랜드 일러스트",
    },
    flow: ["장면 열기", "오브젝트 선택·편집", "렌더링 결과 비교"],
    sections: [
      {
        title: "해결하려는 문제",
        paragraphs: [
          "같은 장면을 Rust/wgpu와 Three.js WebGPU로 렌더링하며 결과와 성능을 비교하는 웹 실험실에서 시작했습니다. 이후 오브젝트·계층 편집, 재질·조명 설정, 타임라인·키프레임, 에셋 관리와 프로젝트 저장·내보내기를 갖춘 편집 스튜디오로 확장했습니다. 초기 화면의 높은 정보 밀도를 줄이고, 장면을 구성하고 수정하는 작업 흐름을 중심으로 발전시켰습니다.",
        ],
      },
      {
        title: "설계와 피드백",
        paragraphs: [
          "정보 구조와 편집 UI 대안을 비교하고, 뷰포트에서 오브젝트를 선택해 이동·회전·크기를 조절하는 상호작용을 요구사항으로 구체화했습니다. 속성 패널의 수치 변경과 실제 포인터 조작을 별도 검증 경로로 구분해, 화면에서 수행하는 편집 동작까지 확인하도록 요청했습니다.",
          "그림자 경계가 자글거리는 현상에는 Three.js의 PCFShadowMap과 Rust/wgpu의 선형 비교 샘플러를 적용했습니다. 주변 텍셀의 깊이 비교 결과를 보간해 경계를 부드럽게 하고, 해상도와 필터를 묶은 품질 프리셋을 추가했습니다. 품질 설정은 렌더링용 문서 복사본에 적용해 원본 조명 값과 Undo 이력을 보존했습니다.",
          "카메라 떨림은 늦게 반영된 React 상태가 최신 카메라 위치를 되돌리던 경로를 막고, 회전·이동·휠 입력을 렌더 프레임 단위로 합쳐 개선했습니다. 선택 도구의 SVG와 GPU 장면을 같은 프레임에서 갱신하고, 직교 카메라 줌 배율의 반영 시점도 맞췄습니다.",
        ],
      },
      {
        title: "기술적 판단과 AI 활용",
        paragraphs: [
          "프로젝트·에디터 UX·디자인 스킬의 기준을 프롬프트에 반영해, 기존 기능·라이브러리 비교와 편집 상태·Undo 보존, 실제 포인터 검증을 요구했습니다. 제안된 대안 중 Three.js·wgpu의 기존 그림자 기능과 해상도·필터를 묶은 품질 프리셋을 선택했습니다. AI의 구현·검사 결과를 바탕으로 오브젝트 선택 상태의 회전·줌인·줌아웃에서 남은 떨림을 피드백하며 수정 범위를 구체화했습니다.",
        ],
      },
    ],
    links: [
      {
        kind: "demo",
        label: "데모 열기",
        href: "https://rust-3d-engine-lab.vercel.app",
      },
    ],
  },
  {
    id: "report-review-tool",
    title: "정기 재무 보고서 검토 지원 도구",
    category: "업무 지원 · 실사용 보고",
    description:
      "엑셀 거래내역을 정리하고, 사람이 확인할 항목과 수정본을 제공하는 도구입니다.",
    image: {
      src: "/images/projects/report-review-tool-result.jpg",
      alt: "예시 데이터로 표시한 정기 재무 보고서 검토 지원 도구의 결과 화면",
      caption: "실제 UI · 예시 데이터",
    },
    brand: {
      src: "/images/projects/brands/report-review-tool.webp",
      alt: "거래내역 문서와 검토를 표현한 정기 재무 보고서 검토 도구 브랜드 일러스트",
      caption: "브랜드 일러스트",
    },
    extraImages: [
      {
        src: "/images/projects/report-review-tool-start.jpg",
        alt: "예시 파일명과 기간을 표시한 검토 지원 도구의 입력 화면",
        caption: "실제 UI · 예시 데이터",
      },
    ],
    flow: [
      "원본 엑셀·기간 선택",
      "집계 결과·수정본 받기",
      "사람의 검토·최종 확정",
    ],
    sections: [
      {
        title: "해결하려는 문제",
        paragraphs: [
          "정기 재무 보고서를 작성·검토하는 실무자의 반복 업무를 줄이기 위해 개발했습니다. 실제 사용자의 확인 기준으로 2주마다 약 4~5시간 걸리던 정리·검토 작업이 약 2~3시간으로 줄었습니다.",
          "Windows에서 받은 엑셀 거래내역을 기간과 계정 과목에 맞게 묶고, 서로 다르게 분류된 항목과 수정본을 확인하는 흐름을 제공합니다.",
        ],
      },
      {
        title: "설계와 피드백",
        paragraphs: [
          "거래별 수동 입력 단계가 많은 초기 흐름을 검토하고, 엑셀 파일 입력 → 처리 → 결과 검토 중심으로 입출력 흐름을 재구성하도록 요청했습니다. 원본 업로드와 수정본 확인에 집중할 수 있도록 사용하지 않는 입력 영역을 정리했습니다.",
          "처리 상태와 산출물의 위치를 추적하기 어려운 문제를 피드백했습니다. 진행 중인 작업, 저장 파일명·경로, 거래별 검토 항목을 화면에 연결하도록 요구해 사용자가 처리 과정과 결과를 확인할 수 있는 UI 기준을 구체화했습니다.",
        ],
      },
      {
        title: "기술적 판단과 AI 활용",
        paragraphs: [
          "저는 엑셀 입력부터 수정본 검토까지의 입출력 흐름을 정하고, 처리 상태·저장 경로·거래별 확인 항목을 화면에 연결하도록 요구사항을 구체화했습니다. Codex는 자료·구현 대안 분석, 코드 작성·검사와 실행 파일 제작을 수행했습니다.",
          "실행 중 거래 집계와 기본 수치 검사는 코드가 처리하고, AI는 계정 과목 후보와 확인 질문을 제안합니다. 원본 금액과 집계 계정은 AI 제안으로 자동 변경하지 않으며, 계정 과목·금액·최종 내용은 사람이 확인하고 확정합니다.",
        ],
      },
    ],
    links: [],
  },
  {
    id: "aether-studio",
    title: "Aether Studio",
    category: "가상 스튜디오 콘셉트",
    description:
      "스크롤과 포인터 움직임으로 3D 장면을 탐색하는 인터랙티브 웹입니다.",
    image: {
      src: "/images/projects/aether-studio.jpg",
      alt: "Aether Studio의 포인터와 스크롤로 탐색하는 3D 장면",
      caption: "현재 공개 데모 화면 · 가상 스튜디오 콘셉트",
    },
    brand: {
      src: "/images/projects/brands/aether-studio.webp",
      alt: "금속 O 링과 청록색 해파리·잎 입자를 표현한 Aether Studio 브랜드 일러스트",
      caption: "브랜드 일러스트",
    },
    flow: ["장면 열기", "스크롤·포인터로 탐색", "작품 소개 살펴보기"],
    sections: [
      {
        title: "해결하려는 문제",
        paragraphs: [
          "스크롤과 포인터 움직임에 반응하는 여러 3D 공간을 하나의 웹 경험으로 만들고자 했습니다. 화면의 시각적 품질이 갖춰진 뒤에는 오래 걸리는 로딩과 모바일에서 다르게 보이는 장면이 다음 과제가 됐습니다.",
        ],
      },
      {
        title: "설계와 피드백",
        paragraphs: [
          "장면의 시각 품질과 기존 인터랙션 보존을 로딩 최적화의 제약 조건으로 정하고, AI가 제안한 개선 범위와 대안을 검토했습니다. 화면 문구도 수정안을 비교해 장면 탐색 흐름에 맞게 조정했습니다.",
          "휴대폰 홈 화면 실행에서 입자가 잠시 모였다가 흩어지는 현상을 재현 환경과 함께 전달했습니다. 실행 경로와 화면에 나타난 증상을 구분해 모바일 초기 표시 문제의 진단에 필요한 조건을 제공하고, 제안된 수정 방향을 선택했습니다.",
        ],
      },
      {
        title: "기술적 판단과 AI 활용",
        paragraphs: [
          "저는 시각 품질과 기존 인터랙션을 유지하는 것을 로딩 최적화의 조건으로 정하고, AI가 제안한 대안과 적용 범위를 검토했습니다. 휴대폰 홈 화면 실행에서 나타난 입자 표시 문제는 실행 환경과 증상을 함께 전달했습니다. 장면 구조 설계·구현, 로딩 분석과 오류 진단·수정은 AI가 수행했습니다.",
        ],
      },
    ],
    links: [
      {
        kind: "demo",
        label: "경험 열기",
        href: "https://aether-studio-nu.vercel.app/",
      },
    ],
  },
  {
    id: "ember-studio",
    title: "Ember Studio",
    category: "제작 도구 실험",
    description:
      "예시에서 시작해 문구와 장면을 바꾸며 영상·게임을 구성하는 브라우저 제작 도구입니다.",
    image: {
      src: "/images/projects/ember-studio.jpg",
      alt: "Ember Studio에서 영상과 게임의 시작 예시를 고르는 화면",
      caption: "현재 공개 데모 화면",
    },
    brand: {
      src: "/images/projects/brands/ember-studio.webp",
      alt: "영상 프레임과 입체 장면을 표현한 Ember Studio 브랜드 일러스트",
      caption: "브랜드 일러스트",
    },
    flow: ["영상·게임 예시 선택", "문구·장면·요소 편집", "미리보기·결과 확인"],
    sections: [
      {
        title: "해결하려는 문제",
        paragraphs: [
          "전문 3D 도구에 익숙하지 않은 사람도 예시를 바꾸며 짧은 영상이나 게임을 구성할 수 있는 제작 흐름을 목표로 했습니다. 초기 게임 화면에서는 장면과 요소를 추가하는 경로를 찾기 어려웠습니다.",
        ],
      },
      {
        title: "설계와 피드백",
        paragraphs: [
          "영상·게임 제작의 주요 편집 흐름을 기준으로 UI 점검 범위를 정했습니다. 화면 정렬과 요소 추가·선택 경로의 문제를 전달하고, 제작에 필요한 조작을 찾고 실행할 수 있도록 편집 동선 개선을 요청했습니다.",
          "AI가 제안한 화면 구조 대안을 비교해 공통 에디터에 역할별 패널을 결합하는 구성을 선택했습니다. 공통 작업 영역과 기능별 조작 영역의 배치를 검토하고, 세부 코드 구조 설계와 구현은 AI에 맡겼습니다.",
        ],
      },
      {
        title: "기술적 판단과 AI 활용",
        paragraphs: [
          "저는 영상·게임 제작 흐름에 맞춰 요소 추가·선택과 패널 배치를 검토하고, 공통 에디터에 역할별 패널을 결합하는 대안을 선택했습니다. 조작 경로와 화면 정렬 문제를 기준으로 수정 우선순위를 정했습니다. 기존 기능 조사, 세부 코드 구조 설계와 편집 동작 구현·검사는 AI가 수행했습니다.",
        ],
      },
    ],
    links: [
      {
        kind: "demo",
        label: "데모 열기",
        href: "https://ember-studio-b3x.pages.dev",
      },
    ],
  },
  {
    id: "mermaid-sky",
    title: "Mermaid Sky Exporter",
    category: "다이어그램 작성·내보내기",
    description:
      "Velog 글의 이해를 돕는 다이어그램을 만들기 위해 제작해 실제 글 작성에 활용한 도구입니다. Mermaid 미리보기와 이미지 내보내기·URL 공유를 제공합니다.",
    image: {
      src: "https://raw.githubusercontent.com/okorion/mermaid-sky-exporter/main/public/homepage.png",
      alt: "Mermaid Sky Exporter의 편집기와 다이어그램 미리보기",
      caption: "공개 저장소의 소개 화면",
    },
    brand: {
      src: "/images/projects/brands/mermaid-sky.webp",
      alt: "연결된 다이어그램과 내보내기를 표현한 Mermaid Sky Exporter 브랜드 일러스트",
      caption: "브랜드 일러스트",
    },
    flow: ["다이어그램 작성", "미리보기 확인", "이미지 내보내기·URL 공유"],
    sections: [
      {
        title: "해결하려는 문제",
        paragraphs: [
          "Velog에 기술 글을 쓰면서 구조와 동작 흐름을 그림으로 설명할 도구가 필요했습니다. Mermaid 코드 작성·미리보기·이미지 내보내기를 한 화면에 모아, 글에 넣을 시각 자료를 만들고 수정하는 데 실제로 활용했습니다. SVG·PNG·JPG 출력과 편집 상태의 URL 공유를 지원합니다.",
        ],
      },
      {
        title: "설계와 피드백",
        paragraphs: [
          "다이어그램 작성·미리보기·이미지 출력·URL 공유를 제공하는 도구의 제품 방향과 UI·UX를 정했습니다. 요구를 프롬프트로 구성하고 구현 결과에 수정 의견을 전달했으며, 코드 구조와 개별 기술 선택은 AI에 맡겼습니다.",
        ],
      },
      {
        title: "기술적 판단과 AI 활용",
        paragraphs: [
          "저는 Velog 글에 넣을 시각 자료를 만드는 사용 흐름을 기준으로 작성·미리보기·이미지 출력·URL 공유의 요구사항과 UI·UX를 정했습니다. 실제 글 작성에 도구를 활용하며 결과에 대한 수정 의견을 전달했습니다. 코드 구조 설계와 개별 기술 선택·구현은 AI가 수행했습니다.",
        ],
      },
    ],
    links: [
      {
        kind: "demo",
        label: "도구 열기",
        href: "https://mermaid-sky-exporter.vercel.app",
      },
      {
        kind: "source",
        label: "공개 코드",
        href: "https://github.com/okorion/mermaid-sky-exporter",
      },
      {
        kind: "article",
        label: "URL 공유 방식 기록",
        href: "https://velog.io/@okorion/URL-기반-다이어그램-공유-설계-및-구현완전-클라이언트-방식",
      },
    ],
  },
  {
    id: "vizport",
    title: "VizPort Studio",
    category: "데이터 시각화 실험",
    description:
      "브라우저 로컬 LLM이 데이터 탐색과 시각화 UI를 어떻게 바꿀 수 있을지 살펴본 실험입니다. 차트 추천·미리보기·코드 내보내기에 선택적 AI 보정을 연결했습니다.",
    image: {
      src: "/images/projects/vizport-demo.webp",
      alt: "데이터 입력과 차트 추천·미리보기가 표시된 VizPort Studio의 실제 실행 화면",
      caption: "현재 공개 데모 화면 · 샘플 데이터",
    },
    brand: {
      src: "/images/projects/brands/vizport.webp",
      alt: "데이터에서 차트와 코드로 이어지는 VizPort Studio 브랜드 이미지",
      caption: "브랜드 이미지",
    },
    flow: ["샘플·데이터 파일 선택", "차트 추천·미리보기", "코드·설정 내보내기"],
    sections: [
      {
        title: "실험의 출발점과 구현",
        paragraphs: [
          "LLM을 서버 호출 없이 브라우저에서 실행하면 웹의 데이터 탐색 UI·UX를 어떻게 바꿀 수 있을지 궁금해 시작했습니다. 데이터 분석과 차트 선택·미리보기·코드 내보내기를 연결하고, 모델이 차트 후보의 순서와 추천 이유를 보조하는 흐름을 실험했습니다.",
          "기본 추천은 데이터 필드의 유형·통계에 따른 규칙으로 만들고, 미리보기는 ECharts의 Canvas 렌더러로 표시합니다. 선택적 AI 보정에는 WebLLM의 WebGPU 기반 브라우저 추론 또는 OpenAI 호환 API를 연결할 수 있습니다. 모델 응답은 스키마로 검사하며, 기존 후보 안에서 순서와 설명을 보정합니다.",
        ],
      },
      {
        title: "설계와 피드백",
        paragraphs: [
          "데이터 입력·차트 추천·미리보기·코드 내보내기로 이어지는 도구의 제품 방향과 UI·UX를 담당했습니다. 프롬프트로 요구를 전달하고 구현 결과를 보며 수정 의견을 제시했으며, 데이터 분석 구조와 차트 코드의 설계·구현은 AI에 맡겼습니다.",
        ],
      },
      {
        title: "기술적 판단과 AI 활용",
        paragraphs: [
          "저는 로컬 LLM을 데이터 시각화에 연결하는 실험 방향을 제안하고, 입력·추천·미리보기·내보내기로 이어지는 UI·UX와 수정 우선순위를 정했습니다. 구현된 화면과 동작을 보며 요구사항을 조정했습니다. 데이터 분석 구조, 모델 연동과 차트 코드의 세부 설계·구현은 AI가 수행했습니다.",
        ],
      },
    ],
    links: [
      {
        kind: "demo",
        label: "데모 열기",
        href: "https://vizport-studio.okorion.chatgpt.site",
      },
      {
        kind: "source",
        label: "공개 코드",
        href: "https://github.com/okorion/vizport-studio",
      },
    ],
  },
  {
    id: "localmesh",
    title: "LocalMesh Studio",
    category: "브라우저 로컬 AI · 3D 편집 실험",
    description:
      "WebGPU로 실행하는 로컬 LLM을 3D 편집 UI에 연결한 실험입니다. 자연어로 제안받은 편집 명령을 미리 보고 승인한 뒤 장면에 적용합니다.",
    image: {
      src: "/images/projects/localmesh-demo.webp",
      alt: "3D 장면과 오브젝트 편집 패널이 표시된 LocalMesh Studio의 실제 실행 화면",
      caption: "현재 공개 데모 화면",
    },
    brand: {
      src: "/images/projects/brands/localmesh.webp",
      alt: "보라색 3D 큐브와 연결 요소를 담은 LocalMesh Studio 브랜드 이미지",
      caption: "브랜드 이미지",
    },
    flow: ["오브젝트 편집", "AI 제안 미리보기·확인", "브라우저에 장면 저장"],
    sections: [
      {
        title: "실험의 출발점과 구현",
        paragraphs: [
          "브라우저 안에서 LLM을 실행하고 자연어 입력을 3D 편집에 연결하면, 메뉴와 속성 패널 중심의 웹 UI·UX를 어떻게 확장할 수 있을지 궁금해 시작했습니다. 직접 조작하는 편집과 AI가 제안하는 명령을 같은 장면에 적용하는 흐름을 실험했습니다.",
          "WebLLM의 Qwen3-0.6B 모델을 WebGPU와 Web Worker로 실행하고, 응답을 Zod 스키마로 검사합니다. 사용자가 미리 보고 승인한 제안은 직접 편집과 같은 SceneCommand를 거쳐 Yjs 장면 문서에 반영됩니다. 공개 데모는 IndexedDB에 장면을 저장하는 로컬 모드이며, Hocuspocus 동기화는 별도 로컬 개발 환경의 실험 범위입니다.",
        ],
      },
      {
        title: "설계와 피드백",
        paragraphs: [
          "3D 장면 편집과 로컬 AI 명령의 미리보기·적용을 다루는 도구의 제품 방향과 UI·UX를 담당했습니다. 요구를 프롬프트로 구성하고 화면과 동작에 대한 수정 의견을 전달했으며, 내부 구조 설계와 코드 구현은 AI가 수행했습니다.",
        ],
      },
      {
        title: "기술적 판단과 AI 활용",
        paragraphs: [
          "저는 브라우저 로컬 LLM과 3D 편집을 결합하는 실험 방향을 제안하고, 직접 편집·AI 제안 미리보기·적용을 잇는 사용 흐름과 UI·UX를 정했습니다. 화면과 동작을 보며 요구사항과 수정 방향을 조정했습니다. 모델 연동, 장면 문서와 공통 명령의 세부 구조 설계·코드 구현은 AI가 수행했습니다.",
        ],
      },
    ],
    links: [
      {
        kind: "demo",
        label: "데모 열기",
        href: "https://localmesh-studio.okorion.chatgpt.site",
      },
      {
        kind: "source",
        label: "공개 코드",
        href: "https://github.com/okorion/localmesh-studio",
      },
    ],
  },
];

export const credentials = [
  "AWS Certified Solutions Architect – Associate · 2025.07 · 2028.07까지 유효",
  "리눅스마스터 2급 · 2025.07",
  "정보처리기사 · 2022.11",
  "SQL 개발자(SQLD) · 2021.12",
  "빅데이터분석기사 · 2025.12",
  "데이터분석 준전문가(ADsP) · 2025.09",
  "투자자산운용사 · 한국금융투자협회 · 2026.05",
] as const;

export const patent = {
  title: "웹 환경에서 3D 컴포넌트를 생성하는 방법 및 장치",
  role: "공동 발명자",
  record: "대한민국 등록특허 제10-2666168호 · 2024.05",
  href: "https://patents.google.com/patent/KR102666168B1/ko",
} as const;

export const legacyExperience = {
  title: "3D 장면과 프로젝트를 둘러보세요.",
  description:
    "장면을 탐색하거나 개인 프로젝트와 이 장면의 제작 기록으로 이동할 수 있습니다.",
  article: "https://velog.io/@okorion/GitHub.io-페이지-제작기-2-Points-web",
} as const;

export function getProject(id: string | null | undefined) {
  return projects.find((project) => project.id === id);
}

export function projectHref(id: string) {
  return `/?project=${encodeURIComponent(id)}`;
}

export function getPageMetadata(view: string, projectId?: string | null) {
  const project = getProject(projectId);
  if (projectId) {
    return project
      ? {
          title: `${project.title} · okorion`,
          description: project.description,
          image: project.image.src,
          imageAlt: project.image.alt,
        }
      : {
          title: "프로젝트를 찾을 수 없습니다 · okorion",
          description: siteContent.description,
        };
  }
  if (view === "about")
    return {
      title: `${siteContent.aboutTitle} · okorion`,
      description: siteContent.aboutDescription,
    };
  if (view === "projects")
    return {
      title: `${siteContent.projectsTitle} · okorion`,
      description: siteContent.projectsDescription,
    };
  if (view === "3d")
    return {
      title: "3D 경험 · okorion",
      description: "포인터와 스크롤로 둘러보는 개인 사이트의 3D 장면입니다.",
    };
  return { title: siteContent.title, description: siteContent.description };
}
