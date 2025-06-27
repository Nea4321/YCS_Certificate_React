import type React from "react"
import type { Certificate } from "@/entities/certificate/model/types.ts"
import { getImageForCertificate } from "@/entities/certificate/lib/getImageForCertificate.ts"
import { mainStyles } from "../../../pages/main/styles"
import { Link } from "react-router-dom"

interface Props {
    cert: Certificate
}

export const CertificateCard: React.FC<Props> = ({ cert }) => {
    const imageUrl = getImageForCertificate(cert.certificate_name)

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
            </div>
        </Link>
    )
}

export default CertificateCard
