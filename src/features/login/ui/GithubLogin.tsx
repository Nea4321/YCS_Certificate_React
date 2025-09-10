import {GetPopupOptions, OpenPopup} from "@/features/login";


export const GithubLogin = () => {
    const url = 'https://github.com/login/oauth/authorize?' +
        'client_id=' + import.meta.env.VITE_GITHUB_CLIENT_ID +
        '&redirect_uri=' + import.meta.env.VITE_GITHUB_REDIRECT_URI +
        '&scope=user:email';

    OpenPopup(url,GetPopupOptions(500, 500));
}