import { auth } from "@/utils/firebase";
import axios from "axios";

class UserStats {
    averageWPM:  number;
    highestWPM: number;
    games_played: number;
    constructor(data: any) {
        this.averageWPM = data.averageWPM;
        this.highestWPM = data.highestWPM;
        this.games_played = data.games_played
    }
    static fromJson(data: string): UserStats {

        return new UserStats(data)

    }
}
export default async function Profile({
    params,
}: {
    params: Promise<{username: string}>;
}) {
    let user = auth.currentUser

    const getUsrname = async(uid: string) => {
        try {
            const resp = await axios.get(`http://127.0.0.1:8000/users/${uid}/username`)
            let username = JSON.stringify(resp.data).slice(1, -1);
            return username
        } catch (error) {
            console.log("Failed to get username", error);
        }
    }

    const getBio = async(username: string) => {
        try {
            const resp = await axios.get(`http://127.0.0.1:8000/users/${username}/bio`)
            let bio = JSON.stringify(resp.data).slice(1, -1);
            return bio
        } catch(error) {
            console.log("Failed to get bio", error);
        }
    }

    const getStats = async(username: string) => {
        try {
            const resp = await axios.get(`http://127.0.0.1:8000/users/${username}/stats`)
            return resp.data
        } catch(error) {
            console.log("Failed to get stats", error);
        }
    }
    let displayPage
    const profileStyle = "text-3xl text-[#f9e2af] font-bold"
    const bioStyle = "text-2xl text-[#f9e2af] font-bold italic"
    const errorStyle = "text-5xl text-red font-bold"
    const infoStyle = "text-xl text-[#eba0ac]"
    const username =  (await params).username;
    const bio = await getBio(username);
    const stats = await getStats(username);
    if (bio) {
        let userStats = UserStats.fromJson(stats)

        displayPage = (
            <div className="bg-[#1e1e2e] flex flex-col items-center mt-[15rem] h-[45rem]">
            <div className="flex flex-col align-start w-[75vh]">
            <h1 className={profileStyle}>{username}</h1>
            <h1 className={bioStyle}>{bio}</h1>
            </div>
            <h1 className={infoStyle}>Average WPM: {userStats.averageWPM}</h1>
            <h1 className={infoStyle}>Highest WPM: {userStats.highestWPM}</h1>
            <h1 className={infoStyle}>Games Played: {userStats.games_played}</h1>
        </div>
        )
    } else {
        displayPage = (
            <div className="bg-[#1e1e2e] flex flex-col items-center mt-[15rem] h-[45rem]">
        <h1 className={errorStyle}>ERROR: Not a valid user</h1>
        </div>
    )
    }
    return (
        displayPage
    )
}