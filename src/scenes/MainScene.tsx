import { Canvas, useFrame } from "@react-three/fiber";
import CameraController from "../components/3d/CameraController";
import ModelLoader from "../loader/ModelLoader";
import { FilledCirclePoints } from "./FilledCirclePoints";
import { Html } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

interface Props {
  position?: [number, number, number];
  label: string;
  onHoverChange: (isHovered: boolean) => void;
}

interface LightControllerProps {
  isHovered: boolean;
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

const LightController = ({ isHovered }: LightControllerProps) => {
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    if (!lightRef.current) return;

    lightRef.current.intensity +=
      (isHovered ? 3 : 1 - lightRef.current.intensity) * 0.07;
  });

  return <directionalLight ref={lightRef} position={[5, 5, 5]} castShadow />;
};

const MainScene = () => {
  const [isHovered, setHovered] = useState(false);
  return (
    <Canvas style={{ background: "#949494" }} shadows>
      <ambientLight intensity={4} />
      <LightController isHovered={isHovered} />

      <ModelLoader
        path="/models/ChromeFigure.glb"
        position={[0, 0, 2]}
        scale={3}
      />
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
      <ModelLoader
        path="/models/ArcaneWillow.glb"
        scale={1}
        interpolate
        usePoints
      />
      <ModelLoader
        path="/models/ArcaneWillow.glb"
        scale={0.99}
        opacity={0.12}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[10, 64]} />
        <meshStandardMaterial color="#bbbbbb" />
      </mesh>
      <FilledCirclePoints radius={10} rings={100} segmentsPerRing={100} />

      <CameraController />
    </Canvas>
  );
};

export default MainScene;
