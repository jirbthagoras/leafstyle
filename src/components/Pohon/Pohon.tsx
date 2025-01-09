"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import Leaderboard from "./LeaderboardPage";
import StreakPoint from "./StreakPoint";
import pointService from "@/services/PointService";

const Pohon = () => {
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const leaves = Array.from({ length: 5 }, (_, i) => i);
        
    // Animasi untuk efek angin pada gambar utama
    const plantAnimation = {
      animate: {
        rotate: [-1, 1, -1],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    };
  
    // Animasi untuk daun yang jatuh
    const leafAnimation = {
      initial: { 
        opacity: 0,
        top: '-20px',
        left: '50%'
      },
      animate: (i) => ({
        opacity: [0, 1, 1, 0],
        top: ['0%', '120%'],
        left: ['50%', `${50 + (i * 10)}%`],
        rotate: [0, 360],
        transition: {
          duration: 5,
          delay: i * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      })
    };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userPoints = await pointService.getUserPoints();
          const userStreak = await pointService.getUserStreak();
          setPoints(userPoints);
          setStreak(userStreak);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const getTreeImage = () => {
    if (points < 100) {
      return (
        <motion.img
          src="./image/Group 4 (1).png"
          alt=""
          className="w-80 h-80 max-w-xs lg:max-w-sm mx-auto object-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }} // Memperbaiki easing
        />
      );
    }
    if (points < 300) {
      return (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="150"
          height="150"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }} // Memperbaiki easing
        >
          <rect x="70" y="90" width="10" height="30" fill="#8B4513" />
          <circle cx="75" cy="70" r="30" fill="#228B22" />
        </motion.svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <rect x="90" y="120" width="20" height="50" fill="#8B4513" />
        <circle cx="100" cy="90" r="50" fill="#228B22" />
      </svg>
    );
  };

  const getProgress = () => {
    if (points < 100) return points;
    if (points < 300) return points - 100;
    return points - 300;
  };

  const getNextLevelPoints = () => {
    if (points < 100) return 100;
    if (points < 300) return 300;
    return 500;
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-green-200 to-yellow-50 p-6 overflow-hidden flex flex-col sm:flex-row"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-3 md:mt-20 ">
        <Leaderboard />

        {/* Pohon */}
        <motion.div
          className="relative h-fit max-w-md mx-auto rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all bg-gradient-to-t from-green-50 via-gray-50 to-green-50 md:mt-20 md:max-w-lg lg:max-w-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }} // Memperbaiki easing
        >
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-green-700 text-center my-6">
              Pohon Virtual Saya
            </h2>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-t to-transparent rounded-xl group-hover:from-green-200/50 transition-colors pointer-events-none" />
              <motion.img
                src="./image/Group 4 (1).png"
                alt="Virtual Tree"
                className="w-80 h-72 max-w-xs lg:max-w-sm mx-auto object-contain transform transition-transform group-hover:scale-110 group-hover:shadow-lg cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }} // Memperbaiki easing
              />
            </div>
            <div className="space-y-6">
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden ring-1 ring-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
                  style={{
                    width: `${
                      (getProgress() / (getNextLevelPoints() - (points < 100 ? 0 : 100))) * 100
                    }%`,
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-800">
                  {points}/{getNextLevelPoints()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-md">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span className="font-medium text-gray-800">Streak {streak}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="font-medium text-gray-800">Points {points}</span>
                </div>
              </div>
              <button
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg"
              >
                History
              </button>
            </div>
          </div>
        </motion.div>

        {/* Streak */}
        <motion.div
          className="md:mt-20 "
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeInOut" }} // Memperbaiki easing
        >
          <StreakPoint streak={streak} points={points} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Pohon;
