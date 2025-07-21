import axios from "axios";

/// code - 클라 ID,  userType - 소셜 타입 ( 구글, 카카오 )
interface SocialLoginRequest {
    code: string
    socialType: string
}

/// 백엔드에 액세스 토큰 받아오는 함수
export const GetToken = async ({ code, socialType }: SocialLoginRequest) => {
    const res = await axios.post('/test', { code, socialType })
    return res.data
}