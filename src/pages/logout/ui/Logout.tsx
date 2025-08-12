import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {clearUser} from "@/shared/slices";
import {persistor} from "@/app/store";
import {useEffect} from "react";


export const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(clearUser());      //리덕스 저장소 초기화
        persistor.purge();          //redux-persist 저장소 초기화
        localStorage.removeItem('someTokenKey');  // localStorage 삭제

        // document.cookie = 'refresh_token=; Max-Age=0; path=/;';

        navigate('/', { replace: true });  // 메인 페이지로 이동
    }, [dispatch, navigate]);


    return null;
}