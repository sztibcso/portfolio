import React from "react";
import { useNavigate } from "react-router-dom";
import DontClickButton from "../components/DontClickButton";

export default function Secret() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center font-pixel text-white text-center p-8 relative"
      style={{ backgroundImage: "url('/backgrounds/undergroundDesktop.webp')" }}
    >
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 bg-blue-600 text-white font-bold text-sm px-4 py-2 border-4 border-black rounded-full shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all"
      >
        ⬅ Back to Home
      </button>

      <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
        Uh-oh... You weren't supposed to click that.
      </h1>
      <div className="text-xl md:text-2xl max-w-xl mb-10 space-y-4">
        <p>
          But hey, since you're here... why not go all in and hire me as your next Frontend Developer?
        </p>
        <p>Thanks for stopping by.</p>
        <div className="text-lg md:text-xl font-semibold">Tibor Szalontai</div>
        <div className="text-sm">hired by</div>
        <div className="text-2xl font-bold">You</div>
      </div>
    </div>
  );
}