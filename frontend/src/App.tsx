import MazeCreatorPage from "./maze-creator/container/MazeCreatorPage";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MazeCreatorPage />} />
        <Route path="/maze" element={<MazeCreatorPage />} />
      </Routes>
    </Router>
  );
}

export default App;