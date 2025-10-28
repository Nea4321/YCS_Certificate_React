import axios from "axios";


/** 즐찾 체크 */
export const FavoriteCheckRequest = async (type:string, id:number) => {
    const response = await axios.get(`/api/user/favorite/${type}/${id}`,{withCredentials: true});
    return response.data ;
}