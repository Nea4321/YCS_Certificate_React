import { useParams, useNavigate } from "react-router-dom"
import { useDataFetching } from "@/shared"
import { departmentApi } from "@/entities"
import { DepartmentDetail } from "@/widgets/department"
import { departmentStyles } from "../styles"

export const Department = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const { data, loading, error, refetch } = useDataFetching({
        fetchFn: departmentApi.getDeptMapData,
    })

    // URL 파라미터가 없으면 리스트로 리다이렉트
    if (!id) {
        navigate("/departments", { replace: true })
        return null
    }

    // 해당 ID에 맞는 데이터 찾기
    const departmentData = data?.find((dept) => dept.dept_map_id === Number.parseInt(id))

    const renderContent = () => {
        if (loading) {
            return (
                <div className={departmentStyles.loading}>
                    <div className={departmentStyles.loadingSpinner}></div>
                    <p>학과 정보를 불러오는 중입니다...</p>
                </div>
            )
        }

        if (error) {
            return (
                <div className={departmentStyles.error}>
                    <p>오류: {error}</p>
                    <button className={departmentStyles.retryButton} onClick={() => void refetch()}>
                        다시 시도
                    </button>
                </div>
            )
        }

        if (!departmentData) {
            return (
                <div className={departmentStyles.notFound}>
                    <h2>학과 정보를 찾을 수 없습니다</h2>
                    <p>요청하신 학과 정보가 존재하지 않습니다.</p>
                    <button className={departmentStyles.backButton} onClick={() => navigate("/departments")}>
                        학과 목록으로 돌아가기
                    </button>
                </div>
            )
        }

        return <DepartmentDetail department={departmentData} />
    }

    return (
        <div className={departmentStyles.departmentContainer}>
            <div className={departmentStyles.pageHeader}>
                <button onClick={() => navigate("/departments")} className={departmentStyles.backButton}>
                    ← 학과 목록으로
                </button>
            </div>
            {renderContent()}
        </div>
    )
}