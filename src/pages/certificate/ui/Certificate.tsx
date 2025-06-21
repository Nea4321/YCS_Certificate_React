import { useParams, useNavigate } from "react-router-dom"
import { useDataFetching } from "@/shared"
import { certificateApi } from "@/entities"
import { CertificateDetail } from "@/widgets/certificate"
import { certificateStyles } from "../styles"

export const Certificate = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const { data, loading, error, refetch } = useDataFetching({
        fetchFn: () => certificateApi.getCertData(Number.parseInt(id!)),
    })

    // URL 파라미터가 없으면 홈으로 리다이렉트
    if (!id) {
        navigate("/", { replace: true })
        return null
    }

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
