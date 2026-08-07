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
    label: "Tech Blog",
    description: "개발 학습과 문제 해결 기록",
    href: "https://okorion.github.io/tech-blog/",
    icon: "/icons/jekyll.svg",
  },
];
