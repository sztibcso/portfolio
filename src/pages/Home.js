import React from "react";

export default function Home() {
  return (
    <div
      className="min-h-screen grid grid-cols-1 md:grid-cols-2 items-center p-8 font-pixel text-white"
      style={{
        backgroundImage: "url('/images/tibcso-desktop.png')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex justify-center md:justify-end w-full">
        <div className="bg-black/60 p-8 rounded-xl max-w-md text-right">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Hi! I'm Tibcsó
          </h1>
          <p className="text-lg leading-relaxed mb-6">
            Developer, UX designer based in Hungary. I have  many years of experience in Development and Engineering.
            I love good designs, humorous ideas, and crazy stuffs.
          </p>
          <p className="text-lg font-bold text-red-400 animate-pulse">
            Please do not click on that button!
          </p>
          <p className="mt-4">Big Thanks! 🙌</p>
        </div>
      </div>
    </div>
  );
}
