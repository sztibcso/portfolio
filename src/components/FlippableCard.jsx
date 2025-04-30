import { useState } from "react";

export default function FlippableCard({ frontImage, description, linkImage, linkUrl }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-full aspect-[2/3] cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full duration-500 transform-style-preserve-3d transition-transform ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Előlap */}
        <div className="absolute w-full h-full backface-hidden">
          <img
            src={frontImage}
            alt="Project Front"
            className="w-full h-full object-cover rounded-lg border-2 border-black"
          />
        </div>

        {/* Hátlap */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-lg border-2 border-black flex flex-col items-center justify-center p-4">
          <p className="text-center text-sm font-semibold mb-4 text-black">
            {description}
          </p>
          <a href={linkUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={linkImage}
              alt="Link Icon"
              className="w-12 h-12 object-cover"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
