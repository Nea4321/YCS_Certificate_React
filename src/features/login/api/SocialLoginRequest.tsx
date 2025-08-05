import axios from "axios";

/// code - 클라 ID,  userType - 소셜 타입 ( 구글, 카카오 )
interface SocialLoginRequest {
    code: string
    socialType: string
}

interface SocialLoginResponse {
    id: string
    email: string
    name: string
    gender: string
}
/**
 * 백엔드에 액세스 토큰 을 받아올 수 있게 변수를 전달하는 함수.
 * 백엔드는 socialType에 따라 액세스 토큰을 받아오는 로직을 짜야댐.
 * 받은 액세스 토큰으로 유저 정보를 얻어오는게 이 함수 최종 목적.
 * */
export const SocialLoginRequest = async ({ code, socialType }: SocialLoginRequest):Promise<SocialLoginResponse> => {
    const res = await axios.post('/api/test/login', { socialType,code })
    return res.data
}