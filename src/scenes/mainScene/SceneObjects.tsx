import { useThree } from "@react-three/fiber";
import { ArcaneWillow } from "../../components/three/objects/ArcaneWillow";
import { ChromeFigure } from "../../components/three/objects/ChromeFigure";
import { FallingParticle } from "../../components/three/objects/FallingParticle";
import { FloorPoints } from "../../components/three/objects/FloorPoints";

export function SceneObjects() {
  const isCompactViewport = useThree(
    (state) => state.size.width <= 720 || state.size.height <= 680,
  );
  const floorPointCount = isCompactViewport ? 6_000 : 12_000;
  const ambientPointCount = isCompactViewport ? 6_000 : 12_000;
  const floorMistPointCount = isCompactViewport ? 12_000 : 32_000;

  return (
    <>
      <ChromeFigure />
      <ArcaneWillow />
      <FloorPoints
        pointCount={floorPointCount}
        pointSize={0.016}
        opacity={0.32}
      />
      <FallingParticle
        radius={6}
        pointCount={ambientPointCount}
        pointSize={0.015}
        opacity={0.08}
        startY={12}
        endY={-10}
      />
      <FallingParticle
        radius={8}
        pointCount={floorMistPointCount}
        pointSize={0.008}
        opacity={0.03}
        startY={0}
        endY={-2}
      />
    </>
  );
}
