import { Html } from "@react-three/drei";
import { ReactNode, useState } from "react";

interface Props {
  position?: [number, number, number];
  label: string;
  url?: string;
  icon?: ReactNode;
}

const InteractiveLabel = ({ position, label, url, icon }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  const iconSize = 40;
  const handleClick = () => {
    if (url) window.open(url, "_blank");
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Html position={position} scale={0.06} transform>
      <div
        className={`
          pointer-events-auto cursor-pointer select-none
          px-6 py-4 rounded-lg
          flex items-center gap-3
          transition-all duration-200
          text-black text-3xl font-bold 
          border border-white/30
          ${isHovered ? " bg-white/90 backdrop-brightness-125" : "bg-white/70"}
        `}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          boxShadow: isHovered ? "0 0 20px rgba(255, 255, 255, 0.3)" : "none",
        }}
      >
        {icon && typeof icon === "string" ? (
          <img src={icon} alt={label} width={iconSize} height={iconSize} />
        ) : (
          icon
        )}
        {label}
      </div>
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
