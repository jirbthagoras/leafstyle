"use client";
import React, { useState } from "react";
import Leaderboard from "./Leaderboard";


interface User {
  rank: number;
  name: string;
  points: number;
  streak: number;
}

const LeaderboardPage: React.FC = () => {
  const initialData: User[] = [
    { rank: 1, name: "Veronika", points: 2500, streak: 15 },
    { rank: 2, name: "John", points: 2200, streak: 12 },
    { rank: 3, name: "Maria", points: 1900, streak: 10 },
    { rank: 4, name: "David", points: 1600, streak: 8 },
    { rank: 5, name: "Dav", points: 1500, streak: 7 },
    { rank: 6, name: "You", points: 1250, streak: 8 },
  ];

  const [leaderboardData, setLeaderboardData] = useState<User[]>(initialData);
  



  return (
    <div className="min-h-screen p-8 flex gap-6">
      <Leaderboard
        data={leaderboardData}
      />
    </div>
  );
};

export default LeaderboardPage;
