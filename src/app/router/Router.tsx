import { BrowserRouter, Routes, Route } from "react-router-dom"
import { DepartmentListPage } from "@/pages/department-list"
import { DepartmentPage } from "@/pages/department/DepartmentPage.tsx";
import { CertificatePage } from "@/pages";
import { Auth } from "@/pages/Auth/Auth.tsx";
import { SocialLogin } from "@/pages/sociallogin";
import { DashBoard } from "@/pages/dashboard/DashBoard";
import { Header } from "@/shared/ui/header";
import { MainPage } from "@/pages/main";
import { CBTExamPage } from "@/pages/cbt";
import { ScrollToTop } from "@/shared";
import { SearchResultPage } from "@/pages/search"
import {MainLayout} from "@/shared/layouts";
import {CBTStart} from "@/pages/cbt-start";
import {CBTTest} from "@/pages/cbt-test";
import {Logout} from "@/pages/logout/ui";
import { Department_Edit } from "@/pages/department_edit";
import {ProtecteRoute} from "@/app/router/ProtecteRoute.tsx";
import {ExamResult} from "@/pages/exam-result";


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
                            <Route path="/departments" element={<DepartmentListPage />} />
                            <Route path="/departments/:id" element={<DepartmentPage />} />
                            <Route path="/certificate/:id" element={<CertificatePage />} />
                            <Route path="/cbt" element={<CBTExamPage/>} />
                            <Route path="/cbt/start" element={<CBTStart/>} /> {/*문제 유형 결정 페이지*/}
                            <Route path="/cbt/test" element={<CBTTest/>} /> {/* cbt 페이지 */}
                            <Route path="/cbt/result" element={<ExamResult/>} /> {/* cbt 답안 제출 페이지 */}
                            <Route path="/social_login/:socialType" element={<SocialLogin />} />    ///소셜 로그인 확인
                            <Route path="/auth" element={<Auth />} />               {/* 로그인 */}
                            <Route path="/logout" element={<Logout/>} />            {/* 로그아웃 */}
                            <Route path="/social_login/:socialType" element={<SocialLogin />} />    {/* 소셜 로그인 확인 */}
                        <Route path="/dashboard" element={<ProtecteRoute><DashBoard /></ProtecteRoute>} />     {/* 마이 페이지 */}
                            <Route path="/department_edit" element={<Department_Edit/>} />
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

