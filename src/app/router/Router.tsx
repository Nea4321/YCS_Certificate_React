import {BrowserRouter, Routes, Route, useParams} from "react-router-dom"
import { DepartmentListPage } from "@/pages/department-list"
import { DepartmentPage } from "@/pages/department/DepartmentPage.tsx";
import { CertificatePage } from "@/pages";
import { AuthPage } from "@/pages/Auth/AuthPage.tsx";
import { Header } from "@/shared/ui/header";
import { MainPage } from "@/pages/main";
import { ScrollToTop } from "@/shared";
import {SocialLoginHandler} from "@/features/login";


export const Router = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
                <div className="app-layout">
                    <Header />
                    <main className="main-content">
                        <Routes>
                            {/*<Route path="/" element={<Navigate to="/departments" replace />} />*/}
                            <Route path="/" element={<MainPage />} />
                            <Route path="/departments" element={<DepartmentListPage />} />
                            <Route path="/departments/:id" element={<DepartmentPage />} />
                            <Route path="/certificate/:id" element={<CertificatePage />} />
                            <Route path="/auth" element={<AuthPage />} />    /// 로그인
                            <Route path="/google_login" element={<SocialLoginHandler socialType={'google'} />} />    ///구글 로그인 확인
                            {/* 추가 라우트 정의 */}
                            {/* <Route path="/departments/:id" element={<DepartmentDetailPage />} /> */}
                            {/* <Route path="/certificates" element={<CertificateListPage />} /> */}
                            {/* 404 페이지 */}
                            <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
                        </Routes>
                    </main>
                </div>
        </BrowserRouter>
    )

    /// 구글 로그인 확인
    // function SocialLoginHandlerWrapper() {
    //     const { type } = useParams()
    //     if (!type) return null
    //     return <SocialLoginHandler socialType={type} />
    // }
}

