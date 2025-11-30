import axios from "axios";


import {CheckDuplicateToken, useLogout} from "@/features/login";
import {useNavigate} from "react-router-dom";

export const CheckDuplicate = () => {
    const navigate = useNavigate();
    const logout = useLogout();

    const check = async () => {
        try {
            await CheckDuplicateToken()
            return true;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 409) {
                    alert("다른 기기에서 로그인되어 세션이 만료되었습니다.");
                    await logout();
                    navigate("/auth");
                    throw new Error("중복 토큰 발생")
                }
            }
        }
    }
    return {check}
};