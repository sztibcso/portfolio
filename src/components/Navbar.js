import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-70 text-white p-4 flex justify-center space-x-6">
      <a href="#section0" className="hover:text-gray-400">Home</a>
      <a href="#section1" className="hover:text-gray-400">About</a>
      <a href="#section2" className="hover:text-gray-400">Projects</a>
      <a href="#section3" className="hover:text-gray-400">Contact</a>
    </nav>
  );
}
