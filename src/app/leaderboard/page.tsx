'use client';
import axios from "axios";
import { useEffect, useState } from "react";

class UserStats {
    username: string;
    averageWPM:  number;
    highestWPM: number;
    games_played: number;
    constructor(data: any) {
        this.username = data.username;
        this.averageWPM = data.averageWPM;
        this.highestWPM = data.highestWPM;
        this.games_played = data.games_played
    }
    static fromJson(data: string): UserStats {

        return new UserStats(data[0])
    
    }
}

export default function Leaderboard() {
    const userArr: (UserStats | undefined)[] = []
    const getStats = async () => {
        try {
            const resp = await axios.get(`http://127.0.0.1:8000/stats/?limit=100`)
            console.log(resp.data)
            return UserStats.fromJson(resp.data)
        } catch (error) {
            console.error("Failed to get stats", error);
        }
    }
    const [userData, setUserData] = useState<UserStats | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getStats();
            setUserData(data || null);
            userArr.push(data)
        };
        fetchData();
    }, []);

    return (
        <div>
            {userData ? (
                userArr.map((user) => userShowcase(user))
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

const userShowcase = (user: UserStats | undefined) => {
    if (!user) return null;
    console.log(user)
    return (
        <div>
            <p>Name: {user.username}</p>
            <p>Average WPM: {user.averageWPM}</p>
            <p>Highest WPM: {user.highestWPM}</p>
            <p>Games Played: {user.games_played}</p>
        </div>
    )
}