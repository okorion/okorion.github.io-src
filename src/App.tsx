import "./App.css";
import { useErrorBoundary } from "use-error-boundary";
import Panel from "./components/ui/Panel";
import MainScene from "./scenes/mainScene/MainScene";

const App = () => {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary();

  return didCatch ? (
    <div className="app-shell app-shell--error">
      <div className="error-card" role="alert" aria-live="polite">
        <p className="eyebrow">okorion</p>
        <h1 className="error-title">Scene failed to load.</h1>
        <p className="error-copy">{error.message}</p>
      </div>
    </div>
  ) : (
    <div className="app-shell">
      <ErrorBoundary>
        <MainScene />
      </ErrorBoundary>
      <Panel />
    </div>
  );
};

export default App;
