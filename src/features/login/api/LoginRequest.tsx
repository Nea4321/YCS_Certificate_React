import axios from "axios";
import {jwtDecode, JwtPayload} from "jwt-decode";


interface UserLoginRequest {
    email: string
    password: string
}
interface MyJwtPayload extends JwtPayload {
    userName?: string;
    email?: string;
    socialType?: string;
}



export const LoginRequest = async ({ email, password }: UserLoginRequest) => {
    try {
        const response = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
        const accessToken = response.data.accessToken;
        return jwtDecode<MyJwtPayload>(accessToken);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message || '로그인 도중 오류가 발생했습니다.';
            console.error(error);
            throw new Error(message);
        }
        else{console.log(error); throw error;}
    }
};