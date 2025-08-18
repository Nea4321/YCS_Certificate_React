import axios from "axios";
import {jwtDecode, JwtPayload} from 'jwt-decode';


/**
 * 백엔드에 보낼 정보 인터페이스
 * code - 클라 ID등등,  userType - 소셜 타입 ( 구글, 카카오 )
 * */
interface SocialLoginRequest {
    code: string
    socialType: string
}
/**
 * 백엔드에 받아서 해독할 jwt 토큰 본문 내용 인터페이스
 * */
interface MyJwtPayload extends JwtPayload {
    userName?: string;
    email?: string;
    socialType?: string;
    exp: number;
}


/**
 * 소셜 로그인 유저 정보를 받아 오는 곳.
 *
 * 1. 백엔드에 code,socialType 전달
 * 2. 백엔드에서 여러가지 체크를 함.
 * 2-1. 받은 code,socialType이 잘못되면 에러 메세지를 전달함.
 * 2-2. code,socialType이 정상 이지만 유저 정보를 얻어오는 로직이 잘못되면 에러 메시지를 전달함.
 * 2-3. 전부 제대로 처리되면 받아온 유저 정보를 jwt 토큰 으로 변환후 전달함.
 * 3. 받은 jwt 토큰을 해석후 리턴함.
 * 4. 만약 에러생기면 null로 리턴.
 *
 * @param code (string)
 * @param socialType (string)
 * @returns Claims
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