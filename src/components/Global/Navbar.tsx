"use client";
import React, { useState } from "react";
import {
  Home,
  Trees,
  Calendar,
  Camera,
  ShoppingCart,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import StateButton from "@/components/Home/StateButton";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { name: "Beranda", icon: Home, route: "/" },
    { name: "Pohon Virtual", icon: Trees, route: "/pohon" },
    { name: "Event", icon: Calendar, route: "/event" },
    { name: "Scan Sampah", icon: Camera, route: "/ai" },
    { name: "Toko", icon: ShoppingCart, route: "/marketplace" },
    { name: "Komunitas", icon: Users, route: "/community" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-sm fixed w-full z-20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center w-40 h-40 md:w-56 md:h-56">
            <img src="/image/Logo.png" alt="" />
          </div>

          {/* Navbar Desktop */}
          <div className="hidden md:flex space-x-6">
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                onClick={() => router.push(item.route)}
                initial={{ width: "3rem" }}
                whileHover={{ width: "10rem" }} // Pastikan tombol cukup lebar untuk teks
                className="group relative flex items-center gap-3 px-2 py-2 rounded-md bg-green-50 text-green-700 font-medium hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <item.icon className="w-6 h-6" />
                <span className="absolute left-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.name}
                </span>
              </motion.button>
            ))}
            <StateButton />
          </div>

          {/* Navbar Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-green-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Hamburger - Mobile Version */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: isMenuOpen ? 1 : 0,
          y: isMenuOpen ? 0 : -20,
        }}
        transition={{ duration: 0.5 }}
        className={`${
          isMenuOpen ? "block" : "hidden"
        } absolute top-16 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-b-lg md:hidden`}
      >
        <div className="flex flex-col items-start space-y-6 py-4 px-6">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setIsMenuOpen(false);
                router.push(item.route);
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-green-700 font-medium hover:bg-green-50 transition-all duration-300"
            >
              <item.icon className="w-6 h-6" />
              <span>{item.name}</span>
            </button>
          ))}
          <div>
            <StateButton />
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
