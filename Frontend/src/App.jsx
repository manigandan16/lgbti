import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SurveyPhase1 from "../pages/Survey";
import MainPage from "../pages/mainPage";
import Login from "../pages/Login";
import "./index.css";
import "./custom.css";

export default function App() {
  const [loading, setLoading] = useState(true);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/survey" element={<SurveyPhase1 />} />
      </Routes>
    </Router>
  );
}
