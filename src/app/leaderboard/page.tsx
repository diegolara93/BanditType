'use client';

import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface IUserStats {
  username: string;
  averageWPM: number;
  highestWPM: number;
  games_played: number;
}

export default function Leaderboard() {
  const [userData, setUserData] = useState<IUserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;


  useEffect(() => {
    async function fetchStats() {
      try {
        const resp = await axios.get(`${apiBaseURL}/stats/?limit=100`);
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
          <div className="flex justify-center">
           <Image src="/cropped_dog.gif" width={100} height={100} alt={""} />
           </div>
        ) : (
          <div className="grid gap-6 justify-items-center">
            {userData.map((user, index) => (
              <Card 
                key={user.username} 
                className="bg-[#181825] w-[80%] border border-[#313244] p-0 rounded-lg shadow-md"
              >
                <CardHeader>
                  <Link className="w-[10%]" href="/profile/[username]" as={`/profile/${user.username}`}>
                  <CardTitle className="text-xl font-bold text-[#fab387]">
                    {index + 1}. {user.username}
                  </CardTitle>
                  </Link>
                </CardHeader>
                <CardContent className="mt-0">
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
