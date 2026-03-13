import React, { useRef, useState } from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import { useNavigate } from "react-router-dom";
import slides from "../data/cisionSlides";

export default function Cision() {
  const fullpageApiRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="font-pixel text-white bg-black">
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

        {/* Cision logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-[0.2em] text-white border-2 border-white px-3 py-1 rounded">
            CISION
          </span>
        </div>
      </header>

      <ReactFullpage
        licenseKey={"OPEN-SOURCE-GPLV3-LICENSE"}
        scrollingSpeed={1000}
        onLeave={(_, destination) => setActiveSlide(destination.index)}
        render={({ fullpageApi }) => {
          fullpageApiRef.current = fullpageApi;

          return (
            <ReactFullpage.Wrapper>
              {slides.map((slide, idx) => (
                <div key={idx} className="section">
                  <div className="relative w-screen h-screen overflow-hidden bg-black flex flex-col items-center justify-center pt-16 px-8">
                   <div
                      className="absolute inset-0 opacity-5"
                      style={{
                        backgroundImage:
                          "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                      }}
                    />
                      {/* Counter */}
                    <div className="absolute top-20 right-8 text-white/30 text-xs font-bold tracking-widest">
                      {String(idx + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                    </div>

                    {(() => {
                      const hasImage = slide.image && slide.image.trim() !== "";
                      const hasBullets = slide.bullets && slide.bullets.length > 0;
                      const both = hasImage && hasBullets;

                      return (
                        <>
                          <h1 className="relative z-10 text-3xl md:text-5xl font-bold mb-10 text-center drop-shadow-lg">
                            {slide.title}
                          </h1>

                          {(hasImage || hasBullets) && (
                            <div
                              className={`relative z-10 w-full max-w-7xl mx-auto ${
                                both
                                  ? "grid grid-cols-1 md:grid-cols-2 gap-10"
                                  : "flex justify-center"
                              }`}
                            >
                              {hasImage && (
                                <div className={`flex items-center justify-center ${!both ? "w-full max-w-8xl mx-auto" : ""}`}>
                                  <img
                                    src={slide.image}
                                    alt={slide.title}
                                    onError={(e) => { e.target.parentElement.style.display = "none"; }}
                                    className="rounded-xl border-4 border-white shadow-[8px_8px_0_0_rgba(255,255,255,0.3)] w-full h-full object-cover"
                                    style={{ maxHeight: both ? "22rem" : "28rem" }}
                                  />
                                </div>
                              )}

                              {hasBullets && (
                                <div
                                  className={`bg-black/60 p-8 rounded-xl border-2 border-white/20 shadow-[8px_8px_0_0_rgba(255,255,255,0.1)] flex flex-col justify-center ${
                                    !both ? "w-full max-w-5xl mx-auto" : ""
                                  }`}
                                >
                                  <ul className="space-y-5">
                                    {slide.bullets.map((bullet, bIdx) => (
                                      <li key={bIdx} className="flex items-start gap-4">
                                        <span className="text-red-400 font-bold mt-1 shrink-0 text-xl">▶</span>
                                        <span className="text-lg md:text-xl leading-relaxed">{bullet}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      );
                    })()}

                    {/* Back to portfolio button — only on first slide */}
                    {idx === 0 && (
                      <button
                        onClick={() => navigate("/")}
                        className="absolute bottom-6 left-6 z-10 bg-black text-white font-bold text-xs px-3 py-2 border-2 border-white/40 rounded-full shadow-[2px_2px_0_0_rgba(255,255,255,0.2)] hover:border-white transition-all"
                      >
                        ← Portfolio
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </ReactFullpage.Wrapper>
          );
        }}
      />
    </div>
  );
}
