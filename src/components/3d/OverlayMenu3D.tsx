import { Html } from "@react-three/drei";

interface Props {
  position?: [number, number, number];
  label: string;
  onHoverChange: (isHovered: boolean) => void;
}

const InteractiveLabel = ({ position, label, onHoverChange }: Props) => {
  return (
    <Html position={position} scale={0.05} transform>
      <div
        className="opacity-70 hover:opacity-100 transition-opacity duration-200 text-white text-3xl font-bold select-none pointer-events-auto cursor-pointer"
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
      >
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
        onHoverChange={setHovered}
      />
      <InteractiveLabel
        position={[OverlayMenuX - 0.5, OverlayMenuY - 0.2, OverlayMenuZ]}
        label="GitHub"
        onHoverChange={setHovered}
      />
      <InteractiveLabel
        position={[OverlayMenuX, OverlayMenuY - 0.2, OverlayMenuZ]}
        label="Velog"
        onHoverChange={setHovered}
      />
      <InteractiveLabel
        position={[OverlayMenuX + 0.5, OverlayMenuY - 0.2, OverlayMenuZ]}
        label="Portfolio"
        onHoverChange={setHovered}
      />
    </>
  );
};
