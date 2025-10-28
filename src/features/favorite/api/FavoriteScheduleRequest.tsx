import axios from "axios";

/** 즐찾 스케쥴 정보 가져옴 */
export const FavoriteScheduleRequest = async () => {
    const response = await axios.get("/api/user/schedule",{withCredentials: true});
    return response.data;
}