import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { DepartmentListPage } from "@/pages/department-list"
import { DepartmentPage } from "@/pages/department/DepartmentPage.tsx";
import { CertificatePage } from "@/pages";

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/departments" replace />} />
                <Route path="/departments" element={<DepartmentListPage />} />
                <Route path="/departments/:id" element={<DepartmentPage />} />
                <Route path="/certificate/:id" element={<CertificatePage />} />
                {/* 추가 라우트 정의 */}
                {/* <Route path="/departments/:id" element={<DepartmentDetailPage />} /> */}
                {/* <Route path="/certificates" element={<CertificateListPage />} /> */}
                {/* 404 페이지 */}
                <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
            </Routes>
        </BrowserRouter>
    )
}

