import { lazy, StrictMode, Suspense, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const LearningApp = lazy(() =>
  import("./LearningApp").then((module) => ({ default: module.LearningApp })),
);

function Root() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const syncRoute = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  if (route === "#/ai-learning") {
    return (
      <Suspense fallback={<div className="route-loading">正在打开学习手记…</div>}>
        <LearningApp />
      </Suspense>
    );
  }

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
