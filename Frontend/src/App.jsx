import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SurveyPhase1 from "../pages/SurveyPhase1";
import SurveyPhase2 from "../pages/SurveyPhase2";
import SurveyPhase3 from "../pages/SurveyPhase3";
import MainPage from "../pages/mainPage";
import Login from "../pages/Login";
import "./index.css";
import "./custom.css";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/phase1" element={<SurveyPhase1 />} />
        <Route path="/phase2" element={<SurveyPhase2 />} />
        <Route path="/phase3" element={<SurveyPhase3 />} />
      </Routes>
    </Router>
  );
}
