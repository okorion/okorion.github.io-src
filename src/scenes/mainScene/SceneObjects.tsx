import { ArcaneWillow } from "../../components/three/objects/ArcaneWillow";
import { ChromeFigure } from "../../components/three/objects/ChromeFigure";
import { FallingParticle } from "../../components/three/objects/FallingParticle";
import { FloorPoints } from "../../components/three/objects/FloorPoints";

export const SceneObjects = () => (
  <>
    <ChromeFigure />
    <ArcaneWillow />
    <FloorPoints pointCount={12000} pointSize={0.016} opacity={0.32} />
    <FallingParticle
      radius={6}
      pointCount={12000}
      pointSize={0.015}
      opacity={0.08}
      startY={12}
      endY={-10}
    />
    <FallingParticle
      radius={8}
      pointCount={32000}
      pointSize={0.008}
      opacity={0.03}
      startY={0}
      endY={-2}
    />
  </>
);
