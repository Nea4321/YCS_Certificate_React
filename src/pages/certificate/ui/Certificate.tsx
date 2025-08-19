import { useParams, useNavigate } from "react-router-dom"
import { useDataFetching } from "@/shared"
import { certificateApi } from "@/entities"
import { CertificateDetail } from "@/widgets/certificate"
import { certificateStyles } from "../styles"

/**
 * 자격증 상세 정보 페이지 접근 컴포넌트
 * 쿼리스트링의 id 값을 읽어 해당하는 자격증의 정보를 조회하고,
 * 로딩,에러,데이터없음,정상 상태에 따른 UI를 렌더링 한다
 *
 * - id가 없으면 홈('/')으로 리다이렉트
 * - 정상적으로 접근했다면 선택한 자격증의 상세페이지로 리다이렉트
 * @component
 *
 * @example
 * <Route path="/certificate/:id" element={<CertificatePage />} />
 */
export const Certificate = () => {
    /**URL 파라미터에서 id 정보를 추출하는 hooks*/
    const { id } = useParams<{ id: string }>()

    /**라우팅 경로 제어 useNavigate hooks*/
    const navigate = useNavigate()

    /**자격증 데이터를 가져오고 로딩, 에러, 재요청 기능을 제공하는 hooks
     * - 해당 자격증의 id를 숫자로 변환하고 certificateApi.getCertData에 전달하고
     *   해당 자격증의 데이터를 API에 비동기 요청
     * - 요청 상태(loading, error)와 데이터(data)를 관리하고
     *   필요 시 refetch를 호출해 API 재요청 가능
     *
     * @property {object} data - 요청 성공 시 받아온 자격증 상세 데이터
     * @property {boolean} loading - 요청이 진행 중인지 여부
     * @property {string|null} error - 요청 실패 시의 에러 메시지
     * @property {() => Promise<void>} refetch - 데이터를 다시 요청하는 함수
     */
    const { data, loading, error, refetch } = useDataFetching({
        fetchFn: () => certificateApi.getCertData(Number.parseInt(id!)),
    })

    // URL 파라미터가 없으면 홈으로 리다이렉트
    if (!id) {
        navigate("/", { replace: true })
        return null
    }

    /**현재 상태(로딩,에러,데이터없음,정상)에 따라 UI 렌더링
     *
     * @return 로딩/에러/데이터없음/정상 UI 중 하나를 반환
     */
    const renderContent = () => {
        if (loading) {
            return (
                <div className={certificateStyles.loading}>
                    <div className={certificateStyles.loadingSpinner}></div>
                    <p>자격증 정보를 불러오는 중입니다...</p>
                </div>
            )
        }

        if (error) {
            return (
                <div className={certificateStyles.error}>
                    <p>오류: {error}</p>
                    <button className={certificateStyles.retryButton} onClick={() => void refetch()}>
                        다시 시도
                    </button>
                </div>
            )
        }

        if (!data) {
            return (
                <div className={certificateStyles.notFound}>
                    <h2>자격증 정보를 찾을 수 없습니다</h2>
                    <p>요청하신 자격증 정보가 존재하지 않습니다.</p>
                    <button className={certificateStyles.backButton} onClick={() => navigate("/")}>
                        홈으로 돌아가기
                    </button>
                </div>
            )
        }

        return <CertificateDetail certificate={data} />
    }

    return (
        <div className={certificateStyles.certificateContainer}>
            <div className={certificateStyles.pageHeader}>
                <button onClick={() => navigate(-1)} className={certificateStyles.backButton}>
                    ← 뒤로가기
                </button>
            </div>
            {renderContent()}
        </div>
    )
}