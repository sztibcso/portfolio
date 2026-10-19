import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FullPageWrapper from "./FullPageWrapper";
import ComingSoon from "./pages/ComingSoon";
import Secret from "./pages/Secret";
import TecnomatixGuard from "./components/TecnomatixGuard";
import Tecnomatix from "./pages/Tecnomatix";
// import Erp2u from "./pages/Erp2u";

// Lazy-loaded so the PDF renderer is only downloaded on the CV pages
const CvViewer = lazy(() => import("./pages/CvViewer"));
// Lazy-loaded so Mermaid and the PGlite loader stay out of the main bundle
const SqlPlayground = lazy(() => import("./pages/SqlPlayground"));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <Routes>
          <Route path="/" element={<FullPageWrapper />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/secret" element={<Secret />} />
          <Route path="/sql-playground" element={<SqlPlayground />} />
          <Route
            path="/tecnomatix"
            element={
              <TecnomatixGuard>
                <Tecnomatix />
              </TecnomatixGuard>
            }
          />
          <Route
            path="/cv-dev"
            element={
              <CvViewer file="/files/Tibor_SZALONTAI_CV.pdf" title="CV - DEV" />
            }
          />
          <Route
            path="/cv-mech"
            element={
              <CvViewer
                file="/files/Tibor_Szalontai_CV_Engineer.pdf"
                title="CV - Mech"
              />
            }
          />
          {/* <Route path="/erp2u" element={<Erp2u />} /> */}
        </Routes>
      </Suspense>
    </Router>
  );
}
