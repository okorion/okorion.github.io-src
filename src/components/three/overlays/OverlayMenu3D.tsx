import { Html } from "@react-three/drei";
import { ReactNode } from "react";

interface Props {
  position?: [number, number, number];
  label: string;
  url?: string;
  icon?: ReactNode;
}

const InteractiveLabel = ({ position, label, url, icon }: Props) => {
  const iconSize = 40;

  return (
    <Html position={position} scale={0.06} transform>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} (opens in a new tab)`}
        className={`
          pointer-events-auto select-none
          px-6 py-4 rounded-lg
          flex items-center gap-3
          transition-all duration-200 ease-out
          text-black text-3xl font-bold
          border border-white/30
          bg-white/72
          shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_12px_32px_rgba(0,0,0,0.18)]
          backdrop-blur-sm
          hover:bg-white/88 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_16px_36px_rgba(0,0,0,0.24)]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/70
          active:translate-y-0
        `}
      >
        {icon && typeof icon === "string" ? (
          <img
            src={icon}
            alt=""
            aria-hidden="true"
            width={iconSize}
            height={iconSize}
            className="shrink-0"
          />
        ) : (
          icon
        )}
        {label}
      </a>
    </Html>
  );
};

export const OverlayMenu3D = () => {
  const OverlayMenuX = 0.4;
  const OverlayMenuY = 0.7;
  const OverlayMenuZ = 2.0;

  return (
    <>
      {/* <InteractiveLabel
        position={[OverlayMenuX - 0.3, OverlayMenuY, OverlayMenuZ]}
        label="okorion"
        url="https://github.com/okorion"
        icon="/icons/home.svg"
      /> */}
      <InteractiveLabel
        position={[
          OverlayMenuX - 0.52,
          OverlayMenuY - 0.08,
          OverlayMenuZ - 0.7,
        ]}
        label="okorion"
        url="https://github.com/okorion"
        icon="/icons/github.svg"
      />
      <InteractiveLabel
        position={[
          OverlayMenuX - 0.43,
          OverlayMenuY - 0.25,
          OverlayMenuZ - 0.7,
        ]}
        label="(new) Tech Blog"
        url="https://okorion.github.io/tech-blog/"
        icon="/icons/jekyll.svg"
      />
      <InteractiveLabel
        position={[
          OverlayMenuX + 0.125,
          OverlayMenuY - 0.25,
          OverlayMenuZ - 0.67,
        ]}
        label="(old) Tech Blog"
        url="https://velog.io/@okorion"
        icon="/icons/velog.svg"
      />
      <InteractiveLabel
        position={[
          OverlayMenuX + 0.58,
          OverlayMenuY - 0.25,
          OverlayMenuZ - 0.64,
        ]}
        label="Portfolio"
        url="https://okorion.notion.site/Portfolio-1d50242aaedf80988f93f5af21fe0304"
        icon="/icons/notion.svg"
      />
    </>
  );
};
