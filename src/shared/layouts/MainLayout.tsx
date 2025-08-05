import { useLocation } from "react-router-dom";

interface Props {
    children: React.ReactNode;
}

/**
 * <main className={~~}> 를 따로 분리한 컴포넌트
 *
 * 현재 라우터 -> <main class~~> 로 묶여져 있음 -> 라우터 안에서 location 사용 불가 -> 헤더 지우는게 불안정함.
 * 개선 라우터 -> <main class~~> 를 컴포넌트 분리함 -> 라우터 안에서 location 사용 가능
 * */
export const MainLayout = ({ children }: Props) => {
    const location = useLocation();
    const isAuthPage = location.pathname === "/auth";

    return (
        <main className={isAuthPage ? "main-content.header-hidden" : "main-content"}>
            {children}
        </main>
    );
};