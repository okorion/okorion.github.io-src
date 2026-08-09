export interface HubLink {
  label: string;
  description: string;
  href: string;
  icon: string;
  external?: boolean;
}

export const navigationLinks: HubLink[] = [
  {
    label: "Portfolio",
    description: "경력 사례와 공개 프로젝트를 한눈에",
    href: "/",
    icon: "/icons/home.svg",
    external: false,
  },
  {
    label: "GitHub",
    description: "공개 소스와 프로젝트 기록",
    href: "https://github.com/okorion",
    icon: "/icons/github.svg",
  },
  {
    label: "Career Profile",
    description: "경력과 공개 근거 요약",
    href: "https://okorion.notion.site/Developer-Portfolio-1d50242aaedf80988f93f5af21fe0304",
    icon: "/icons/notion.svg",
  },
  {
    label: "Technical Writing",
    description: "기술 아티클 해석과 구현·트러블슈팅 기록",
    href: "https://velog.io/@okorion",
    icon: "/icons/velog.svg",
  },
];
