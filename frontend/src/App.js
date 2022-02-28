import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { EditResumeScreen } from "./screens/EditResumeScreen";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NavBar";
import SigninScreen from "./screens/SigninScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import Dashboard from "./screens/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div dir="rtl" className="grid-container">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/dashboard/:id" element={<Dashboard />} />
          <Route path="/signin" element={<SigninScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/editdoc/:id" element={<EditResumeScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
