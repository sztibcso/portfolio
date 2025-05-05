import React, { useState, useEffect } from "react";
import { FaGithub, FaLinkedin, FaDev, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar({ onNavigate, active }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (section) => {
    setMenuOpen(false);
    onNavigate(section);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-4 bg-black/70 backdrop-blur-md text-white font-pixel flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <img
          src="/images/stLogo.png"
          alt="Tibcsó logo"
          className="h-12 hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Desktop nav */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-10 text-lg">
        {["Home", "About", "Projects", "Contact"].map((label, idx) => (
          <button
            key={label}
            onClick={() => handleNavigate(idx + 1)}
            className={`transition-colors duration-300 hover:text-red-400 ${active === idx + 1 ? "text-red-400" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Social links */}
      <div className="hidden md:flex space-x-4 text-2xl">
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

      {/* Mobile menu toggle */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black/90 backdrop-blur-md flex flex-col items-center space-y-6 py-6 text-lg md:hidden">
          {["Home", "About", "Projects", "Contact"].map((label, idx) => (
            <button
              key={label}
              onClick={() => handleNavigate(idx + 1)}
              className={`transition-colors duration-300 hover:text-red-400 ${active === idx + 1 ? "text-red-400" : ""}`}
            >
              {label}
            </button>
          ))}
          <div className="flex space-x-4 text-2xl pt-4">
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
        </div>
      )}
    </nav>
  );
}
