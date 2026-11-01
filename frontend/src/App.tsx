import { lazy, Suspense } from "react";
import { RequireAuth } from "./auth/RequireAuth";

const MazeCreatorPage = lazy(() => import("./maze-creator/container/MazeCreatorPage"));
const MazePlayContainer = lazy(() => import("./maze-creator/container/page/play/Container"));
const HomePageContainer = lazy(() => import("./home/container/page/Container"));
const BlogTopContainer = lazy(() =>
  import("./blog/container/page/blogs/Container").then((m) => ({ default: m.BlogTopContainer })),
);
const BlogContainer = lazy(() => import("./blog/container/page/blog_id/Container"));
const AdminHomeContainer = lazy(() => import("./admin/container/page/Container"));
const EditBlogContainer = lazy(() => import("./admin/container/page/blogs_id_edit/Container"));
const TrajectoryPageContainer = lazy(() => import("./trajectory/container/page/Container"));
import 'highlight.js/styles/github.css'; 

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<HomePageContainer />} />
        <Route path="/blogs" >
          <Route index element={<BlogTopContainer />} />
          <Route path=":blogId" element={<BlogContainer />} />
        </Route>
        <Route path="/maze" element={<MazeCreatorPage />} />
        <Route path="/maze/play" element={<MazePlayContainer />} />
        <Route path="/trajectory" element={<TrajectoryPageContainer />} />

        <Route element={<RequireAuth />}>
          <Route path="/admin">
            <Route index element={<AdminHomeContainer />} />
            <Route path="blogs/:blogId/edit"  element={<EditBlogContainer />}/>
            <Route path="trajectory" element={<TrajectoryPageContainer canUpload />} />
          </Route>
        </Route>
      </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
