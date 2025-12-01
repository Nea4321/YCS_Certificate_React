import axios from "axios";

///중복 로그인 체크
export const CheckDuplicateToken = async () => {
    const response = await axios.post("/api/auth/duplicate", {}, {withCredentials: true});
    return response.data;
}