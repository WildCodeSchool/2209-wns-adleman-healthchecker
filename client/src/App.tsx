import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import History from "./views/History";
import Signup from "./views/Signup";
import Login from "./views/Login";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history/:id" element={<History />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
