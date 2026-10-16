import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const buttonClass =
  "text-white font-bold text-sm px-4 py-2 border-4 border-black rounded-full shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all";

const MAX_PAGE_WIDTH = 900;

export default function CvViewer({ file, title }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [width, setWidth] = useState(0);

  // Pages are rendered to canvas, so they need an explicit width to fit the screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.min(entry.contentRect.width, MAX_PAGE_WIDTH))
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const message = (text) => (
    <p className="text-white text-center py-10">{text}</p>
  );

  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col">
      <div className="flex flex-row justify-between items-center p-4 gap-4">
        <button
          onClick={() => navigate("/")}
          className={`bg-blue-600 ${buttonClass}`}
        >
          ⬅ Back to Home
        </button>
        <a href={file} download className={`bg-green-600 ${buttonClass}`}>
          ⬇ Download {title}
        </a>
      </div>

      <div ref={containerRef} className="w-full px-2 pb-8 flex justify-center">
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={message("Loading...")}
          error={message("Couldn't load the PDF - please use the download button.")}
          className="flex flex-col items-center gap-4"
        >
          {width > 0 &&
            Array.from({ length: numPages }, (_, i) => (
              <Page
                key={i}
                pageNumber={i + 1}
                width={width - 8} // leave room for the 4px border on each side
                className="shadow-[6px_6px_0_#000] border-4 border-white"
              />
            ))}
        </Document>
      </div>
    </div>
  );
}
