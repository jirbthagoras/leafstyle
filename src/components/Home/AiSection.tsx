"use client";
import React from "react";
import { Camera, Recycle, MapPin } from "lucide-react";
import { motion } from "framer-motion"; // Import Framer Motion

const AISection = () => {
    const steps = [
        {
            icon: <Camera className="w-6 h-6" />,
            title: "Scan Sampah",
            description: "Arahkan kamera ke sampah yang ingin Anda daur ulang",
        },
        {
            icon: <Recycle className="w-6 h-6" />,
            title: "Identifikasi",
            description: "AI akan mengenali jenis sampah dan memberi tahu cara pengelolaannya",
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: "Lokasi",
            description: "Temukan tempat daur ulang terdekat untuk mendaur ulang sampah Anda",
        },
    ];

    return (
        <section
            className="bg-gradient-to-b from-yellow-100 to-green-400 py-16"
            id="ai-section"
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                {/* Hero Section with Framer Motion Animation */}
                <motion.div
                    className="flex flex-col md:flex-row items-center justify-between gap-12"
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }} // Trigger only once when it enters view
                >
                    <div className="md:w-1/2 space-y-6 px-4 sm:px-6">
                        <motion.h2
                            className="text-6xl sm:text-8xl font-bold text-green-600"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            viewport={{ once: true }} // Trigger only once when it enters view
                        >
                            AI Lye
                        </motion.h2>
                        <motion.p
                            className="text-lg text-gray-700 leading-relaxed"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            viewport={{ once: true }} // Trigger only once when it enters view
                        >
                            AI kami hadir untuk membantu Anda menjaga lingkungan dengan cara yang lebih cerdas.
                            Dengan teknologi canggih, AI kami dapat melakukan scanning sampah dan memberi tahu Anda
                            tempat daur ulang terdekat di sekitar Anda.
                        </motion.p>
                        <motion.button
                            className="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-full font-semibold
                             hover:bg-green-700 transition-colors duration-300 transform hover:scale-105 active:scale-95"
                            initial={{ scale: 0.9 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                            viewport={{ once: true }} // Trigger only once when it enters view
                        >
                            Mulai Scanning
                        </motion.button>
                    </div>

                    <div className="md:w-1/2 relative w-full">
                        <div
                            className="w-full h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl
                          shadow-lg overflow-hidden relative group"
                        >
                            <div
                                className="absolute inset-0 bg-black bg-opacity-40 flex items-center
                            justify-center group-hover:bg-opacity-30 transition-all duration-300"
                            >
                                <Camera
                                    className="w-24 h-24 text-white opacity-75 group-hover:opacity-100
                                transform group-hover:scale-110 transition-all duration-300"
                                />
                            </div>
                            <p className="absolute bottom-4 left-4 text-white text-lg font-medium">
                                Scan untuk Identifikasi Sampah
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Interactive Steps with Framer Motion Animation */}
                <motion.div
                    className="mt-24"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    viewport={{ once: true }} // Trigger only once when it enters view
                >
                    <h3 className="text-2xl font-bold text-center text-green-600 mb-12">
                        Cara Kerja AI Finity
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="p-6 rounded-xl transition-all duration-300 cursor-pointer
                          bg-white hover:bg-green-600 hover:scale-105 hover:shadow-lg group"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                viewport={{ once: true }} // Trigger only once when it enters view
                            >
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <motion.div
                                        className="w-16 h-16 rounded-full flex items-center justify-center
                                bg-green-100 text-green-600 group-hover:bg-white group-hover:text-green-600"
                                        whileHover={{ scale: 1.2 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {step.icon}
                                    </motion.div>
                                    <motion.h4
                                        className="text-xl font-semibold text-green-600 group-hover:text-white"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {step.title}
                                    </motion.h4>
                                    <motion.p
                                        className="text-gray-600 group-hover:text-white"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {step.description}
                                    </motion.p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AISection;
