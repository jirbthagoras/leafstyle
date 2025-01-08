"use client";
import React, { useState } from "react";
import Leaderboard from "./LeaderboardPage";
import StreakPoint from "./StreakPoint";

const Pohon = () => {
  const [streak, setStreak] = useState(15);
  const [points, setPoints] = useState(200);

  const getTreeImage = () => {
    if (points < 100) return "./image/small.png";
    if (points < 300) return "./image/medium.png";
    return "./image/big.png";
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-gray-50 to-green-50 p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">      
          <Leaderboard />
        <div className="relative rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-green-700 text-center">
              Pohon Virtual Saya
            </h2>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-green-100/50 to-transparent rounded-xl group-hover:from-green-200/50 transition-colors" />
              
              {/* Gambar Pohon */}
              <img
                src={getTreeImage()}
                alt="Virtual Tree"
                className="w-80 h-80 mx-auto object-contain transform transition-transform group-hover:scale-110 group-hover:shadow-lg cursor-pointer"
                onClick={() => setPoints(points + 50)} // Klik untuk menambah poin
              />

              {/* Partikel Animasi Daun */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-green-400 rounded-full animate-bounce"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${10 + Math.random() * 70}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>

            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
                  style={{
                    width: `${(getProgress() / (getNextLevelPoints() - (points < 100 ? 0 : 100))) * 100}%`,
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  {points}/{getNextLevelPoints()}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span className="font-medium">Streak {streak}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="font-medium">Points {points}</span>
                </div>
              </div>

              <button
                onClick={() => setPoints(points + 50)}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Tambah Poin
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
          <StreakPoint streak={streak} points={points} />
        </div>
      </div>
    </div>
  );
};

export default Pohon;
