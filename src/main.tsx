import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const root = createRoot(document.getElementById("root")!);

if (import.meta.env.DEV) {
  root.render(<App />);
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
