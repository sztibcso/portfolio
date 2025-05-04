import React, { useRef } from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import DontClickButton from './components/DontClickButton';

export default function App() {
  const fullpageApiRef = useRef(null);

  return (
    <>
      <Navbar onNavigate={(section) => fullpageApiRef.current?.moveTo(section)} />

      <ReactFullpage
        licenseKey={'OPEN-SOURCE-GPLV3-LICENSE'}
        scrollingSpeed={1000}
        navigation
        render={({ fullpageApi }) => {
          fullpageApiRef.current = fullpageApi;

          return (
            <ReactFullpage.Wrapper>
              <div className="section"><Home /></div>
              <div className="section"><About /></div>
              <div className="section"><Projects /></div>
              <div className="section"><Contact /></div>
            </ReactFullpage.Wrapper>
          );
        }}
      />

      <DontClickButton />
    </>
  );
}
