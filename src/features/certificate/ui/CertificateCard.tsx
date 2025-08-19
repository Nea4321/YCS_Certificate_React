import type React from "react"
import type { Certificate } from "@/entities/certificate/model/types.ts"
import { getImageForCertificate } from "@/entities/certificate/lib/getImageForCertificate.ts"
import { mainStyles } from "../../../pages/main/styles"
import { Link } from "react-router-dom"
import { certificateTags } from "@/entities/certificate"
import { useNavigate } from "react-router-dom"
import { TagBadge } from "@/shared/ui/tag"

/**CertificateCard에 전달되는 props
 *
 * @property {Certificate} cert - 부모에게 전달받은 현재 순환 중인 Certificate 객체
 */
interface Props {
    cert: Certificate
}


/**부모에게 전달받은 Certificate 객체를 연결된 태그와 함께 렌더링하는 컴포넌트
 * - 해당 자격증의 키워드에 해당하는 이미지를 imageUrl에 저장하고 사용
 * - 키워드가 없는 자격증이라면 default 이미지를 저장
 * - 해당 자격증 카드를 클릭하면 자격증 상세 페이지(/certificate/id)로 접근 가능
 * - 카드 하단에는 태그가 존재하고 태그를 클릭하면 해당 태그를 지닌 모든 certificateCard를 화면에 표시
 *
 * @component
 */
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
