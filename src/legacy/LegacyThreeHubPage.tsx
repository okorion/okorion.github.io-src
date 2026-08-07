import { lazy, Suspense } from "react";
import { useErrorBoundary } from "use-error-boundary";
import Panel from "../components/ui/Panel";
import { SceneLoadingState } from "../components/ui/SceneLoadingState";
import { WebGLFallback } from "./WebGLFallback";
import "./legacyThreeHub.css";

const MainScene = lazy(() => import("../scenes/mainScene/MainScene"));

function SceneExperience() {
  const { ErrorBoundary, didCatch } = useErrorBoundary();

  if (didCatch) {
    return <WebGLFallback />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<SceneLoadingState />}>
        <MainScene />
      </Suspense>
    </ErrorBoundary>
  );
}

export default function LegacyThreeHubPage() {
  return (
    <main className="legacy-hub">
      <SceneExperience />
      <a className="legacy-hub__return" href="/">
        <span aria-hidden="true">←</span>
        Portfolio
      </a>
      <Panel />
    </main>
  );
}
