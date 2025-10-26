import axios from "axios";

export const FavoriteDeleteRequest = async (type:string, id:number) => {
    const response = await axios.delete(`/api/user/favorite/${type}/${id}`,{withCredentials: true});
    return response.data;
}