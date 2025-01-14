"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import Leaderboard from "./LeaderboardPage";
import StreakPoint from "./StreakPoint";
import pointService, { PointTransaction } from "@/services/PointService";
import HistoryModal from "./HistoryModal";
import { useRouter } from "next/navigation";

const Pohon = () => {
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState<PointTransaction[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        try {
          const userPoints = await pointService.getUserPoints();
          const userStreak = await pointService.getUserStreak();
          const pointHistory = await pointService.getUserPointHistory();
          setPoints(userPoints);
          setStreak(userStreak);
          setHistory(pointHistory);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLoginClick = () => {
    router.push('/auth');
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
      {/* Guest Warning Banner */}
      {isAuthenticated === false && (
        <div className="fixed top-16 left-0 right-0 bg-yellow-50 border-b border-yellow-200 p-2 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-sm text-yellow-700">
                  Login untuk mengakses fitur lengkap dan mengumpulkan poin
                </p>
              </div>
              <button
                onClick={handleLoginClick}
                className="ml-4 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-md hover:bg-yellow-200 transition-colors duration-200"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-3 ">
        <Leaderboard />

        {/* Pohon */}
        <motion.div
          className="relative h-fit max-w-md mx-auto rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all bg-gradient-to-t from-green-50 via-gray-50 to-green-50 md:mt-20 md:max-w-lg lg:max-w-xl mb-6"
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
                onClick={() => setIsHistoryOpen(true)}
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
      <HistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
      />
    </motion.div>
  );
};

export default Pohon;
