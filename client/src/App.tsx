import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import History from "./views/History";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history/:id" element={<History />} />
      </Routes>
    </div>
  );
}

export default App;
