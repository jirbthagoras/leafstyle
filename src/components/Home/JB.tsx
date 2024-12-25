"use client";

import { useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion

const HeroSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const cards = [
        {
            id: 1,
            title: "Sepeda Gunung Bekas",
            description: "Sepeda gunung bekas dalam kondisi baik.",
            image: "/images/mountain-bike.jpg",
        },
        {
            id: 2,
            title: "Lukisan Abstrak",
            description: "Lukisan abstrak modern yang memukau.",
            image: "/images/abstract-painting.jpg",
        },
        {
            id: 3,
            title: "Kamera DSLR Bekas",
            description: "Kamera DSLR bekas dengan kualitas tinggi.",
            image: "/images/dslr-camera.jpg",
        },
    ];

    const handleCardClick = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <section className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-b from-green-400 to-yellow-100 p-4 md:p-6">
            <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-beetween md:gap-x-48">
                {/* Kiri: Teks Ajakan */}
                <motion.div
                    className="w-full md:w-1/2 px-2 md:px-8 mb-6 md:mb-0"
                    initial={{ x: -100, opacity: 0 }} // Initial position off screen to the left
                    animate={{ x: 0, opacity: 1 }} // Final position at the normal place
                    transition={{ duration: 1 }} // Duration for animation
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold text-green-600 mb-3 md:mb-6 text-center md:text-left">
                        Jual & Beli Barang Bekas atau Karya Seni di sini!
                    </h1>
                    <p className="text-lg md:text-xl font-normal text-green-800 mb-4 md:mb-8 text-center md:text-left">
                        Temukan barang bekas yang masih berkualitas atau jual karya seni Anda
                        kepada penggemar seni. Bergabunglah dengan kami untuk berbagi dan
                        membeli!
                    </p>
                    <div className="flex justify-center md:justify-start">
                        <button className="bg-green-500 text-white px-6 py-4 md:px-6 md:py-3 text-lg md:text-xl rounded-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105">
                            Mulai Jual & Beli
                        </button>
                    </div>
                </motion.div>

                {/* Kanan: Card yang bisa digeser */}
                <motion.div
                    className="w-full md:w-1/2 flex justify-center items-center"
                    initial={{ x: 100, opacity: 0 }} // Initial position off screen to the right
                    animate={{ x: 0, opacity: 1 }} // Final position at the normal place
                    transition={{ duration: 1 }} // Duration for animation
                >
                    {/* Mobile: Carousel */}
                    <div className="md:hidden w-full flex overflow-x-auto space-x-4 justify-center">
                        {cards.map((card) => (
                            <div
                                key={card.id}
                                onClick={() => handleCardClick(card.id - 1)}
                                className="flex-shrink-0 w-40 h-56 md:w-64 md:h-80 bg-white shadow-lg rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
                            >
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="w-full h-32 object-cover rounded-t-lg"
                                />
                                <div className="p-2">
                                    <h2 className="text-sm font-semibold text-green-600">{card.title}</h2>
                                    <p className="text-xs text-gray-700">{card.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Card bergantian */}
                    <div className="hidden md:block w-full flex justify-end items-end">
                        <div className="relative flex justify-center w-full max-w-lg h-80">
                            {cards.map((card, index) => {
                                const relativeIndex = (index - currentIndex + cards.length) % cards.length;

                                return (
                                    <div
                                        key={card.id}
                                        onClick={() => handleCardClick(index)}
                                        className={`absolute bg-white shadow-lg rounded-lg cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-xl
                      w-40 h-56 md:w-64 md:h-80`}
                                        style={{
                                            transform: `translateX(${relativeIndex * 20 - 20}%) scale(${
                                                relativeIndex === 0 ? 1.1 : 0.9
                                            })`,
                                            zIndex: relativeIndex === 0 ? 10 : 5,
                                            opacity: relativeIndex === 0 ? 1 : 0.6,
                                        }}
                                    >
                                        <img
                                            src={card.image}
                                            alt={card.title}
                                            className="w-full h-32 md:h-48 object-cover rounded-t-lg"
                                        />
                                        <div className="p-2 md:p-4">
                                            <h2 className="text-sm md:text-xl font-semibold text-green-600">{card.title}</h2>
                                            <p className="text-xs md:text-sm text-gray-700">{card.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
