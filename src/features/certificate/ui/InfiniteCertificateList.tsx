import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import type { Certificate } from "@/entities/certificate/model/types"
import { certificateApi } from "@/entities/certificate/api/certificate-api"
import { CertificateCard } from "@/features/certificate/ui/CertificateCard.tsx"
import { mainStyles } from "@/pages/main/styles"

const PAGE_SIZE = 20

/**무한 스크롤 방식으로 자격증 목록을 표시하는 컴포넌트
 * 사용자가 스크롤을 내릴 때마다 한 번에 PAGE_SIZE만큼 자격증 목록을 추가로 로드하여 화면에 표시
 *
 * - 페이지 진입 시 DB에서 모든 자격증 목록을 불러옴
 * - PAGE_SIZE만큼의 초기 자격증 목록이 표시됨
 * - 마지막 요소가 IntersectionObserver에 감지되면
 *   다음 PAGE_SIZE만큼 자격증을 추가로 로드한다
 *
 *   @constant {number} PAGE_SIZE - 한 번에 로드될 자격증 개수
 *
 *   @component
 */
export const InfiniteCertificateList: React.FC = () => {
    /**DB에서 불러온 전체 자격증 목록*/
    const [allCertificates, setAllCertificates] = useState<Certificate[]>([])
    /**현재 보여질 자격증 개수*/
    const [displayedCertificates, setDisplayedCertificates] = useState<Certificate[]>([])
    /**현재까지 로드된 페이지 번호*/
    const [page, setPage] = useState(1)
    /**스크롤 진행을 감지하기 위한 Observer*/
    const observerRef = useRef<IntersectionObserver | null>(null)

    // 첫 화면 useEfect = 페이지 진입 시 한번만 실행
    useEffect(() => {
        const controller = new AbortController()
        const fetchData = async () => {
            try {
                // DB에서 전체 자격증 목록 불러오기
                const data = await certificateApi.getCertificate(controller.signal)
                setAllCertificates(data) // 불러온 전체 목록 상태 변경
                setDisplayedCertificates(data.slice(0, PAGE_SIZE)) // 처음 화면에 PAGE_SIZE만큼 자격증 화면에 표시
            } catch (error) {
                console.error("자격증 목록을 불러오는 데 실패했습니다:", error)
            }
        }

        fetchData()
        return () => controller.abort()
    }, [])

    // 페이지 번호가 변경될 때 실행되는 useEffect
    useEffect(() => {
        if (page === 1) return // 페이지 번호가 1이라면 실행 안함

        // 증가한 페이지 번호만큼 화면에 표시될 자격증 수 증가
        setDisplayedCertificates(allCertificates.slice(0, page * PAGE_SIZE))

        setTimeout(() => {
            // 애니메이션 효과를 위한 딜레이
        }, 300)
    }, [page, allCertificates])

    // 마지막 요소가 감지되면 페이지 번호를 증가
    const observer = useCallback(
        (node: HTMLDivElement | null) => {
            if (!node) return
            if (observerRef.current) observerRef.current.disconnect()

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && displayedCertificates.length < allCertificates.length) {
                        setPage((prev) => prev + 1)
                    }
                },
                {
                    root: null,
                    rootMargin: "0px 0px 200px 0px",
                    threshold: 0.1,
                },
            )

            observerRef.current.observe(node)
        },
        [displayedCertificates, allCertificates],
    )

    return (
        <div className={mainStyles.gridContainer}>
            {displayedCertificates.map((cert, idx) => {
                const isLast = idx === displayedCertificates.length - 1
                return (
                    <div key={cert.certificate_id} ref={isLast ? observer : null}>
                        <CertificateCard cert={cert} />
                    </div>
                )
            })}
        </div>
    )
}

export default InfiniteCertificateList
