import { useNavigate } from "react-router-dom"
import styles from "./styles/autocomplete.module.css"
import { getChoseong, disassemble } from "es-hangul"
import { certificateTags } from "@/entities/certificate"
import { tagColors } from "@/entities/certificate/model/tagColors"

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
            choseong.includes(deQuery) || ``
        )
    }).slice(0, 5) // 검색바 표시는 5개 까지

    if (filtered.length === 0) return null

    return (
        <ul className={styles.autocompleteList}>
            {filtered.map(cert => {
                const tags = certificateTags[cert.certificate_name] || []

                return (
                    <li
                        key={cert.certificate_id}
                        className={styles.autocompleteItem}
                        onMouseDown={() => {
                            navigate(`/certificate/${cert.certificate_id}`)
                            onSelect()
                        }}
                    >
                        {/* 양쪽으로 자격증 이름 / 태그 배치 */}
                        <div className={styles.itemContent}>
                            <span className={styles.certName}>{cert.certificate_name}</span>
                            <div className={styles.tagBox}>
                                {tags.map(tag => (
                                    <span
                                        key={tag}
                                        className={styles.tag}
                                        style={{ backgroundColor: tagColors[tag] || "#ccc" }}
                                        onMouseDown={(e) => {
                                            e.stopPropagation() // 자격증 카드 클릭 방지
                                            navigate(`/search?keyword=%23${encodeURIComponent(tag)}`)
                                            onSelect()
                                        }}
                                    >
                            #{tag}
                        </span>
                                ))}
                            </div>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}
