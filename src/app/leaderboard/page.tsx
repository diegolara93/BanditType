'use client';

import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface IUserStats {
  username: string;
  averageWPM: number;
  highestWPM: number;
  games_played: number;
}

export default function Leaderboard() {
  const [userData, setUserData] = useState<IUserStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const resp = await axios.get("http://127.0.0.1:8000/stats/?limit=100");
        setUserData(resp.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#1E1E2E] text-[#f5c2e7] p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Top 100 Players</h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid gap-6">
            {userData.map((user, index) => (
              <Card 
                key={user.username} 
                className="bg-[#181825] border border-[#313244] p-0 rounded-lg shadow-md"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-[#fab387]">
                    {index + 1}. {user.username}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-2">
                  <p className="text-[#fab387]">
                    Average WPM: <span className="font-medium">{user.averageWPM}</span>
                  </p>
                  <p className="text-[#fab387]">
                    Highest WPM: <span className="font-medium">{user.highestWPM}</span>
                  </p>
                  <p className="text-[#fab387]">
                    Games Played: <span className="font-medium">{user.games_played}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
