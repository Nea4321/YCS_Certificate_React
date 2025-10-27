import axios from "axios";

export const FavoriteScheduleRequest = async () => {
    const response = await axios.get("/api/user/schedule",{withCredentials: true});
    return response.data;
}