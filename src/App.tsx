import "./App.css";
import { useErrorBoundary } from "use-error-boundary";
import Panel from "./components/ui/Panel";
import MainScene from "./scenes/mainScene/MainScene";

const App = () => {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary();

  return (
    <div className="w-screen h-screen">
      <ErrorBoundary>
        {didCatch ? (
          <div className="flex items-center justify-center h-full text-red-500 text-xl">
            {error.message}
          </div>
        ) : (
          <>
            <MainScene />
            <Panel />
          </>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default App;
