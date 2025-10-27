import axios from "axios";

/** 즐찾 정보 가져옴 (id,type,type_id,type_name) */
export const FavoriteInfoRequest = async () => {
    const response = await axios.get("/api/user/favorite",{withCredentials: true});
    return response.data;
}