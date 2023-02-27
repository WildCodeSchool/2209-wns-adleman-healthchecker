import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import History from "./views/History";
import Signup from "./views/Signup";
import Login from "./views/Login";
import Header from "./components/Header";
import MyUrl from "./views/MyUrl";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history/:id" element={<History />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myurl/" element={<ProtectedRoute outlet={<MyUrl />} />} />
      </Routes>
    </div>
  );
}

export default App;
