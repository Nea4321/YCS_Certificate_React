import {JSX} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/store";
import {Navigate} from "react-router-dom";

export const ProtectRouteAuth = ({ children }: { children: JSX.Element }) => {
    const email = useSelector((state: RootState) => state.user.userEmail);

    if (email) {

        return <Navigate to="/" replace />;
    }

    return children; // 정상 접근 허용
};