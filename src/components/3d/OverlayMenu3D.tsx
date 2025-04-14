import { Html } from "@react-three/drei";
import { ReactNode } from "react";

interface Props {
  position?: [number, number, number];
  label: string;
  url?: string;
  icon?: ReactNode;
  onHoverChange: (isHovered: boolean) => void;
}

const InteractiveLabel = ({
  position,
  label,
  url,
  icon,
  onHoverChange,
}: Props) => {
  const iconSize = 40;
  const handleClick = () => {
    if (url) window.open(url, "_blank");
  };

  return (
    <Html position={position} scale={0.05} transform>
      <div
        className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity duration-200 text-white text-3xl font-bold select-none pointer-events-auto cursor-pointer"
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        onClick={handleClick}
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

interface OverlayMenu3DProps {
  setHovered: (isHovered: boolean) => void;
}

export const OverlayMenu3D = ({ setHovered }: OverlayMenu3DProps) => {
  const OverlayMenuX = 0;
  const OverlayMenuY = 0.6;
  const OverlayMenuZ = 2.1;

  return (
    <>
      <InteractiveLabel
        position={[OverlayMenuX, OverlayMenuY, OverlayMenuZ]}
        label="okorion"
        url="https://github.com/okorion"
        icon="/icons/home.svg"
        onHoverChange={setHovered}
      />
      <InteractiveLabel
        position={[OverlayMenuX - 0.5, OverlayMenuY - 0.2, OverlayMenuZ]}
        label="GitHub"
        url="https://github.com/okorion"
        icon="/icons/github.svg"
        onHoverChange={setHovered}
      />
      <InteractiveLabel
        position={[OverlayMenuX, OverlayMenuY - 0.2, OverlayMenuZ]}
        label="Velog"
        url="https://velog.io/@okorion"
        icon="/icons/velog.svg"
        onHoverChange={setHovered}
      />
      <InteractiveLabel
        position={[OverlayMenuX + 0.5, OverlayMenuY - 0.2, OverlayMenuZ]}
        label="Portfolio(Notion)"
        url="https://okorion.notion.site/Portfolio-1d50242aaedf80988f93f5af21fe0304"
        icon="/icons/notion.svg"
        onHoverChange={setHovered}
      />
    </>
  );
};
