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
          "거래별 수동 입력을 줄이기 위해 엑셀 입력 → 코드 집계 → 수정본 검토·재업로드로 흐름을 재구성했습니다. Python에서 XLSX의 XML을 읽고 원 단위 금액, 계정별 배분 합계, 기초 잔액+입금−출금과 기말 잔액의 일치를 검사합니다. 작업 상태와 감사 기록은 SQLite에 보관합니다.",
          "수정본은 거래 ID·원본 파일 해시·출력 버전을 대조해 읽고, 원본 값·사용자 수정·AI 의견을 구분해 보존합니다. AI에는 비식별 거래번호와 검토에 필요한 날짜·금액·허용 후보를 전달하고 구조화된 응답을 검사합니다. 화면에서는 처리 진행률, 저장 파일명·경로와 거래별 확인 항목을 연결하고, 파일 생성 완료와 보고서 검증 상태를 따로 표시합니다.",
        ],
      },
      {
        title: "기술적 판단과 AI 활용",
        paragraphs: [
          "실제 사용자의 반복 보고 업무를 바탕으로 엑셀 입력·처리·수정본 검토의 순서를 프롬프트에 정리하고, 수동 입력 영역을 줄이도록 요청했습니다. 처리 상태·저장 경로·거래별 오류와 AI 질문을 함께 확인하는 UI를 검토하며 수정 우선순위를 정했습니다. Codex는 집계·수정본 대조·AI 검토의 구현과 검사, Windows 실행 파일 제작을 수행했습니다.",
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
          "첫 스크롤에서 셰이더 컴파일과 geometry 업로드가 겹치는 구간은 초기 준비 단계로 옮겼습니다. Three.js의 compileAsync로 화면 출력·후처리 경로를 준비하고, 숨은 geometry도 2×2 렌더 타깃에 한 번 그려 첫 사용 비용을 처리합니다. 로딩 진행률은 준비 단계의 완료 이벤트에 연결하고, 첫 화면 렌더 호출이 성공하면 장면을 표시합니다.",
          "로딩을 전송·JavaScript 실행·장면 생성·GPU 준비로 나눠 계측했습니다. 같은 GLSL의 캐시 키에 들어 있던 재질별 식별자를 제거해 프로그램을 재사용하고, 포레스트 생성에서는 반복 법선 계산과 임시 배열 생성을 줄였습니다. DPR·입자 수·재질 효과를 유지하는 조건으로 비교했으며, 전체 로딩 개선 근거가 불명확한 전송 캐시 변경은 채택하지 않았습니다.",
        ],
      },
      {
        title: "기술적 판단과 AI 활용",
        paragraphs: [
          "시각 품질과 기존 인터랙션을 유지한 채 병목을 찾도록 프롬프트에 명시하고, 로딩 단계별 분석과 같은 조건의 전후 비교를 요구했습니다. AI가 수행한 계측·구현에서는 프로그램 재사용과 반복 계산 감소를 적용하고, 효과가 불명확한 캐시 변경은 제외했습니다. 저는 휴대폰 홈 화면 실행에서 입자가 모였다 흩어지는 증상과 실행 경로를 전달해 재현 조건을 구체화했습니다.",
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
          "공통 에디터에 영상·2D 게임·3D 게임의 역할별 패널을 결합하는 구성을 선택했습니다. 빠른 만들기와 상세 편집은 같은 SceneDocument·명령·Undo·Three.js 렌더러를 사용합니다. 좌측은 객체·자산 탐색, 중앙은 장면·게임 규칙 편집, 우측은 선택 속성을 맡도록 조작 경로를 정리했습니다.",
          "작업 공간을 바꿀 때 선택·카메라·클립 시점·패널 배치를 복원하도록 보기 상태를 콘텐츠 문서와 분리했습니다. 전환 시 진행 중인 조작과 재생을 정리하고, 같은 에디터·렌더러를 유지합니다. 수치 입력은 미리보기와 확정을 구분해 Enter·초점 이동으로 확정하고 Escape로 취소하며, 한 번의 수정을 하나의 Undo로 다루도록 맞췄습니다.",
        ],
      },
      {
        title: "기술적 판단과 AI 활용",
        paragraphs: [
          "Rust Lab 작업 기록과 에디터 UX·디자인 스킬을 참고해 제작 목적 선택 → 템플릿 수정 → 미리보기 → 저장·출력 → 재방문을 검수 경로로 프롬프트에 정리했습니다. 공통 에디터에 역할별 패널을 결합하는 안을 선택하고, 전환 중 선택·Undo·저장 상태 보존을 기준으로 삼았습니다. AI의 구현·검사 결과에서 요소 추가·선택 경로와 화면 정렬 문제를 피드백해 수정 우선순위를 정했습니다.",
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
          "Mermaid가 만든 SVG를 미리보기와 내보내기의 공통 결과로 사용합니다. SVG는 벡터로 저장하고, PNG·JPG는 배경·배율·화면비를 적용해 Canvas로 변환합니다. 출력 전 폰트를 기다리고 SVG의 HTML 라벨을 텍스트로 바꿔, 이미지에서 글자가 빠지는 문제를 다룹니다.",
          "공유할 때는 코드·테마·배경·출력 설정을 JSON으로 묶어 lz-string으로 압축한 뒤 URL 쿼리에 넣습니다. 링크를 열면 이를 풀어 편집 상태를 복원하므로 별도 저장 API 없이 작성 중인 다이어그램을 다시 열 수 있습니다. 모바일 공유는 브라우저의 네이티브 공유를 사용하고, 지원되지 않으면 링크 복사로 이어집니다.",
        ],
      },
      {
        title: "기술적 판단과 AI 활용",
        paragraphs: [
          "Velog 글의 구조와 동작 흐름을 설명할 그림이 필요해, 작성·미리보기·이미지 출력을 한 화면에서 끝내고 편집 상태를 링크로 다시 여는 요구를 프롬프트로 구성했습니다. 출력 형식·화면비·배경과 공유 후 복원할 설정을 UI·UX에 담고, 실제 글 작성에 사용하며 결과에 수정 의견을 전달했습니다. AI는 SVG 출력·이미지 변환·URL 압축과 복원의 세부 구현을 맡았습니다.",
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
          "입력이 바뀌면 재분석 전까지 이전 추천·미리보기·저장·내보내기를 잠가, 현재 데이터와 이전 결과가 섞이지 않도록 했습니다. 분석과 AI 보정은 시작 시 데이터 버전을 기록하고 최신 요청과 일치할 때만 결과를 반영합니다. 같은 VizSpec을 차트 미리보기와 React 코드·설정 내보내기에 사용합니다.",
          "AI에는 원본 행 대신 필드 유형·통계와 기존 차트 후보 요약을 전달합니다. 응답을 Zod 스키마로 검사하고 기존 후보에 있는 차트만 순서·설명에 반영해, 규칙 기반 추천을 유지하면서 모델의 보조 효과를 살펴봤습니다. WebGPU는 WebLLM 추론에 사용하며 차트 표시는 ECharts Canvas가 담당합니다.",
        ],
      },
      {
        title: "기술적 판단과 AI 활용",
        paragraphs: [
          "로컬 LLM이 웹의 데이터 탐색 방식을 어떻게 바꿀 수 있을지를 프롬프트의 실험 목표로 두고, 입력 → 추천 이유 확인 → 실제 차트 미리보기 → 코드·설정 내보내기의 흐름을 정했습니다. AI가 규칙 기반 추천과 선택적 모델 보정을 구현하고, 저는 추천 이유·미리보기·내보내기 결과를 확인하며 요구사항과 수정 우선순위를 조정했습니다.",
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
          "로컬 모델은 첫 요청에 지연 로드하고 Web Worker에서 실행합니다. 모델이 만든 편집 제안은 스키마 검사와 사용자 승인을 거쳐 직접 편집과 같은 명령 경로로 전달합니다. 기즈모 드래그도 하나의 명령·Undo로 기록해, 직접 조작과 AI 제안이 별도 장면 상태를 만들지 않도록 했습니다.",
          "저장할 객체 데이터는 Yjs 문서가, 선택·패널 상태는 React가, 화면에 그릴 표현은 Three.js가 맡습니다. 위치·회전·크기는 변경한 축만 Yjs 키에 기록해 다른 축의 동시 편집을 보존합니다. IndexedDB 복구와 WebSocket 동기화도 같은 문서를 사용하며, 공개 데모와 로컬 협업 실험의 실행 범위를 구분했습니다.",
        ],
      },
      {
        title: "기술적 판단과 AI 활용",
        paragraphs: [
          "브라우저 로컬 LLM을 3D 편집 UI에 연결하는 실험 방향을 제안하고, 직접 조작·자연어 입력·명령 미리보기·승인·장면 반영의 순서를 프롬프트로 구체화했습니다. AI는 모델 출력을 검증된 편집 명령으로 연결하는 구조를 구현하고, 저는 화면에서 변경 내용을 이해하고 적용할 수 있는지를 기준으로 미리보기·승인 단계와 직접 조작의 연결을 검토했습니다.",
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
