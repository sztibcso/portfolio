import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-4 bg-black/70 backdrop-blur-md text-white font-pixel flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img
          src="/images/stLogo.png"
          alt="Tibcsó logo"
          className="h-12 hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="text-xl font-bold">
        tibcso.dev
      </div>
      <div className="space-x-6">
        <a href="#home" className="hover:text-red-400 transition-colors duration-300">Home</a>
        <a href="#about" className="hover:text-red-400 transition-colors duration-300">About</a>
        <a href="#projects" className="hover:text-red-400 transition-colors duration-300">Projects</a>
        <a href="#contact" className="hover:text-red-400 transition-colors duration-300">Contact</a>
      </div>
    </nav>
  );
}
