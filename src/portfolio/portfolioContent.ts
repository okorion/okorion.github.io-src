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
  heading: "도구를 만들고, 사용 경험을 다듬습니다.",
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
    title: "Rust Lab",
    category: "3D 편집 도구",
    description:
      "3D 오브젝트를 편집하고 렌더링 결과를 비교해 보는 웹 실험실입니다.",
    image: {
      src: "/images/projects/rust-lab.jpg",
      alt: "Rust Lab의 3D 오브젝트와 속성 패널이 있는 편집 화면",
      caption: "현재 공개 데모 화면",
    },
    flow: ["장면 열기", "오브젝트 선택·편집", "렌더링 결과 비교"],
    sections: [
      {
        title: "해결하려는 문제",
        paragraphs: [
          "렌더링 차이를 숫자와 설명으로만 보는 대신, 장면을 바꾸며 비교할 수 있는 실험실을 만들고 싶었습니다. 초기 화면에는 정보가 많아 어떤 조작부터 해야 하는지 찾기 어려웠습니다.",
        ],
      },
      {
        title: "내가 정한 방향과 피드백",
        paragraphs: [
          "화면의 정보 배치와 스타일 시안을 비교해 선택했습니다. 오브젝트를 클릭해 고르고 이동·회전·크기를 바꾸는 흐름을 요구했으며, 속성의 숫자만 바꾸는 확인과 실제 화면 조작을 구분하도록 요청했습니다.",
          "사용 중 그림자가 거칠거나 선택한 오브젝트 주변에서 카메라가 떨리는 문제를 전달했습니다. AI가 제안한 수정 방향과 그림자 품질 선택안을 검토해 진행할 범위를 정했습니다.",
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
        title: "내가 정한 방향과 피드백",
        paragraphs: [
          "처음에는 프로그램 화면에서 거래를 하나씩 처리하는 단계가 많았습니다. 수작업이 많다고 판단해 사용자가 익숙한 엑셀을 중심으로 흐름을 바꾸도록 요청했습니다. 원본 업로드와 결과 확인에 집중하도록 사용하지 않는 입력 영역을 정리했습니다.",
          "처리 중인 작업과 결과 파일의 위치를 알기 어려운 부분을 보고, 진행 상태와 저장 파일명·위치, 거래별 확인 내용을 화면에서 찾을 수 있도록 수정 의견을 전달했습니다.",
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
        title: "내가 정한 방향과 피드백",
        paragraphs: [
          "화질과 기존 동작을 유지하는 조건으로 로딩 개선을 요청하고, AI가 제안한 작업 범위를 선택했습니다. 어색한 화면 문구는 수정안을 비교해 교정했습니다.",
          "휴대폰 홈 화면에서 실행했을 때 입자가 잠시 모였다가 흩어지는 현상을 전달했습니다. 화면을 본 환경과 증상을 설명하고 수정 방향을 선택했습니다.",
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
        title: "내가 정한 방향과 피드백",
        paragraphs: [
          "제품의 주 사용 흐름을 중심으로 화면을 점검하도록 요청하고, 정렬이 맞지 않는 부분과 요소 추가·선택의 불편을 전달했습니다.",
          "AI가 제시한 여러 개선안 중 공통 에디터에 역할별 패널을 더하는 추천안을 선택했습니다. 제안을 검토해 선택한 범위이며 세부 코드 구조는 AI가 설계했습니다.",
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
        title: "내가 정한 방향과 피드백",
        paragraphs: [
          "AI-native 개인 프로젝트로 방향과 UI·UX, 프롬프트, 결과 피드백을 담당했습니다. 코드 구조와 개별 기술 선택은 AI에 맡겼습니다.",
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
        title: "내가 정한 방향과 피드백",
        paragraphs: [
          "제품 방향과 UI·UX를 정하고 프롬프트를 구성하며 결과에 대한 수정 의견을 전달했습니다. 데이터 분석 구조와 차트 코드의 설계·구현은 AI에 맡겼습니다.",
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
        title: "내가 정한 방향과 피드백",
        paragraphs: [
          "AI-native 방식으로 제품 방향과 UI·UX, 프롬프트, 결과 피드백을 담당했습니다. 내부 구조의 설계와 코드 구현은 AI가 수행했습니다.",
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
