import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import BulletList from "../components/BulletList";
import MetricsGrid from "../components/MetricsGrid";

export default function ImageTextSlide({ slide }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setLightboxOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <figure>
        <img
          src={slide.image}
          alt={slide.title}
          onClick={() => setLightboxOpen(true)}
          className="rounded-xl border-4 border-white shadow-[8px_8px_0_0_rgba(255,255,255,0.3)] w-full max-h-[26rem] object-contain bg-white cursor-zoom-in"
        />
        {slide.caption && (
          <figcaption className="mt-3 text-sm text-white/50 text-center">
            {slide.caption}
          </figcaption>
        )}
      </figure>

      <div className="space-y-6">
        {slide.bullets?.length > 0 && <BulletList bullets={slide.bullets} />}
        {slide.metrics?.length > 0 && <MetricsGrid metrics={slide.metrics} />}
      </div>

      {lightboxOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          />
        </div>,
        document.body
      )}
    </div>
  );
}
