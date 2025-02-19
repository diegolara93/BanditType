import axios from "axios";

export default function Profile() {
    const getUsername = async(uid: string) => {
        try {
            const resp = await axios.get(`http://127.0.0.1:8000/users/${uid}/username`);
            /*
                Without returning the .slice(1, -1) the username is returned with quotes which messes with the post request
                do not remove!
            */ 
            let username =JSON.stringify(resp.data).slice(1, -1);
            console.log("got name", username);
            return username;
            } catch (error) {
                console.error("Failed to get username", error);
            }
    }

    const getBio = async(username: string) => {
        try {
            const resp = await axios.get(`http://127.0.0.1:8000/users/${username}/bio`)
            let bio = JSON.stringify(resp.data).slice(1, -1);
            return bio
        } catch(error) {
            console.error("Failed to get bio", error);
        }
    }

    const getStats = async(username: string) => {
        try {
            const resp = await axios.get(`http://127.0.0.1:8000/users/${username}/stats`)
            let stats = JSON.stringify(resp.data).slice(1, -1);
            return stats
        } catch(error) {
            console.error("Failed to get bio", error);
        }
    }
    return (
        <div>

        </div>
    )
}