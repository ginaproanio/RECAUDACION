
  import { createRoot } from "react-dom/client";
  import { BrowserRouter } from "react-router-dom";
  import ErrorBoundary from "./components/ErrorBoundary";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  );
  