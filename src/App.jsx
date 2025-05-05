import React, { useRef, useState } from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import DontClickButton from './components/DontClickButton';


export default function App() {
  const fullpageApiRef = useRef(null);
  const [activeSection, setActiveSection] = useState(1);

  return (
    <>
      <Navbar onNavigate={(section) => fullpageApiRef.current?.moveTo(section)} 
        active={activeSection}/>

      <ReactFullpage
        licenseKey={'OPEN-SOURCE-GPLV3-LICENSE'}
        scrollingSpeed={1000}
        navigation
        onLeave={(_, destination) => {
          setActiveSection(destination.index + 1);
        }}
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
