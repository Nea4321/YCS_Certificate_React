import { useNavigate } from "react-router-dom"
import styles from "./styles/autocomplete.module.css"

interface Props {
    query: string
    certificates: { certificate_id: number; certificate_name: string }[]
    onSelect: () => void
}

export const AutocompleteList = ({ query, certificates, onSelect }: Props) => {
    const navigate = useNavigate()

    if (!query.trim()) return null

    const lowerQuery = query.toLowerCase()

    const filtered = certificates.filter(cert => {
        const name = cert.certificate_name
        return (
            name.includes(query) ||
            name.toLowerCase().includes(lowerQuery) ||``
        )
    }).slice(0, 5)

    if (filtered.length === 0) return null

    return (
        <ul className={styles.autocompleteList}>
            {filtered.map(cert => (
                <li
                    key={cert.certificate_id}
                    className={styles.autocompleteItem}
                    onMouseDown={() => {
                        navigate(`/certificate/${cert.certificate_id}`)
                        onSelect()
                    }}
                >
                      {cert.certificate_name}
                </li>
            ))}
        </ul>
    )
}
