"use client";
import React, { useState } from "react";
import { Flame, Star, Sparkles } from "lucide-react";

const StreakPointsCard = ({ streak, points }) => {
  const [activeSection, setActiveSection] = useState(null);

  const generateSparkles = (count) => {
    return Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full animate-ping"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${1 + Math.random() * 2}s`
        }}
      />
    ));
  };

  return (
    <div className="max-w-sm mx-auto px-4">
      <div className="relative p-1 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl" />
        
        <div className="relative bg-gradient-to-r rounded-3xl p-2">
          <div className="flex flex-col items-center gap-8">
            {/* Streak Section */}
            <div
              className="relative w-full group"
              // onMouseEnter={() => setActiveSection('streak')}
              onMouseLeave={() => setActiveSection(null)}
            >
              <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-green-100 to-yellow-100 transform transition-all duration-500 group-hover:scale-105">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-md animate-pulse" />
                  <div className="relative p-4 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full shadow-lg group-hover:shadow-orange-500/50">
                    <Flame className="w-12 h-12 text-white animate-bounce" />
                  </div>
                </div>
                <span className="mt-4 text-xl font-bold text-green-600">Current Streak</span>
                <div className="relative mt-2">
                  <span className="text-5xl font-black bg-gradient-to-r from-red-600 to-orange-800 bg-clip-text text-transparent">
                    {streak}
                  </span>
                  <Sparkles className="absolute -right-8 top-0 w-6 h-6 text-green-400 animate-spin" />
                </div>
                <div className="mt-4 px-4 py-1 bg-green-500 rounded-full">
                  <p className="text-sm text-black font-semibold">🔥 Keep the streak alive!</p>
                </div>
              </div>
            </div>

            {/* Points Section */}
            <div
              className="relative w-full group"
              // onMouseEnter={() => setActiveSection('points')}
              onMouseLeave={() => setActiveSection(null)}
            >
              <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-green-100 to-yellow-100 transform transition-all duration-500 group-hover:scale-105">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-md animate-pulse" />
                  <div className="relative p-4 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full shadow-lg group-hover:shadow-yellow-500/50">
                    <Star className="w-12 h-12 text-white animate-bounce" />
                  </div>
                </div>
                <span className="mt-4 text-xl font-bold text-green-600">Total Points</span>
                <div className="relative mt-2">
                  <span className="text-5xl font-black bg-gradient-to-r from-purple-600 to-indigo-800 bg-clip-text text-transparent">
                    {points}
                  </span>
                  <Sparkles className="absolute -right-8 top-0 w-6 h-6 text-yellow-400 animate-spin" />
                </div>
                <div className="mt-4 px-4 py-1 bg-green-950/50 rounded-full">
                  <p className="text-sm text-yellow-100">⭐ Crushing it!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakPointsCard;
