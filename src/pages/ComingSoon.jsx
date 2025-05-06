import React from "react";
import Navbar from "../components/Navbar";
import DontClickButton from "../components/DontClickButton";

export default function ComingSoon() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center font-pixel text-white background-default"
      style={{ backgroundImage: "url('/backgrounds/undergroundDesktop.webp')" }}
    >
      <img
        src="/images/coming-soon.png"
        alt="Coming Soon"
        className="w-64 h-auto"
      />
      <DontClickButton />
    </div>
  );
}
