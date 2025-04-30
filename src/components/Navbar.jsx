import React from "react";
import { FaGithub, FaLinkedin, FaDev } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-4 bg-black/70 backdrop-blur-md text-white font-pixel flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img
          src="/images/stLogo.png"
          alt="Tibcsó logo"
          className="h-12 hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-10 text-lg">
        <a href="#home" className="hover:text-red-400 transition-colors duration-300">Home</a>
        <a href="#about" className="hover:text-red-400 transition-colors duration-300">About</a>
        <a href="#projects" className="hover:text-red-400 transition-colors duration-300">Projects</a>
        <a href="#contact" className="hover:text-red-400 transition-colors duration-300">Contact</a>
      </div>

      <div className="flex space-x-4 text-2xl">
        <a href="https://github.com/sztibcso" target="_blank" rel="noopener noreferrer">
          <FaGithub className="hover:text-red-400 transition-colors duration-300" />
        </a>
        <a href="https://www.linkedin.com/in/tibor-szalontai" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="hover:text-red-400 transition-colors duration-300" />
        </a>
        <a href="https://dev.to/tibcsoszalontai" target="_blank" rel="noopener noreferrer">
          <FaDev className="hover:text-red-400 transition-colors duration-300" />
        </a>
      </div>
    </nav>
  );
}
