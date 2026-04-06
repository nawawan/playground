import { hydrateRoot } from "react-dom/client";
import "./index.css";
import { BlogTopContainer } from "./blog/container/page/blogs/Container.tsx";

hydrateRoot(document.getElementById("root")!, <BlogTopContainer/>);
