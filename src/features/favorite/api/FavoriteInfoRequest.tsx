import axios from "axios";

export const FavoriteInfoRequest = async () => {
    const response = await axios.get("/api/user/favorite",{withCredentials: true});
    return response.data;
}