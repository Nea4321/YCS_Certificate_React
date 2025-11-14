import axios from "axios";

interface UserCbtHistory{
    certificate_id: number;
    score: number;
    correct_Count: number;
    left_time: number;
}

export const UserAddCbtHistory = async ({certificate_id, score, correct_Count, left_time}: UserCbtHistory) => {
    const response = await axios.post("/api/user/cbt/add", { certificate_id, score, correct_Count, left_time}, {withCredentials: true});
    return response.data;
}