"use client";
import React, { useState, useEffect } from "react";
import Leaderboard from "./Leaderboard";
import pointService from "@/services/PointService";

interface User {
  rank: number;
  name: string;
  points: number;
  streak: number;
}

const LeaderboardPage: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<User[]>([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const data = await pointService.getLeaderboard(10); // Get top 10 users
        
        // Transform the data to match the User interface
        const transformedData = data.map((user, index) => ({
          rank: index + 1,
          name: user.userName,
          points: user.totalPoints,
          streak: 0, 
        }));

        setLeaderboardData(transformedData);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <div className=" p-8 flex gap-6">
      <Leaderboard data={leaderboardData} />
    </div>
  );
};

export default LeaderboardPage;
