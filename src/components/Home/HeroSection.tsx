"use client";
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion'; // Import motion dari Framer Motion
import Navbar from '@/components/Global/Navbar';

const HomePage = () => {
    // State untuk mengontrol tampilan card tata cara dan tombol
    const [showGuide, setShowGuide] = useState(false);
    const [guideStep, setGuideStep] = useState(false);
    const guideRef = useRef<HTMLDivElement | null>(null);

    const handleLearnMoreClick = () => {
        setShowGuide(true);
        setGuideStep(true); // Menandakan guide sudah tampil
        // Delay dan scroll ke bawah
        setTimeout(() => {
            guideRef?.current?.scrollIntoView({
                behavior: "smooth", // Smooth scroll
                block: "start", // Posisi scroll di bagian atas
            });
        }, 100); // Mengurangi delay untuk scroll lebih cepat
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-400 to-yellow-100">
            {/* Hero Section */}
            <motion.div
                className="pt-16 pb-12 md:pt-24 md:pb-20"
                initial={{ opacity: 0, y: 50 }} // Initial position: invisible and slightly below
                animate={{ opacity: 1, y: 0 }} // Animasi saat muncul
                transition={{ duration: 1, ease: "easeOut" }} // Durasi dan easing animasi
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">

                        {/* Left Section - Text */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-800 mb-4 md:mb-6">
                                Mari Tanam dan Rawat<br />
                                <span className="text-green-600">Pohon <span className="text-green-800">Virtual Anda!</span></span>
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 max-w-lg mx-auto md:mx-0">
                                Setiap aksi Anda membantu bumi tumbuh lebih hijau. Bergabunglah dalam perjalanan menuju keberlanjutan!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <button className="bg-green-600 text-white px-6 sm:px-8 py-3 text-sm sm:text-lg rounded-lg font-semibold hover:bg-green-700 hover:scale-105 transform transition duration-300">
                                    Mulai Sekarang
                                </button>
                                <button
                                    className="border-2 border-green-600 text-green-600 px-6 sm:px-8 py-3 text-sm sm:text-lg rounded-lg font-semibold hover:bg-green-50 transition duration-300"
                                    onClick={handleLearnMoreClick} // Menangani klik tombol
                                >
                                    Pelajari Lebih Lanjut
                                </button>
                            </div>
                        </div>

                        {/* Right Section - Tree SVG */}
                        <div className="flex-1 relative w-full max-w-md md:max-w-lg mx-auto md:mx-0">
                            <svg className="w-full h-auto" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
                                {/* Tree Trunk */}
                                <path d="M180 500 Q200 480 220 500 L220 400 Q200 380 180 400 Z" fill="#8B4513" />
                                {/* Tree Leaves - Animated */}
                                <g className="animate-[bounce_2s_ease-in-out_infinite]">
                                    <circle cx="200" cy="300" r="100" fill="#2F855A" />
                                    <circle cx="150" cy="250" r="85" fill="#2F855A" />
                                    <circle cx="250" cy="240" r="80" fill="#2F855A" />
                                    <circle cx="200" cy="200" r="10" fill="#2F855A" />
                                </g>
                                {/* Decorative Elements */}
                                <g className="animate-[pulse_2s_ease-in-out_infinite]">
                                    <circle cx="180" cy="280" r="10" fill="#fff" fillOpacity="0.6" />
                                    <circle cx="220" cy="260" r="5" fill="#fff" fillOpacity="0.6" />
                                    <circle cx="200" cy="230" r="12" fill="#fff" fillOpacity="0.6" />
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Card Tata Cara Menanam Pohon Virtual (Conditional Rendering) */}
            {showGuide && (
                <motion.div
                    ref={guideRef}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white shadow-lg rounded-lg mt-10"
                    initial={{ opacity: 0, y: 50 }} // Initial position: invisible and slightly below
                    animate={{ opacity: guideStep ? 1 : 0, y: guideStep ? 0 : 50 }} // Animasi saat tampil
                    transition={{ duration: 0.8, ease: "easeOut" }} // Durasi dan easing animasi
                >
                    <h2 className="text-3xl font-semibold text-center text-green-800 mb-6">Tata Cara Menanam Pohon Virtual</h2>
                    <p className="text-lg text-gray-600 mb-4">
                        Ikuti langkah-langkah berikut untuk mulai menanam pohon virtual Anda:
                    </p>
                    <ol className="list-decimal pl-6 space-y-4 text-gray-600">
                        <li className="text-lg">Daftar dan buat akun untuk memulai.</li>
                        <li className="text-lg">Pilih jenis pohon yang ingin Anda tanam.</li>
                        <li className="text-lg">Ikuti petunjuk untuk merawat pohon Anda.</li>
                        <li className="text-lg">Pantau perkembangan pohon virtual Anda secara berkala.</li>
                    </ol>
                    <div className="flex justify-center mt-6">
                        <button
                            className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-300"
                            onClick={() => {
                                setShowGuide(false); // Tutup panduan
                                setGuideStep(false); // Reset efek durasi
                            }}
                        >
                            Ayo Tanam Pohon Virtual
                        </button>
                    </div>
                </motion.div>
            )}

        </div>
    );
};

export default HomePage;
