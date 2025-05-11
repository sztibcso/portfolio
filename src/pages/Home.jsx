import React from "react";

export default function Home() {
  return (
    <div className="background-default">
      <img
        src="/backgrounds/homeDesktop.webp"
        alt="Background" 
        className="background-image"
      />
      <div className="relative z-10 mt-8">
        <div className="items-center p-8 pt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div></div>
            <div className="w-full sm:max-w-md bg-black/60 p-8 rounded-xl text-justify">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Hi!
              </h1>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                I'm Tibcsó
              </h1>
              <p className="text-lg leading-relaxed mb-6">
                Developer, UX designer based in Hungary. I have many years of experience in Development and Engineering.
                I love good designs, humorous ideas, and crazy stuffs.
              </p>
              <p className="text-lg font-bold text-red-400 animate-pulse">
                Please do not click on that button!
              </p>
              <p className="mt-4">Big Thanks! 🙌</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
