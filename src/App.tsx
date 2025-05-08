import "./App.css";
import { useErrorBoundary } from "use-error-boundary";
import Panel from "./components/ui/Panel";
import MainScene from "./scenes/mainScene/MainScene";

const App = () => {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary();

  return didCatch ? (
    <div className="w-screen h-screen">{error.message}</div>
  ) : (
    <div className="w-screen h-screen">
      <ErrorBoundary>
        <MainScene />
      </ErrorBoundary>
      <Panel />
    </div>
  );
};

export default App;
