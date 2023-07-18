import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import History from "./views/History";
import Signup from "./views/Signup";
import Login from "./views/Login";
import Header from "./components/Header";
import MyUrl from "./views/MyUrl";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState } from "react";

function App() {
  const [currentUser, setCurrentUser] = useState({
    profile: {
      id: 0,
      username: "",
      email: "",
      last_connection: new Date(),
    },
  });
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history/:id" element={<History />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/myurl"
          element={
            <ProtectedRoute outlet={<MyUrl currentUser={currentUser} />} />
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
