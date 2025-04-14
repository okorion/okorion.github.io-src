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
  return (
    <>
      <InteractiveLabel
        position={[0, 0.6, 2]}
        label="okorion"
        onHoverChange={setHovered}
      />
      <InteractiveLabel
        position={[-0.5, 0.3, 2]}
        label="GitHub"
        onHoverChange={setHovered}
      />
      <InteractiveLabel
        position={[0.5, 0.3, 2]}
        label="Velog"
        onHoverChange={setHovered}
      />
      <InteractiveLabel
        position={[0, 0.3, 2]}
        label="Portfolio"
        onHoverChange={setHovered}
      />
    </>
  );
};
