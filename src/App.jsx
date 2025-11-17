import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Pages/Navbar/Navbar";
import Home from "./components/Pages/Home";
import LandingPage from "./components/Pages/Landing Page/LandingPage";
import Us from "./components/Pages/About/Us";
import Featured from "./components/Pages/Projects/Featured";
import axios from "axios";
import AuthPage from "./components/Pages/Auth/Auth";
axios.defaults.baseURL = "https://dermaaid-backend.onrender.com"; // <-- Set your API base URL here
axios.defaults.headers.common["Content-Type"] = "application/json";

import MedicalRecords from "./components/Pages/Models";
import SkinDiseaseResult from "./components/Pages/ModOutput/SkinDisease";
import WoundResult from "./components/Pages/ModOutput/WoundResult";

const App = () => {
  return (
    // Add 'return' here
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/us" element={<Us />} />
        <Route path="/featured" element={<Featured />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/models" element={<MedicalRecords />} />
        <Route path="/skinresult" element={<SkinDiseaseResult />} />
        <Route path="/woundresult" element={<WoundResult />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
