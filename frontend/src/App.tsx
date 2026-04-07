import MazeCreatorPage from "./maze-creator/container/MazeCreatorPage";
import HomePageContainer from "./home/container/page/Container";
import { BlogTopContainer } from "./blog/container/page/blogs/Container";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePageContainer />} />
        <Route path="/blogs" element={<BlogTopContainer />} />
        <Route path="/maze" element={<MazeCreatorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
