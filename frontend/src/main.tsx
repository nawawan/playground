import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import "./index.css";
import App from "./App.tsx";

Sentry.init({
  dsn: "https://54edfa7ae3ff6c3962b2089c7cf85591@o4511330126135296.ingest.us.sentry.io/4511330155364352",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
