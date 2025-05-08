import { ArcaneWillow } from "../../components/three/objects/ArcaneWillow";
import { ChromeFigure } from "../../components/three/objects/ChromeFigure";
import { FallingParticle } from "../../components/three/objects/FallingParticle";
import { FloorPoints } from "../../components/three/objects/FloorPoints";
import { GuidePoint } from "../shared/GuidePoint";
import { InteractivePoint } from "../shared/InteractivePoint";

export const SceneObjects = () => (
  <>
    <ChromeFigure />
    <ArcaneWillow />
    <FloorPoints />
    <GuidePoint />
    <InteractivePoint radius={1.0} speed={1.0} lifetime={2.0} />
    <FallingParticle
      radius={6}
      pointCount={30000}
      pointSize={0.02}
      startY={12}
      endY={-10}
    />
    <FallingParticle
      radius={8}
      pointCount={100000}
      pointSize={0.01}
      startY={0}
      endY={-2}
    />
  </>
);
