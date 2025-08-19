import {useSelector} from "react-redux";
import {RootState} from "@/app/store";
import {Navigate} from "react-router-dom";
import {JSX} from "react";


/**
 * 라우터 이동을 막아주는 컴포넌트
 *
 * 현재 사용은 대시보드(마이페이지) 에서 사용하고 있음
 * */
export const ProtecteRoute = ({ children }: { children: JSX.Element }) => {
    const email = useSelector((state: RootState) => state.user.userEmail);

    if (!email) {
        // 로그인 정보 없으면 로그인 페이지로 이동
        return <Navigate to="/auth" replace />;
    }

    return children; // 정상 접근 허용
};