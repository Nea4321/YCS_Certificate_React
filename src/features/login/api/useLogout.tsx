import axios from "axios";
import {useDispatch} from "react-redux";
import {clearCbtHistory, clearFavoriteInfo, clearFavoriteSchedule, clearUser} from "@/shared/slice";
import {persistor} from "@/app/store";

/**
 * 로그아웃 하는 곳
 *
 * 백엔드에 요청해서 리프레시 토큰을 삭제함
 * 그 후 redux 에 들어있는 정보, persist 에 들어있는 정보 다 초기화함.
 * */
export const useLogout = () => {
    const dispatch = useDispatch();

    return async () => {
        try {
            await axios.post("/api/auth/logout", {}, { withCredentials: true });
        } catch (error) {
            console.log("리프레시 토큰 삭제 실패", error);
        } finally {
            dispatch(clearUser());
            dispatch(clearCbtHistory());
            dispatch(clearFavoriteInfo());
            dispatch(clearFavoriteSchedule());
            await persistor.purge();
        }
    };
};