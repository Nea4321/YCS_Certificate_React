import {GetPopupOptions, OpenPopup} from "@/features/login";

/**
 * Google 로그인 팝업창 띄우는 곳.
 *
 * 다른 소셜 로그인도 아래 url 만 고쳐서 만들면 될 듯 함.
 * */
export const NaverLogin = () => {
    const url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&' +
        'client_id=' + import.meta.env.VITE_NAVER_CLIENT_ID +
        '&redirect_uri=' + import.meta.env.VITE_NAVER_REDIRECT_URI +
        '&state=1234';  //

    OpenPopup(url,GetPopupOptions(500, 500));
}