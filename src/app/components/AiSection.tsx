"use client";
import React from "react";
import { Camera, Recycle, MapPin } from "lucide-react";

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
    <section className="bg-gradient-to-b from-yellow-100 to-green-400 py-16" id="ai-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 space-y-6 px-4 sm:px-6">
            <h2 className="text-2xl sm:text-4xl font-bold text-green-600 animate-fade-in">
              AI Kami: Solusi Cerdas untuk Lingkungan
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              AI kami hadir untuk membantu Anda menjaga lingkungan dengan cara yang lebih cerdas.
              Dengan teknologi canggih, AI kami dapat melakukan scanning sampah dan memberi tahu Anda
              tempat daur ulang terdekat di sekitar Anda.
            </p>
            <button
              className="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-full font-semibold 
                         hover:bg-green-700 transition-colors duration-300 
                         transform hover:scale-105 active:scale-95"
            >
              Mulai Scanning
            </button>
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
        </div>

        {/* Interactive Steps */}
        <div className="mt-24">
          <h3 className="text-2xl font-bold text-center text-green-600 mb-12">
            Cara Kerja AI Finity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="p-6 rounded-xl transition-all duration-300 cursor-pointer 
                          bg-white hover:bg-green-600 hover:scale-105 hover:shadow-lg group"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center
                                bg-green-100 text-green-600 group-hover:bg-white group-hover:text-green-600"
                  >
                    {step.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-green-600 group-hover:text-white">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 group-hover:text-white">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;
