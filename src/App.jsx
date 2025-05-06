import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FullPageWrapper from "./FullPageWrapper";
import ComingSoon from "./pages/ComingSoon";
import Secret from "./pages/Secret"; // később létrehozod

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FullPageWrapper />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/secret" element={<Secret />} />
      </Routes>
    </Router>
  );
}
