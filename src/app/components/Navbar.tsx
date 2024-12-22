"use client";
import React, { useState } from 'react';
import { LeafyGreen } from 'lucide-react';
import { motion } from 'framer-motion'; // Import motion

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk kontrol menu hamburger

  // Fungsi untuk toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm fixed w-full z-10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-green-600 text-2xl font-bold flex items-center gap-2">
              <LeafyGreen className="w-6 h-6" />
              Go Green
            </span>
          </div>

          {/* Navbar Desktop */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-6"> {/* Increase space between links */}
              <a className="text-green-700 text-lg px-3 py-2 rounded-md font-medium hover:bg-green-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md">Beranda</a>
              <a className="text-green-700 text-lg px-3 py-2 rounded-md font-medium hover:bg-green-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md">Pohon Virtual</a>
              <a className="text-green-700 text-lg px-3 py-2 rounded-md font-medium hover:bg-green-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md">AI Finity</a>
              <a className="text-green-700 text-lg px-3 py-2 rounded-md font-medium hover:bg-green-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md">Toko</a>
              <a className="text-green-700 text-lg px-3 py-2 rounded-md font-medium hover:bg-green-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md">Komunitas</a>
              <button className="bg-green-600 text-white text-lg px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md">
                Login
              </button>
            </div>
          </div>

          {/* Navbar Mobile */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-green-600 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Hamburger - Mobile Version */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} // Mulai dari posisi atas dan transparansi 0
        animate={{
          opacity: isMenuOpen ? 1 : 0, // Ketika menu terbuka, opacity menjadi 1
          y: isMenuOpen ? 0 : -20, // Posisi menu turun
        }}
        transition={{ duration: 0.5 }} // Durasi animasi 0.5 detik
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } absolute top-16 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-b-lg md:hidden`}>
        <div className="flex flex-col items-start space-y-6 py-4 px-6">
          <a className="text-green-700 text-lg px-3 py-2 font-medium hover:text-green-800 hover:scale-105 transition-all duration-300">Beranda</a>
          <a className="text-green-700 text-lg px-3 py-2 font-medium hover:text-green-800 hover:scale-105 transition-all duration-300">Pohon Virtual</a>
          <a className="text-green-700 text-lg px-3 py-2 font-medium hover:text-green-800 hover:scale-105 transition-all duration-300">AI Finity</a>
          <a className="text-green-700 text-lg px-3 py-2 font-medium hover:text-green-800 hover:scale-105 transition-all duration-300">Komunitas</a>
          <button className="bg-green-600 text-white text-lg px-4 py-2 rounded-md font-medium hover:bg-green-700">
            Login
          </button>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
