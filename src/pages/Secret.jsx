import React from "react";
import { useNavigate } from "react-router-dom";
import DontClickButton from "../components/DontClickButton";

export default function Secret() {
  const navigate = useNavigate();

  return (
    <div className="background-default">
      <img
        src="/backgrounds/secret.webp"
        alt="Background"
        className="background-image"
      />
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 bg-blue-600 text-white font-bold text-sm px-4 py-2 border-4 border-black rounded-full shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all z-50"
      >
        ⬅ Back to Home
      </button>
      <div className="relative z-10">

        <div className="flex items-center justify-center w-full h-full px-4 mt-24">
          <div className="w-full max-w-2xl bg-black/30 p-4 rounded-lg border-2 border-white shadow-lg">
            <h1 className="text-center text-xl md:text-5xl font-bold mb-3 drop-shadow-lg">
              Uh-oh... You weren't supposed to click that.
            </h1>
            <div className="text-xl md:text-2xl max-w-full space-y-4 text-center">
              <p>
                But hey, since you're here... why not go all in and hire me as your next Frontend Developer?
              </p>
              <p>Thanks for stopping by.</p>
              <div className="text-lg md:text-xl font-semibold">Tibor Szalontai</div>
              <div className="text-sm">hired by</div>
              <div className="text-2xl font-bold">You</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}