import * as THREE from "three";
import { useRef, useState, useMemo } from "react";
import { useFrame, ThreeElements } from "@react-three/fiber";

type BoxProps = ThreeElements["points"] & {
  position: [number, number, number];
};

const Box = (props: BoxProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const points = [];

    const divisions = 4;
    for (let x = 0; x <= divisions; x++) {
      for (let y = 0; y <= divisions; y++) {
        for (let z = 0; z <= divisions; z++) {
          const dx = x / divisions - 0.5;
          const dy = y / divisions - 0.5;
          const dz = z / divisions - 0.5;
          points.push(dx, dy, dz);
        }
      }
    }

    geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += delta;
      pointsRef.current.rotation.y += 0.1 * delta;
    }
  });

  return (
    <points
      {...props}
      ref={pointsRef}
      geometry={geometry}
      scale={1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <pointsMaterial
        color={hovered ? "hotpink" : "orange"}
        size={0.05}
        sizeAttenuation={true}
      />
    </points>
  );
};

export default Box;
