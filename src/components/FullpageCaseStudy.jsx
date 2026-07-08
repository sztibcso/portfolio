import { useRef, useState } from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import { useNavigate } from "react-router-dom";
import HeroVideoSlide from "../components/HeroVideoSlide";
import ImageTextSlide from "../components/ImageTextSlide";
import CardsSlide from "../components/CardsSlide";
import TableSlide from "../components/TableSlide";
import ComparisonSlide from "../components/ComparisonSlide";

export default function FullpageCaseStudy({
  slides,
  projectLabel = "CASE STUDY",
  backPath = "/",
  fontClass = "font-pixel",
}) {
  const fullpageApiRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();

  return (
    <div className={`${fontClass} text-white bg-black`}>
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-3 bg-black/80 backdrop-blur-md border-b-2 border-white/20 flex items-center justify-between">
        <img
          src="/images/stLogo.png"
          alt="Tibcsó logo"
          className="h-10 hover:scale-105 transition-transform duration-300"
        />

        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => fullpageApiRef.current?.moveTo(idx + 1)}
              title={`Slide ${idx + 1}`}
              className={`rounded-full border-2 border-white transition-all duration-300 ${
                activeSlide === idx
                  ? "w-4 h-4 bg-red-500 border-red-500"
                  : "w-3 h-3 bg-transparent hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm md:text-xl font-bold tracking-[0.2em] text-white border-2 border-white px-3 py-1 rounded">
            {projectLabel}
          </span>
        </div>
      </header>

      <button
        onClick={() => navigate("/")}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white font-bold text-sm px-3 py-2 border-2 border-blue-400 rounded-full shadow-[2px_2px_0_0_rgba(255,255,255,0.2)] hover:bg-blue-500 transition-all"
      >
        ← Portfolio
      </button>

      <ReactFullpage
        licenseKey="OPEN-SOURCE-GPLV3-LICENSE"
        scrollingSpeed={1000}
        onLeave={(_, destination) => setActiveSlide(destination.index)}
        render={({ fullpageApi }) => {
          fullpageApiRef.current = fullpageApi;

          return (
            <ReactFullpage.Wrapper>
              {slides.map((slide, idx) => (
                <div key={idx} className="section">
                  <section className="relative w-screen h-screen overflow-hidden bg-black flex flex-col items-center justify-center pt-20 px-6 md:px-10">
                    <GridBackground />

                    <div className="absolute top-20 right-8 text-white/30 text-xs font-bold tracking-widest">
                      {String(idx + 1).padStart(2, "0")} /{" "}
                      {String(slides.length).padStart(2, "0")}
                    </div>

                    <SlideRenderer slide={slide} />
                  </section>
                </div>
              ))}
            </ReactFullpage.Wrapper>
          );
        }}
      />
    </div>
  );
}

function GridBackground() {
  return (
    <div
      className="absolute inset-0 opacity-5"
      style={{
        backgroundImage:
          "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
  );
}

function SlideRenderer({ slide }) {
  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center drop-shadow-lg">
        {slide.title}
      </h1>

      {slide.subtitle && (
        <p className="text-center text-white/70 text-lg md:text-xl mb-8">
          {slide.subtitle}
        </p>
      )}

      {slide.type === "heroVideo" && <HeroVideoSlide slide={slide} />}
      {slide.type === "imageText" && <ImageTextSlide slide={slide} />}
      {slide.type === "cards" && <CardsSlide slide={slide} />}
      {slide.type === "table" && <TableSlide slide={slide} />}
      {slide.type === "comparison" && <ComparisonSlide slide={slide} />}
    </div>
  );
}