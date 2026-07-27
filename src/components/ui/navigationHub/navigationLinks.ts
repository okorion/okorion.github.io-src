export interface HubLink {
  label: string;
  description: string;
  href: string;
  icon: string;
}

export const navigationLinks: HubLink[] = [
  {
    label: "GitHub",
    description: "코드와 사이드 프로젝트의 모든 기록",
    href: "https://github.com/okorion",
    icon: "/icons/github.svg",
  },
  {
    label: "Portfolio",
    description: "대표 작업물과 경력을 한눈에",
    href: "https://okorion.notion.site/Portfolio-1d50242aaedf80988f93f5af21fe0304",
    icon: "/icons/notion.svg",
  },
  {
    label: "Velog",
    description: "개발 관련 정보와 회고",
    href: "https://velog.io/@okorion",
    icon: "/icons/velog.svg",
  },
  {
    label: "Jekyll Blog",
    description: "깊이 있는 개발 학습 자료",
    href: "https://okorion.github.io/tech-blog/",
    icon: "/icons/jekyll.svg",
  },
];
