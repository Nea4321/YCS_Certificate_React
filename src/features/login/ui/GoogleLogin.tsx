import {GetPopupOptions, OpenPopup} from "@/features/login";

/**
 * Google 로그인 팝업창 띄우는 곳.
 *
 * 다른 소셜 로그인도 아래 url 만 고쳐서 만들면 될 듯 함.
 * */
export const GoogleLogin = () => {
const url = 'https://accounts.google.com/o/oauth2/v2/auth?' +
    'client_id=' + import.meta.env.VITE_GOOGLE_CLIENT_ID +
    '&redirect_uri=' + import.meta.env.VITE_GOOGLE_REDIRECT_URI +
    '&response_type=code' +
    '&scope=email profile';

OpenPopup(url,GetPopupOptions(500, 500));
}