import axios from "axios";

export const UserGetCbtHistory = async () => {
    const response = await axios.get("/api/user/cbt",{withCredentials: true});
    return response.data;
}