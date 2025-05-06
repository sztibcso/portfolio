import { useState } from "react";

export default function FlippableCard({ frontImage, description, linkImage, linkUrl }) {
  const [flipped, setFlipped] = useState(false);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      className={`w-full aspect-[2/3] perspective cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all animate-fadeInUp ${flipped && isMobile ? 'fixed inset-0 bg-black bg-opacity-80 z-50 p-4 flex items-center justify-center' : ''}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full backface-hidden bg-white/20 rounded-lg border-2 border-black flex items-center justify-center p-4">
          <img
            src={frontImage}
            alt="Project Front"
            className="w-[100%] h-[100%] object-contain"
          />
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-lg border-2 border-black flex flex-col items-center justify-center p-4">
          <p className="text-center text-sm font-semibold mb-4 text-black">
            {description}
          </p>
          <a href={linkUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={linkImage}
              alt="Link Icon"
              className="w-30 h-30 object-cover"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
