import {
  legacyExperience,
  siteContent,
} from "../../../portfolio/portfolioContent";

export interface HubLink {
  label: string;
  description: string;
  href: string;
  icon: string;
  external?: boolean;
}

export const navigationLinks: HubLink[] = [
  {
    label: "개인 프로젝트",
    description: "도구와 인터랙티브 웹 둘러보기",
    href: "/",
    icon: "/icons/home.svg",
    external: false,
  },
  {
    label: "GitHub",
    description: "공개 소스와 프로젝트 기록",
    href: siteContent.github,
    icon: "/icons/github.svg",
  },
  {
    label: "3D 제작 기록",
    description: "입자 효과와 카메라 움직임의 당시 기록",
    href: legacyExperience.article,
    icon: "/icons/velog.svg",
  },
];
