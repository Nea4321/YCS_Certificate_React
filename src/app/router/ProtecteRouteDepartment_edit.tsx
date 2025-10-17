import {useSelector} from "react-redux";
import {RootState} from "@/app/store";
import {Navigate} from "react-router-dom";
import {JSX} from "react";


/**
 * 라우터 이동을 막아주는 컴포넌트
 *
 * 현재 사용은 대시보드(마이페이지) 에서 사용하고 있음
 * */
export const ProtecteRouteDepartment_edit = ({ children }: { children: JSX.Element }) => {
    const role = useSelector((state: RootState) => state.user.userRole);

    if (role !== "admin") {
        // 어드민 권한 없으면 메인페이지
        return <Navigate to="/" replace />;
    }

    return children; // 정상 접근 허용
};