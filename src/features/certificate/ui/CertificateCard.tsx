import type React from "react"
import type { Certificate } from "@/entities/certificate/model/types.ts"
import { getImageForCertificate } from "@/entities/certificate/lib/getImageForCertificate.ts"
import { mainStyles } from "../../../pages/main/styles"
import { Link } from "react-router-dom"
import { certificateTags } from "@/entities/certificate"
import { useNavigate } from "react-router-dom"
import { TagBadge } from "@/shared/ui/tag"

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
                    {(certificateTags[cert.certificate_id] ?? []).slice(0, 3).map((tag) => (
                        <TagBadge
                            key={tag}
                            tag={tag}
                            onClick={(e) => {
                                e.stopPropagation();  // 링크 클릭 막기
                                e.preventDefault();
                                navigate(`/search?keyword=${encodeURIComponent("#" + tag)}`);
                            }}
                        />
                    ))}
                </div>
            </div>
        </Link>
    )
}

export default CertificateCard
