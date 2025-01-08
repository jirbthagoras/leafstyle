"use client";
import React from "react";
import { Trophy, Star, Flame, Medal, Crown } from "lucide-react";

interface User {
  rank: number;
  name: string;
  points: number;
  streak: number;
}

interface LeaderboardProps {
  data: User[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  const getTopRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-yellow-200/50";
      case 2:
        return "bg-gradient-to-r from-gray-100 to-gray-200 shadow-gray-200/50";
      case 3:
        return "bg-gradient-to-r from-orange-100 to-orange-200 shadow-orange-200/50";
      default:
        return "bg-gray-50";
    }
  };

  const getTopRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-gray-500">{rank}</span>;
    }
  };

  return (
    <div className="max-w-xl px-4 mt-20">
      <div className="bg-gradient-to-br from-green-100 to-yellow-100 rounded-2xl p-8 shadow-lg">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Leaderboard
            </h2>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3 overflow-y-auto max-h-96">
  {data.map((user) => (
    <div
      key={user.rank}
      className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:shadow-lg ${
        user.name === "You"
          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500"
          : getTopRankStyle(user.rank)
      } ${user.rank <= 3 ? "shadow-lg" : ""}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 shadow-sm group-hover:scale-110 transition-transform">
          {getTopRankIcon(user.rank)}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{user.name}</span>
          {user.rank <= 3 && (
            <span className="text-sm text-gray-500">Top Player</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Star className="w-4 h-4 text-yellow-600" />
          </div>
          <span className="font-semibold">{user.points}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Flame className="w-4 h-4 text-orange-600" />
          </div>
          <span className="font-semibold">{user.streak}</span>
        </div>
      </div>
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

export default Leaderboard;
