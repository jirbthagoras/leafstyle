"use client";
import React from "react";
import { Camera, Recycle, Trash, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const AISection = () => {
      const router = useRouter();
    
      const ClickAi = () => {
        router.push('/ai'); // Navigasi ke halaman '/mulai'
      };
    const steps = [
        {
            icon: <Camera className="w-6 h-6" />,
            title: "Scan Sampah",
            description: "Arahkan kamera ke sampah yang ingin Anda daur ulang",
            color: "from-green-400 to-emerald-600",
        },
        {
            icon: <Recycle className="w-6 h-6" />,
            title: "Identifikasi",
            description: "AI akan mengenali jenis sampah dan memberi tahu cara pengelolaannya",
            color: "from-emerald-400 to-teal-600",
        },
        {
            icon: <Trash className="w-6 h-6" />,
            title: "Mengelola Sampah",
            description: "Setelah identifikasi, kelola sampah Anda dengan cara yang ramah lingkungan",
            color: "from-teal-400 to-green-600",
        },
    ];

    return (
        <section className="relative overflow-hidden py-20" id="ai-section">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-100 to-green-400">
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        backgroundImage: [
                            "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                            "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                        ],
                    }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                />
            </div>

            {/* Floating Elements */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-1 w-1 bg-white rounded-full opacity-30"
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

            <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
                {/* Hero Section */}
                <motion.div
                    className="flex flex-col md:flex-row items-center justify-between gap-12"
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="md:w-1/2 space-y-8 px-4 sm:px-6">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <motion.div
                                className="absolute -top-6 -left-6 text-4xl"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                ✨
                            </motion.div>
                            <h2 className="text-6xl sm:text-8xl font-bold">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
                                    AI Scanner
                                </span>
                            </h2>
                        </motion.div>
                        
                        <motion.p
                            className="text-lg text-gray-700 leading-relaxed"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            AI kami hadir untuk membantu Anda menjaga lingkungan dengan cara yang lebih cerdas.
                            Dengan teknologi canggih, AI kami dapat melakukan scanning sampah dan memberi tahu Anda
                            tempat daur ulang terdekat di sekitar Anda.
                        </motion.p>

                        <motion.button
                            className="group relative overflow-hidden bg-green-600 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={ClickAi}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Mulai Scanning
                                <motion.div
                                    className="inline-block"
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </motion.div>
                            </span>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600"
                                initial={{ x: "100%" }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.button>
                    </div>

                    <motion.div
                        className="md:w-1/2 relative w-full"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative w-full h-96 rounded-2xl overflow-hidden group">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src="./image/aiimage.png"
                                    alt="Scan Sampah"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 p-6 text-white"
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h3 className="text-2xl font-bold mb-2">Scan untuk Identifikasi Sampah</h3>
                                    <p className="text-sm text-gray-200">Gunakan AI untuk mendeteksi jenis sampah</p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Steps Section */}
                <motion.div
                    className="mt-32"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="text-center mb-16"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-3xl font-bold text-green-600 mb-4">
                            Cara Kerja AI Finity
                        </h3>
                        <div className="w-24 h-1 bg-green-600 mx-auto rounded-full" />
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="relative group"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <div className="relative z-10 p-8 rounded-xl bg-white/90 backdrop-blur-sm shadow-xl 
                                    hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                                    <motion.div
                                        className={`w-20 h-20 rounded-full bg-gradient-to-r ${step.color} 
                                            flex items-center justify-center mb-6 mx-auto text-white
                                            group-hover:scale-110 transition-transform duration-300`}
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        {step.icon}
                                    </motion.div>
                                    <h4 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                                        {step.title}
                                    </h4>
                                    <p className="text-gray-600 text-center">
                                        {step.description}
                                    </p>
                                </div>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 
                                        rounded-xl blur-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                                    initial={{ scale: 0.8 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AISection;