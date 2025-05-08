import React from "react";
import DontClickButton from "../components/DontClickButton";
import { useNavigate } from "react-router-dom";

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div
      className="background-default font-pixel text-white"
      style={{ backgroundImage: "url('/backgrounds/sorry.webp')" }}
    >
    <button
      onClick={() => navigate("/")}
      className="absolute top-4 left-4 bg-blue-600 text-white font-bold text-sm px-4 py-2 border-4 border-black rounded-full shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all"
    >
      ⬅ Back to Home
    </button>
      <img
        src="/images/coming-soon.png"
        alt="Coming Soon"
        className="items-center w-92 h-auto"
      />
      <DontClickButton />
    </div>
  );
}
