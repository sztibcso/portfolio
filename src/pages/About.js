import React from "react";

export default function About() {
  return (
    <div
      className="background-default items-center p-8 font-pixel text-white"
      style={{ backgroundImage: "url('/backgrounds/icyDesktop.webp')" }}
    >
      <div className="flex items-center p-8 pt-20">
        <h2 className="text-4xl font-semibold">About me</h2>
        <p className="mt-4 text-lg w-2/3 text-center">
          Coming soon.
        </p>
      </div>
    </div>
  );
}
