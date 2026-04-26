import { hydrateRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import { BlogTopContainer } from "./blog/container/page/Container.tsx";

hydrateRoot(
    document.getElementById("root")!, 
    <Router>
        <BlogTopContainer/>
    </Router>
);
