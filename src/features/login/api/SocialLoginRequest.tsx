import axios from "axios";
import {jwtDecode, JwtPayload} from 'jwt-decode';


/// code - 클라 ID,  userType - 소셜 타입 ( 구글, 카카오 )
interface SocialLoginRequest {
    code: string
    socialType: string
}
interface MyJwtPayload extends JwtPayload {
    userName?: string;
    email?: string;
    socialType?: string;
}


/**
 * 종나 어렵네
 * */
export const SocialLoginRequest = async ({ code, socialType }: SocialLoginRequest) => {
    try {
        const response = await axios.post('/api/auth/social_login', { code, socialType }, { withCredentials: true });
        const accessToken = response.data.accessToken;
        return jwtDecode<MyJwtPayload>(accessToken);
    } catch (error) {
        console.error(error);
        return null;
    }
};