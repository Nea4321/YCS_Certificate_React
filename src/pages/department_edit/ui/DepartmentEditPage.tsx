import { departmentApi } from "@/entities/department/api"
import { DepartmentListSection } from "@/features/department/ui"
import { useDataFetching } from "@/shared/hooks";
import { depart_edit_style } from "../styles";


export const DepartmentEditPage = () => {

    const { data, loading, error, refetch } = useDataFetching({
        fetchFn:departmentApi.getDeptList
    })



    const renderDepartmentList = () => {
        if (loading) {
            return (
                <div className={depart_edit_style.loading}>
                    <div className={depart_edit_style.loadingSpinner}></div>
                    <p>데이터를 불러오는 중입니다...</p>
                </div>
            )
        }

        if (error) {
            return (
                <div className={depart_edit_style.error}>
                    <p>오류: {error}</p>
                    <button className={depart_edit_style.retryButton} onClick={() => void refetch()}>
                        다시 시도
                    </button>
                </div>
            )
        }

        if (data.length === 0) {
            return (
                <div className={depart_edit_style.emptyState}>
                    <p>표시할 학과 정보가 없습니다.</p>
                </div>
            )
        }

        return (
            <div className={depart_edit_style.facultyList}>
                {
                    data.map((dept) => (
                        <DepartmentListSection key={`${dept.parent_type}-${dept.parent_id}`} department={dept} />
                    ))}
            </div>
        )
    }

    return <div className="department-list-container">{renderDepartmentList()}</div>
}

