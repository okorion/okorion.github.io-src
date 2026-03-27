import { Html } from "@react-three/drei";
import { ReactNode } from "react";

interface OverlayAction {
  title: string;
  subtitle: string;
  href: string;
  icon: string;
}

interface ActionTileProps extends Omit<OverlayAction, "icon"> {
  icon: ReactNode;
}

const actions: OverlayAction[] = [
  {
    title: "GitHub",
    subtitle: "코드와 사이드 프로젝트의 모든 기록",
    href: "https://github.com/okorion",
    icon: "/icons/github.svg",
  },
  {
    title: "Portfolio",
    subtitle: "대표 작업물과 경력을 한눈에",
    href: "https://okorion.notion.site/Portfolio-1d50242aaedf80988f93f5af21fe0304",
    icon: "/icons/notion.svg",
  },
  {
    title: "Velog",
    subtitle: "개발 관련 정보와 회고",
    href: "https://velog.io/@okorion",
    icon: "/icons/velog.svg",
  },
  {
    title: "Jekyll Blog",
    subtitle: "깊이 있는 개발 학습 자료를 남기는 곳",
    href: "https://okorion.github.io/tech-blog/",
    icon: "/icons/jekyll.svg",
  },
];

const ActionTile = ({ title, subtitle, href, icon }: ActionTileProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${title} 새 탭에서 열기`}
    className="pointer-events-auto group flex min-h-[7rem] flex-col gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-3.5 text-white no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.08] hover:shadow-[0_18px_34px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/70"
  >
    <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-white/[0.92] shadow-[0_10px_24px_rgba(255,255,255,0.08)] ring-1 ring-white/18 transition-colors duration-200 group-hover:bg-white">
      {icon}
    </span>
    <span className="flex min-h-[3.45rem] flex-col gap-1">
      <span className="text-[1.12rem] font-semibold leading-none tracking-[-0.04em] text-white/92">
        {title}
      </span>
      <span className="max-w-[9.8rem] text-[0.77rem] font-medium leading-[1.35] tracking-[-0.01em] text-white/52">
        {subtitle}
      </span>
    </span>
  </a>
);

const OverlayIcon = ({ src }: { src: string }) => (
  <img
    src={src}
    alt=""
    aria-hidden="true"
    width="22"
    height="22"
    className="shrink-0 object-contain opacity-95 transition-transform duration-200 ease-out group-hover:scale-[1.04]"
  />
);

export const OverlayMenu3D = () => {
  return (
    <Html position={[0.9, 0.84, 1.06]} transform scale={0.11}>
      <section className="pointer-events-none w-[26rem] rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,10,12,0.82),rgba(6,6,8,0.7))] p-4 text-white shadow-[0_28px_90px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="min-w-0">
            <p className="text-[0.62rem] font-semibold tracking-[0.2em] text-white/38">
              둘러볼 경로
            </p>
            <h2 className="mt-2 text-[1.72rem] font-semibold leading-[0.96] tracking-[-0.05em] text-white/92">
              okorion
            </h2>
            <p className="mt-2 whitespace-nowrap text-[0.86rem] leading-[1.35] text-white/56">
              지금 가고 싶은 링크로 바로 이동하세요.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {actions.map((action) => (
            <ActionTile
              key={action.href}
              {...action}
              icon={<OverlayIcon src={action.icon} />}
            />
          ))}
        </div>
      </section>
    </Html>
  );
};
