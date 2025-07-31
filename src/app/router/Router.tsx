import { BrowserRouter, Routes, Route } from "react-router-dom"
import { DepartmentListPage } from "@/pages/department-list"
import { DepartmentPage } from "@/pages/department/DepartmentPage.tsx";
import { DepartmentCalendarPage } from "@/pages/department-list/DepartmentCalendarPage";
import { CertificatePage } from "@/pages";
import { Auth } from "@/pages/Auth/Auth.tsx";
import { SocialLogin } from "@/pages/sociallogin";
import { DashBoard } from "@/pages/dashboard/DashBoard";
import { Header } from "@/shared/ui/header";
import { MainPage } from "@/pages/main";
import { CBTExamPage } from "@/pages/cbt/ui";
import { ScrollToTop } from "@/shared";
import { SearchResultPage } from "@/pages/search"
import {MainLayout} from "@/shared/layouts";


export const Router = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
                <div className="app-layout">
                    <Header />
                    {/*로그인 페이지면 헤더 공간 없앰.*/}
                    <MainLayout>
                    <Routes>
                            {/*<Route path="/" element={<Navigate to="/departments" replace />} />*/}
                            <Route path="/" element={<MainPage />} />
                            {/*캘린더 페이지 라우터*/}
                            <Route path="/calendar" element={<DepartmentCalendarPage/>} />
                            <Route path="/departments" element={<DepartmentListPage />} />
                            <Route path="/departments/:id" element={<DepartmentPage />} />
                            <Route path="/certificate/:id" element={<CertificatePage />} />
                            <Route path="/cbt" element={<CBTExamPage/>} />
                            <Route path="/auth" element={<Auth />} />    /// 로그인
                            <Route path="/social_login/:socialType" element={<SocialLogin />} />    ///소셜 로그인 확인
                            <Route path="/dashboard" element={<DashBoard />} />    /// 마이페이지
                            {/* 추가 라우트 정의 */}
                            {/* <Route path="/departments/:id" element={<DepartmentDetailPage />} /> */}
                            {/* <Route path="/certificates" element={<CertificateListPage />} /> */}
                            {/* 검색 기능 */}
                            <Route path="/search" element={<SearchResultPage />} />
                            {/* 404 페이지 */}
                            <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
                        </Routes>
                    </MainLayout>
                </div>
        </BrowserRouter>
    )
}

