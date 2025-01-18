"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion"; // Import motion dari Framer Motion
import { useRouter } from "next/navigation";
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
  // Array untuk multiple daun
  const leaves = Array.from({ length: 5 }, (_, i) => i);

  // Animasi untuk efek angin pada gambar utama
  const plantAnimation = {
    animate: {
      rotate: [-1, 1, -1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const router = useRouter();

  const ClickPohon = () => {
    router.push('/pohon'); // Navigasi ke halaman '/mulai'
  };

 
  // Animasi untuk daun yang jatuh
  const leafAnimation = {
    initial: {
      opacity: 0,
      top: "-20px",
      left: "50%",
    },
    
    animate: (i: number) => ({
      opacity: [0, 1, 1, 0],
      top: ["0%", "120%"],
      left: ["50%", `${50 + i * 10}%`],
      rotate: [0, 360],
      transition: {
        duration: 5,
        delay: i * 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-yellow-100">
      {/* Hero Section */}
      <motion.div
        className="pt-16 pb-12 md:pt-40 md:pb-20"
        initial={{ opacity: 0, y: 50 }} // Initial position: invisible and slightly below
        animate={{ opacity: 1, y: 0 }} // Animasi saat muncul
        transition={{ duration: 1, ease: "easeOut" }} // Durasi dan easing animasi
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
            {/* Left Section - Text */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-800 mb-4 md:mb-6">
                Mari Tanam dan Rawat
                <br />
                <span className="text-green-600">
                  Pohon <span className="text-green-800">Virtual Anda!</span>
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 max-w-lg mx-auto md:mx-0">
                Setiap aksi Anda membantu bumi tumbuh lebih hijau. Bergabunglah
                dalam perjalanan menuju keberlanjutan!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="bg-green-600 text-white px-6 sm:px-8 py-3 text-sm sm:text-lg rounded-lg font-semibold hover:bg-green-700 hover:scale-105 transform transition duration-300" onClick={ClickPohon}>
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
              {/* Gambar utama dengan animasi hembusan angin */}
              <motion.div
                variants={plantAnimation}
                animate="animate"
                style={{ transformOrigin: "bottom" }}
              >
                <img
                  src="./image/Group 4 (1).png"
                  alt="Plant"
                  className="h-3/4 md:h-auto md:w-96 flex justify-center items-center relative z-10 mt-8 md:mt-0"
                />
              </motion.div>

              {/* Daun-daun yang berjatuhan */}
              {leaves.map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-6 h-4 text-green-600"
                  custom={i}
                  variants={leafAnimation}
                  initial="initial"
                  animate="animate"
                  style={{ zIndex: 5 }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L8 10L12 14L16 10L12 2Z" />
                  </svg>
                </motion.div>
              ))}
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
          <h2 className="text-3xl font-semibold text-center text-green-800 mb-6">
            Tata Cara Menanam Pohon Virtual
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Ikuti langkah-langkah berikut untuk mulai menanam pohon virtual
            Anda:
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-gray-600">
            <li className="text-lg">Daftar dan buat akun untuk memulai.</li>
            <li className="text-lg">
              Ikuti petunjuk untuk merawat pohon Anda.
            </li>
            <li className="text-lg">
              Pantau perkembangan pohon virtual Anda secara berkala.
            </li>
          </ol>
          <div className="flex justify-center mt-6">
            <button
              className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-300"
              onClick={ ClickPohon}
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
