
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="border-b-2 px-6 py-4 sticky top-0 z-50 shadow-md border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          PDFAnalyzer
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          <Link href="/" className="hover:text-green-400 transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-green-400 transition">
            About
          </Link>
          <Link href="/services" className="hover:text-green-400 transition">
            Services
          </Link>
          <Link href="/contact" className="hover:text-green-400 transition">
            Contact
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden p-2 rounded-lg focus:outline-none hover:bg-gray-800 transition"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center gap-4 mt-4 pb-4 border-t border-gray-800">
          <Link href="/" className="hover:text-green-400" onClick={toggleMenu}>
            Home
          </Link>
          <Link href="/about" className="hover:text-green-400" onClick={toggleMenu}>
            About
          </Link>
          <Link href="/services" className="hover:text-green-400" onClick={toggleMenu}>
            Services
          </Link>
          <Link href="/contact" className="hover:text-green-400" onClick={toggleMenu}>
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}

