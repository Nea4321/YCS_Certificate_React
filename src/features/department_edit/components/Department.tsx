"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useDataFetching } from "@/shared"
import { departmentApi } from "@/entities"
import { DepartmentDetail } from "@/widgets/department"
import { departmentStyles } from "@/pages/department_edit"

/**
 * 학과 상세 정보 페이지 접근 컴포넌트
 * 쿼리스트링의 id 값을 읽어 해당하는 학과의 정보를 조회하고,
 * 로딩,에러,데이터없음,정상 상태에 따른 UI를 렌더링 한다
 *
 * - id가 없으면 학과 목록('/departments')으로 리다이렉트
 * - 정상적으로 접근했다면 선택한 학과의 상세페이지로 리다이렉트
 *
 * @component
 *
 * @example
 * <Route path="/departments/:id" element={<Department_Edit />} />
 */
export const Department = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  /**학과 데이터를 가져오고 로딩, 에러, 재요청 기능을 제공하는 hooks
   * - 해당 학과의 id를 숫자로 변환하고 departmentApi.getDeptMapData에 전달하고
   *   해당 학과의 데이터를 API에 비동기 요청
   * - 요청 상태(loading, error)와 데이터(data)를 관리하고
   *   필요 시 refetch를 호출해 API 재요청 가능
   *
   * @property {object} data - 요청 성공 시 받아온 자격증 상세 데이터
   * @property {boolean} loading - 요청이 진행 중인지 여부
   * @property {string|null} error - 요청 실패 시의 에러 메시지
   * @property {() => Promise<void>} refetch - 데이터를 다시 요청하는 함수
   */
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

  /**현재 상태(로딩,에러,데이터없음,정상)에 따라 UI 렌더링
   *
   * @return 로딩/에러/데이터없음/정상 UI 중 하나를 반환
   */
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
