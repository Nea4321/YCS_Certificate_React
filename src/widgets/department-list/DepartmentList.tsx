import { useState, useEffect, useCallback } from "react"
import type { Department } from "@/entities/department/model"
import { getDepartmentList } from "@/entities/department/api"
import { DepartmentCard } from "@/entities/department/ui"
import { handleApiError } from "@/shared/api"

export const DepartmentList = () => {
    const [departments, setDepartments] = useState<Department[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // fetchDepartments 함수를 useCallback으로 메모이제이션
    const fetchDepartments = useCallback(async () => {
        try {
            setLoading(true)
            setError(null) // 이전 에러 초기화
            const data = await getDepartmentList()
            setDepartments(data)
        } catch (error) {
            console.error("Error fetching departments:", error)
            setError(handleApiError(error))
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        let isMounted = true

        const fetchData = async () => {
            try {
                setLoading(true)
                const data = await getDepartmentList()

                // 컴포넌트가 여전히 마운트되어 있는지 확인
                if (isMounted) {
                    setDepartments(data)
                }
            } catch (error) {
                console.error("Error fetching departments:", error)

                // 컴포넌트가 여전히 마운트되어 있는지 확인
                if (isMounted) {
                    setError(handleApiError(error))
                }
            } finally {
                // 컴포넌트가 여전히 마운트되어 있는지 확인
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        // void 연산자를 사용하여 Promise를 명시적으로 처리
        void fetchData()

        // 클린업 함수 반환
        return () => {
            isMounted = false
        }
    }, [])

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
                    <button className="retry-button" onClick={() => void fetchDepartments()}>
                        다시 시도
                    </button>
                </div>
            )
        }

        if (departments.length === 0) {
            return (
                <div className="empty-state">
                    <p>표시할 학과 정보가 없습니다.</p>
                </div>
            )
        }

        return (
            <ul className="faculty-list">
                {departments.map((dept) => (
                    <DepartmentCard key={`${dept.parent_type}-${dept.parent_id}`} department={dept} />
                ))}
            </ul>
        )
    }

    return <div className="department-list-container">{renderContent()}</div>
}

