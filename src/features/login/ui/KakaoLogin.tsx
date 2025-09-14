import {GetPopupOptions, OpenPopup} from "@/features/login";

/**
 * Google 로그인 팝업창 띄우는 곳.
 *
 * 다른 소셜 로그인도 아래 url 만 고쳐서 만들면 될 듯 함.
 * */
export const KakaoLogin = () => {
    const url =   'https://kauth.kakao.com/oauth/authorize?' +
        'client_id=' + import.meta.env.VITE_KAKAO_API_KEY +
        '&redirect_uri=' + import.meta.env.VITE_KAKAO_REDIRECT_URI +
        '&response_type=code';

    OpenPopup(url,GetPopupOptions(500, 500));
}