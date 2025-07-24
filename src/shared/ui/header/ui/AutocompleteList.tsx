import { useNavigate } from "react-router-dom"
import styles from "./styles/autocomplete.module.css"
import { getChoseong, disassemble } from "es-hangul"

interface Props {
    query: string
    certificates: { certificate_id: number; certificate_name: string }[]
    onSelect: () => void
}

export const AutocompleteList = ({ query, certificates, onSelect }: Props) => {
    const navigate = useNavigate()

    if (!query.trim()) return null

    const lowerQuery = query.toLowerCase()
    // es-hangul 초성,종성,종성 분리
    const deQuery = [...disassemble(query)].join("")
    // es-hangul 초성 검색
    const filtered = certificates.filter(cert => {
        const name = cert.certificate_name
        const choseong = getChoseong(name) // es-hangul 초성검색
        return (
            name.includes(query) ||
            name.toLowerCase().includes(lowerQuery) ||
            choseong.startsWith(deQuery) || ``
        )
    }).slice(0, 5) // 검색바 표시는 5개 까지

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
