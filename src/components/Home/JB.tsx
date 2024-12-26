"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {  ArrowRight, Star } from "lucide-react";

const HeroSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const cards = [
        {
            id: 1,
            title: "Sepeda Gunung Bekas",
            description: "Sepeda gunung bekas dalam kondisi baik.",
            image: "/images/mountain-bike.jpg",
            price: "Rp 2.500.000",
            rating: 4.5
        },
        {
            id: 2,
            title: "Lukisan Abstrak",
            description: "Lukisan abstrak modern yang memukau.",
            image: "/images/abstract-painting.jpg",
            price: "Rp 1.800.000",
            rating: 4.8
        },
        {
            id: 3,
            title: "Kamera DSLR Bekas",
            description: "Kamera DSLR bekas dengan kualitas tinggi.",
            image: "/images/dslr-camera.jpg",
            price: "Rp 3.200.000",
            rating: 4.6
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = (event) => {
        const { clientX, clientY } = event;
        setMousePosition({ x: clientX, y: clientY });
    };

    return (
        <section 
            className="relative flex flex-col md:flex-row items-center justify-center min-h-screen overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-green-300 to-yellow-200">
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        background: [
                            "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                            "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                        ],
                    }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                />
            </div>

            {/* Floating Elements */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
            >
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-1 w-1 bg-white rounded-full opacity-50"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                        }}
                        animate={{
                            y: ["-100vh", "100vh"],
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </motion.div>

            <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between md:gap-x-48 relative z-10">
                {/* Left: Call to Action Text */}
                <motion.div
                    className="w-full md:w-1/2 px-2 md:px-8 mb-6 md:mb-0"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <motion.div
                        className="relative"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 md:mb-6 text-center md:text-left">
                            <span className="inline-block">
                                Jual & Beli{" "}
                                <motion.span
                                    className="inline-block"
                                    animate={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    🌟
                                </motion.span>
                            </span>
                            <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-yellow-400">
                                Barang Bekas & Karya Seni!
                            </span>
                        </h1>
                        <motion.p 
                            className="text-lg md:text-xl font-normal text-green-800 mb-4 md:mb-8 text-center md:text-left"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            Temukan barang bekas berkualitas atau jual karya seni Anda kepada penggemar seni.
                        </motion.p>
                        <motion.div 
                            className="flex justify-center md:justify-start"
                            whileHover={{ scale: 1.05 }}
                        >
                            <button 
                                className="group relative overflow-hidden bg-green-500 text-white px-8 py-4 rounded-lg font-medium text-lg"
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                            >
                                <motion.span
                                    className="absolute inset-0 bg-yellow-400"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: isHovering ? "0%" : "-100%" }}
                                    transition={{ duration: 0.3 }}
                                />
                                <span className="relative flex items-center gap-2">
                                    Mulai Jual & Beli
                                    <motion.div
                                        animate={{ x: isHovering ? 5 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.div>
                                </span>
                            </button>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Right: Interactive Cards */}
                <motion.div
                    className="w-full md:w-1/2 flex justify-center items-center"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {/* Mobile: Enhanced Carousel */}
                    <div className="md:hidden w-full flex overflow-x-auto space-x-4 py-4">
                        <AnimatePresence>
                            {cards.map((card) => (
                                <motion.div
                                    key={card.id}
                                    className="flex-shrink-0 w-40 h-64 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden"
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                >
                                    <div className="relative h-40">
                                        <img
                                            src={card.image}
                                            alt={card.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-xs flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-400" />
                                            {card.rating}
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-semibold text-green-600 mb-1">{card.title}</h3>
                                        <p className="text-xs text-gray-600 mb-2">{card.description}</p>
                                        <p className="text-sm font-bold text-green-500">{card.price}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Desktop: Enhanced Interactive Cards */}
                    <div className="hidden md:block relative w-full max-w-lg h-96">
                        <AnimatePresence>
                            {cards.map((card, index) => {
                                const isActive = index === currentIndex;
                                return (
                                    <motion.div
                                        key={card.id}
                                        className="absolute top-0 left-0 w-64 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden cursor-pointer"
                                        style={{
                                            transformOrigin: "center center",
                                        }}
                                        animate={{
                                            scale: isActive ? 1 : 0.8,
                                            x: `${(index - currentIndex) * 120}%`,
                                            rotate: isActive ? 0 : (index - currentIndex) * 5,
                                            opacity: isActive ? 1 : 0.6,
                                            zIndex: isActive ? 10 : 5,
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20,
                                        }}
                                        whileHover={{ scale: isActive ? 1.05 : 0.85 }}
                                        onClick={() => setCurrentIndex(index)}
                                    >
                                        <motion.div
                                            className="relative h-48"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <img
                                                src={card.image}
                                                alt={card.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <motion.div
                                                className="absolute top-2 right-2 bg-white/90 rounded-full px-3 py-1 text-sm flex items-center gap-1"
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <Star className="w-4 h-4 text-yellow-400" />
                                                {card.rating}
                                            </motion.div>
                                        </motion.div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-green-600 mb-2">{card.title}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{card.description}</p>
                                            <p className="text-lg font-bold text-green-500">{card.price}</p>
                                        </div>
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: isActive ? 1 : 0 }}
                                            transition={{ duration: 5, repeat: isActive ? Infinity : 0 }}
                                        />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;