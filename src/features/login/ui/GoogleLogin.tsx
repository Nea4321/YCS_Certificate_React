import {GetPopupOptions, OpenPopup} from "@/features/login";

// 다른 소셜 로그인 기능 들은 url 만 바꿔서 이 코드 공통으로 만들어서 사용하면 될 듯?
// env 오류는 타입 지정 안해서 생기는 오류 -> 해결 하려니 잘 안돼서 내비두는중
// 구글 팝업창 띄우는 역할
export const GoogleLogin = () => {
const url = 'https://accounts.google.com/o/oauth2/v2/auth?' +
    'client_id=' + import.meta.env.VITE_GOOGLE_CLIENT_ID +
    '&redirect_uri=' + import.meta.env.VITE_GOOGLE_REDIRECT_URI +
    '&response_type=code' +
    '&scope=email profile';

OpenPopup(url,GetPopupOptions(500, 500));
}