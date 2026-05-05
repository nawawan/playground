import MazeCreatorPage from "./maze-creator/container/MazeCreatorPage";
import HomePageContainer from "./home/container/page/Container";
import { BlogTopContainer } from "./blog/container/page/blogs/Container";
import BlogContainer from "./blog/container/page/blog_id/Container";
import AdminHomeContainer from "./admin/container/page/Container";
import { RequireAuth } from "./auth/RequireAuth";
import 'highlight.js/styles/github.css'; 

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePageContainer />} />
        <Route path="/blogs" >
          <Route index element={<BlogTopContainer />} />
          <Route path=":blogId" element={<BlogContainer />} />
        </Route>
        <Route path="/maze" element={<MazeCreatorPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/admin">
            <Route index element={<AdminHomeContainer />} />
            <Route path="edit"  />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
