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
  <div className="fixed top-16 left-0 right-0 bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-100 border-b border-yellow-200 shadow-md p-3 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 animate-bounce">
            <svg
              className="h-6 w-6 text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
          </div>
          <p className="ml-4 text-sm font-medium text-yellow-800">
            Login untuk mengakses fitur lengkap dan mengumpulkan poin!
          </p>
        </div>
        <button
          onClick={handleLoginClick}
          className="ml-4 px-4 py-2 bg-gradient-to-r from-yellow-300 to-yellow-400 text-yellow-900 text-sm font-semibold rounded-lg shadow-md hover:from-yellow-400 hover:to-yellow-500 hover:shadow-lg transition-all duration-500"
        >
          Login
        </button>
      </div>
    </div>
  </div>
)}


      <div className="max-w-8xl grid grid-cols-1 lg:grid-cols-3 md:mt-16 ">
        <Leaderboard />
        {/* Pohon */}
        <motion.div
          className="relative h-fit rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all bg-gradient-to-t from-green-50 via-gray-50 to-green-50 md:mt-20 md:max-w-lg lg:max-w-xl mb-6"
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
                className="w-72 h-64 md:w-80 md:h-72 max-w-xs lg:max-w-sm mx-auto object-contain transform transition-transform group-hover:scale-110 group-hover:shadow-lg cursor-pointer"
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
