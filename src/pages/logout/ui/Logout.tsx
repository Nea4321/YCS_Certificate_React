import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useLogout} from "@/features/login";

/**
 * 로그아웃 페이지
 *
 * 로그아웃이 성공하면 redux store,redux-persist 를 초기화
 * 백엔드에 요청해 리프레시 토큰을 삭제 (만료 시간을 0으로 만듬)
 * 성공하면 메인페이지로 이동.
 * */
export const Logout = () => {
    const { logout } = useLogout();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            await logout();
            navigate('/', { replace: true });
        })();
    }, [logout, navigate]);


    return null;
}