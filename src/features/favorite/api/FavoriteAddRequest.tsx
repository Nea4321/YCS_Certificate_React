import axios from "axios";

/** 즐찾 추가 */
export const FavoriteAddRequest = async (type:string, id:number) => {
    const response = await axios.put(`/api/user/favorite/${type}/${id}`,null,{withCredentials: true});
    return response.status;
}