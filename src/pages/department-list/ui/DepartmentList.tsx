import { departmentApi } from "@/entities/department/api"
import { DepartmentSection } from "@/features/department/ui"
import { useDataFetching } from "@/shared/hooks";

export const DepartmentList = () => {

    const { data, loading, error, refetch } = useDataFetching({
        fetchFn:departmentApi.getDeptList
    })

    // 데이터가 없을 때의 처리
    const renderContent = () => {
        if (loading) {
            return (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>데이터를 불러오는 중입니다...</p>
                </div>
            )
        }

        if (error) {
            return (
                <div className="error">
                    <p>오류: {error}</p>
                    <button className="retry-button" onClick={() => void refetch()}>
                        다시 시도
                    </button>
                </div>
            )
        }

        if (data.length === 0) {
            return (
                <div className="empty-state">
                    <p>표시할 학과 정보가 없습니다.</p>
                </div>
            )
        }

        return (
            <div className="faculty-list">
                {data.map((dept) => (
                    <DepartmentSection key={`${dept.parent_type}-${dept.parent_id}`} department={dept} />
                ))}
            </div>
        )
    }

    return <div className="department-list-container">{renderContent()}</div>
}

