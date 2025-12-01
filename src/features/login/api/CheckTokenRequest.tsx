import axios from "axios";
import {jwtDecode, JwtPayload} from "jwt-decode";
import {useDispatch} from "react-redux";
import {setUser} from "@/shared/slice";
import {useLogout} from "@/features/login";
import {useRef} from "react";

/**
 * 백엔드에서 받은 jwt 토큰에서 받아 서 해독할 본문 내용 인터페이스
 * */
interface MyJwtPayload extends JwtPayload {
    userName?: string;
    email?: string;
    socialType?: string;
    role?: string;
    exp: number;
}

/**
 * 액세스 토큰 만료 기간을 체크하는 기능 ( 타이머 사용 )
 *
 * @returns checkAccessTokenExpired (액세스 토큰 만료 기간 체크 하는 함수)
 * */
export const CheckTokenRequest = () => {
    const dispatch = useDispatch();         //redux 사용되는 액션.
    const logout = useLogout();

    const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

    /**
     *  리프레시 토큰을 체크하는 곳
     *
     *  1. 쿠키에 저장된 리프레시 토큰을 백엔드로 넘김
     *  2. 백엔드에서 리프레시 토큰을 체크
     *  2-1. 오류(리프레시 토큰 만료 기간이 지남 or 유효하지 않을때) 생기면 400,401 에러를 전달함 -> try문 바로 빠져 나가서 error 발생
     *  2-2. 정상 작동하면 액세스 토큰을 새로 갱신해서 json 형태로 전달함.
     *  3. 받은 액세스 토큰을 해독 함.
     *  4. 해독한 액세스 토큰(decode)에 유저 정보를 redux에 저장함 (dispatch)
     *  5. 만약 오류 발생시 바로 redux에 있는 정보를 초기화 후 에러메시지를 던짐.
     * */
    const checkRefreshToken = async () => {
        try {
            const response = await axios.post("/api/auth/refresh",{}, {withCredentials: true});
            const accessToken = response.data.accessToken;
            const decode = jwtDecode<MyJwtPayload>(accessToken);
            dispatch(setUser({
                userName: decode.userName || '',
                userEmail: decode.email || '',
                socialType: decode.socialType || 'NORMAL',
                role: decode.role || 'normal',
                tokenExp: decode.exp || 0,
            }))
            await logout()
        } catch (error) {
            await logout()

            if (axios.isAxiosError(error)) {
                const message = error.response?.data || error.message || '토큰 갱신에 오류가 생겼습니다.';
                console.error(error);
                throw new Error(message);
            } else {
                throw error;
            }
        }
    }

    /**
     * 액세스 토큰 만료 기간을 체크하는 곳
     *
     * 1. 액세스 토큰 만료 기간을 가져옴
     * 2. 만약 진행중인 타이머가 있으면 그 타이머를 초기화함.
     * 3. 토큰 만료 기간 = 토큰 발행 시간 + 서버에서 추가한 시간 (10분) (초 로 반환됨)
     * 4. Date.now() -> 현재 시간이 밀리초로 반환됨. 그래서 *1000을 해서 밀리초로 변환.
     * 5. 토큰 만료 시간이 이미 지났으면 바로 리프레시 토큰 체크 를 진행.
     * 5-1. 만약 안 지났으면 타이머를 실행 해 만료 시간이 지나기 1초 전 까지 기다린 후 리프레시 토큰 체크 진행
     *
     * @param token_expired (number)
     * */
    const checkAccessTokenExpired = async (token_expired?: number) => {
        if(!token_expired) return console.log(token_expired);
        if (timeoutId.current) clearTimeout(timeoutId.current);

        const expireTime = token_expired * 1000 // 밀리초로 변환

        const now = Date.now();
        const timeout = expireTime - now - 1000; // 토큰 만료 시간,  만료 1초 전에 실행

        if (timeout <= 0) {
            await checkRefreshToken();
        } else {
            timeoutId.current = setTimeout(checkRefreshToken, timeout);
        }
    };

    return {checkAccessTokenExpired}
}
