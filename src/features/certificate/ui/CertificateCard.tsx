import type React from "react"
import type { Certificate } from "@/entities/certificate/model/types.ts"
import { getImageForCertificate } from "@/entities/certificate/lib/getImageForCertificate.ts"
import { mainStyles } from "../../../pages/main/styles"
import { Link } from "react-router-dom"
import { certificateTags } from "@/entities/certificate"
import { tagColors } from "@/entities/certificate/model/tagColors"
import { useNavigate } from "react-router-dom"

interface Props {
    cert: Certificate
}

export const CertificateCard: React.FC<Props> = ({ cert }) => {
    const imageUrl = getImageForCertificate(cert.certificate_name)
    const navigate = useNavigate()

    return (
        <Link to={`/certificate/${cert.certificate_id}`} className={mainStyles.certificateLink}>
            <div className={mainStyles.certificateCard}>
                <div className={mainStyles.cardImageBox}>
                    <img
                        src={imageUrl || "/placeholder.svg"}
                        alt={`${cert.certificate_name} 이미지`}
                        className={mainStyles.cardImage}
                    />
                </div>
                <div className={mainStyles.cardTextBox}>
                    <h4 className={mainStyles.cardTitle}>{cert.certificate_name}</h4>
                </div>
                {/* 태그 표시 부분 */}
                <div className={mainStyles.tagBox}>
                    {certificateTags[cert.certificate_name]?.map((tag) => (
                        <span
                            key={tag}
                            className={mainStyles.tag}
                            style={{ backgroundColor: tagColors[tag] || "#eee" }}
                            onClick={(e) => {
                                e.stopPropagation() // 카드 클릭 방지용
                                e.preventDefault() // 링크 동작 방지용
                                navigate(`/search?keyword=${encodeURIComponent('#' + tag)}`)// 태그로 검색 이동
                            }}
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    )
}

export default CertificateCard
