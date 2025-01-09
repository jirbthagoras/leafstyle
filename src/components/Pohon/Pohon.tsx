"use client";
import React, { useState } from "react";
import Leaderboard from "./LeaderboardPage";
import StreakPoint from "./StreakPoint";

const Pohon = () => {
  const [streak, setStreak] = useState(15);
  const [points, setPoints] = useState(200);

  const getTreeImage = () => {
    if (points < 100) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
          <rect x="45" y="60" width="10" height="20" fill="#8B4513" />
          <circle cx="50" cy="50" r="20" fill="#228B22" />
        </svg>
      );
    }
    if (points < 300) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">
          <rect x="70" y="90" width="10" height="30" fill="#8B4513" />
          <circle cx="75" cy="70" r="30" fill="#228B22" />
        </svg>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-gray-50 to-green-50 p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20 ">      
          <Leaderboard />

      {/* Pohon */}

      <div className="relative h-fit max-w-md mx-auto rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all bg-gradient-to-t from-green-50 via-gray-50 to-green-50 mt-20 md:max-w-lg lg:max-w-xl">
  <div className="space-y-8">
    {/* Judul */}
    <h2 className="text-3xl font-bold text-green-700 text-center my-6">
      Pohon Virtual Saya
    </h2>

    <div className="relative group">
      {/* Background Gradien Hover */}
      <div className="absolute inset-0 bg-gradient-to-t to-transparent rounded-xl group-hover:from-green-200/50 transition-colors pointer-events-none" />

      {/* Gambar Pohon */}
      <img
        src={getTreeImage()}
        alt="Virtual Tree"
        className="w-80 h-80 max-w-xs lg:max-w-sm mx-auto object-contain transform transition-transform group-hover:scale-110 group-hover:shadow-lg cursor-pointer"
        onClick={() => setPoints(points + 50)}
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

    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden ring-1 ring-gray-200">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
          style={{
            width: `${(getProgress() / (getNextLevelPoints() - (points < 100 ? 0 : 100))) * 100}%`,
          }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-800">
          {points}/{getNextLevelPoints()}
        </span>
      </div>

      {/* Info Streak dan Points */}
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

      {/* Tombol Tambah Poin */}
      <button
        onClick={() => setPoints(points + 50)}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg"
      >
        History
      </button>
    </div>
  </div>
</div>


            {/* Streak */}

                  <div className="mt-20">
          <StreakPoint streak={streak} points={points} />
                  </div>

      </div>
    </div>
  );
};

export default Pohon;
