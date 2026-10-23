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
    "개인 프로젝트에서는 제품 방향과 UI·UX를 정하고, 프롬프트를 구성하며 결과를 보고 수정 의견을 전달합니다.",
  aiRole: "이 개인 프로젝트들의 코드 구현과 구조 설계는 AI가 수행합니다.",
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
          "그림자 경계가 거칠게 표시되는 현상과 선택 오브젝트 주변의 카메라 떨림을 피드백했습니다. AI가 제시한 렌더링 수정 방향과 그림자 품질 대안을 검토하고, 시각 품질과 조작 안정성을 기준으로 적용 범위를 정했습니다.",
        ],
      },
      {
        title: "AI가 맡은 일",
        paragraphs: [
          "렌더링·편집 구조 설계, 라이브러리 비교, 코드 구현과 오류 진단을 AI에 맡겼습니다. 저는 화면과 사용 흐름을 기준으로 결과를 확인하고 수정 의견을 전달했습니다.",
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
          "정기 보고서를 작성하려면 받은 거래내역을 기간과 계정 과목에 맞게 묶고, 서로 다르게 분류된 항목을 확인해야 했습니다. 여러 파일을 오가며 같은 내용을 반복해서 정리하는 일을 줄이기 위해 Windows에서 쓰는 검토 지원 도구를 만들었습니다.",
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
        title: "AI와 사람이 맡은 일",
        paragraphs: [
          "개발에는 Codex를 사용했습니다. 자료와 구현 대안 분석, 코드 작성·수정, 검사와 실행 파일 제작을 맡겼습니다. 저는 기존 업무와 사용 환경을 설명하고, 결과를 보며 작업 순서와 필요한 화면을 정했습니다.",
          "제품 실행 중 거래 집계와 기본 수치 검사는 프로그램 코드가 처리합니다. AI는 검토 대상 거래의 계정 과목 후보와 확인 질문을 남깁니다. AI 의견으로 원본 금액이나 집계 계정을 자동 변경하지 않으며, 계정 과목·금액·최종 내용은 사람이 확인하고 확정합니다.",
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
        title: "AI가 맡은 일",
        paragraphs: [
          "장면의 코드 구현과 구조 설계, 로딩 구간 분석, 모바일 오류 진단과 수정·검사를 AI가 수행했습니다. 저는 시각 결과의 수용 여부와 유지할 화면·동작을 정했습니다.",
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
        title: "AI가 맡은 일",
        paragraphs: [
          "기존 기능과 진입점을 조사하고, 대안을 비교한 뒤 편집 화면·동작을 구현하고 검사하는 일을 AI가 수행했습니다. 저는 원하는 제작 흐름과 수정 우선순위를 전달했습니다.",
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
      "Mermaid 다이어그램을 미리 보고 SVG·PNG·JPG로 내보내거나 URL로 공유하는 웹 도구입니다.",
    image: {
      src: "https://raw.githubusercontent.com/okorion/mermaid-sky-exporter/main/public/homepage.png",
      alt: "Mermaid Sky Exporter의 편집기와 다이어그램 미리보기",
      caption: "공개 저장소의 소개 화면",
    },
    flow: ["다이어그램 작성", "미리보기 확인", "이미지 내보내기·URL 공유"],
    sections: [
      {
        title: "해결하려는 문제",
        paragraphs: [
          "텍스트로 작성한 다이어그램을 바로 확인하고 다른 문서나 대화에서 쓸 수 있도록, 작성·미리보기·내보내기·공유를 한 화면에 모은 도구입니다.",
        ],
      },
      {
        title: "설계와 피드백",
        paragraphs: [
          "다이어그램 작성·미리보기·이미지 출력·URL 공유를 제공하는 도구의 제품 방향과 UI·UX를 정했습니다. 요구를 프롬프트로 구성하고 구현 결과에 수정 의견을 전달했으며, 코드 구조와 개별 기술 선택은 AI에 맡겼습니다.",
        ],
      },
      {
        title: "AI가 맡은 일",
        paragraphs: [
          "코드 구현과 구조 설계를 AI가 수행했습니다. 앱의 다이어그램 작성·내보내기는 개발 과정에서 AI를 사용한 사실과 별개의 기능입니다.",
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
      "샘플이나 파일에서 차트 추천을 고르고, 미리 본 결과를 React 코드와 시각화 설정으로 내보내는 도구입니다.",
    image: {
      src: "https://raw.githubusercontent.com/okorion/vizport-studio/main/public/og.png",
      alt: "VizPort Studio의 데이터 시각화를 설명하는 개념 이미지",
      caption: "개념 이미지 · 실제 UI 아님",
    },
    flow: ["샘플·데이터 파일 선택", "차트 추천·미리보기", "코드·설정 내보내기"],
    sections: [
      {
        title: "해결하려는 문제",
        paragraphs: [
          "데이터를 받은 뒤 어떤 차트로 볼지 고르고, 미리 본 결과를 다른 화면에서 이어 쓸 수 있도록 추천과 내보내기를 연결한 개인 실험입니다.",
        ],
      },
      {
        title: "설계와 피드백",
        paragraphs: [
          "데이터 입력·차트 추천·미리보기·코드 내보내기로 이어지는 도구의 제품 방향과 UI·UX를 담당했습니다. 프롬프트로 요구를 전달하고 구현 결과를 보며 수정 의견을 제시했으며, 데이터 분석 구조와 차트 코드의 설계·구현은 AI에 맡겼습니다.",
        ],
      },
      {
        title: "AI가 맡은 일",
        paragraphs: [
          "앱의 구조 설계와 코드 구현을 AI가 수행했습니다. 제품은 규칙 기반 차트 추천과 Canvas 미리보기를 제공하며, 실행 중 AI 보정은 선택 기능으로 안내합니다.",
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
    category: "로컬 저장 3D 실험",
    description:
      "3D 오브젝트를 편집하고, 로컬 AI의 명령을 확인해 장면에 적용하는 실험 도구입니다. 공개 데모는 로컬 저장 모드입니다.",
    image: {
      src: "https://raw.githubusercontent.com/okorion/localmesh-studio/main/public/og.png",
      alt: "LocalMesh Studio의 보라색 3D 큐브와 연결 요소를 담은 브랜드 이미지",
      caption: "공개 저장소의 브랜드 이미지 · 실제 UI 아님",
    },
    flow: ["오브젝트 편집", "AI 제안 미리보기·확인", "브라우저에 장면 저장"],
    sections: [
      {
        title: "해결하려는 문제",
        paragraphs: [
          "브라우저에서 3D 장면을 편집하며 로컬 AI가 만든 명령을 확인하고 적용하는 흐름을 실험한 프로젝트입니다. 공개 데모의 장면은 브라우저에 저장됩니다.",
        ],
      },
      {
        title: "설계와 피드백",
        paragraphs: [
          "3D 장면 편집과 로컬 AI 명령의 미리보기·적용을 다루는 도구의 제품 방향과 UI·UX를 담당했습니다. 요구를 프롬프트로 구성하고 화면과 동작에 대한 수정 의견을 전달했으며, 내부 구조 설계와 코드 구현은 AI가 수행했습니다.",
        ],
      },
      {
        title: "AI가 맡은 일",
        paragraphs: [
          "개발 과정의 코드 작성과 구조 설계를 맡았습니다. 제품 실행 중에는 로컬 AI가 편집 명령을 제안하며, 사용자가 미리 보고 적용 여부를 확인하는 흐름입니다.",
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
