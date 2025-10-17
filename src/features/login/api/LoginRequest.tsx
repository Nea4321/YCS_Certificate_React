import axios from "axios";
import {jwtDecode, JwtPayload} from "jwt-decode";

/**
 * 유저 로그인 정보를 보낼 정보 타입 지정 인터페이스
 * */
interface UserLoginRequest {
    email: string
    password: string
}

/**
 * 백엔드에서 받은 jwt 토큰에서 받아 서 해독할 본문 내용 인터페이스
 * 이름,이메일,소셜타입,토큰만료시간.
 * */
interface MyJwtPayload extends JwtPayload {
    userName?: string;
    email?: string;
    socialType?: string;
    role?: string;
    exp: number;
}

/**
 * 로그인 요청하는 곳.
 *
 * 1. 이메일,비밀번호를 백엔드에 전달
 * 2. 백엔드에서 유저 정보가 있는지 확인
 * 2-1. 없으면 오류 메시지 전달
 * 2-2. 있으면 유저 정보 조회 후 jwt토큰으로 만들어서 전달
 * 3. jwt 토큰 받은걸 해독후 리턴함.
 *
 * @param email (string)
 * @param password (string)
 * @return Claims
 * */
export const LoginRequest = async ({ email, password }: UserLoginRequest) => {
    try {
        const response = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
        const accessToken = response.data.accessToken;
        return jwtDecode<MyJwtPayload>(accessToken);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data || error.message || '로그인 도중 오류가 발생했습니다.';
            console.error(error);
            throw new Error(message);
        }
        else{ throw error; }
    }
};