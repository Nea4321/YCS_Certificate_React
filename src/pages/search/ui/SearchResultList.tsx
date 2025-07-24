import type { Certificate } from "@/entities/certificate/model/types"
import CertificateCard from "@/features/certificate/ui/CertificateCard"
import { mainStyles } from "@/pages/main/styles"

interface Props {
    results: Certificate[]
}

export const SearchResultList = ({ results }: Props) => {
    return (
        <div className={mainStyles.gridContainer}>
            {results.map(cert => (
                <CertificateCard key={cert.certificate_id} cert={cert} />
            ))}
        </div>
    )
}

export default SearchResultList
