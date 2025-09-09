'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="px-6 py-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          MyBrand
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
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

          {/* Clerk Auth */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-green-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-400 transition">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
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
          <Link
            href="/about"
            className="hover:text-green-400"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            href="/services"
            className="hover:text-green-400"
            onClick={toggleMenu}
          >
            Services
          </Link>
          <Link
            href="/contact"
            className="hover:text-green-400"
            onClick={toggleMenu}
          >
            Contact
          </Link>

          {/* Mobile Auth */}
          <SignedOut>
            <SignInButton mode="modal">
              <button
                className="bg-green-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-400 transition"
                onClick={toggleMenu}
              >
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      )}
    </nav>
  );
}
