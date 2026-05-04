import { hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

hydrateRoot(
    document.getElementById("root")!, 
    <App />
);
