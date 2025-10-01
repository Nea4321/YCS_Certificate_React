import { useNavigate } from "react-router-dom"
import styles from "./styles/autocomplete.module.css"
import { getChoseong, disassemble } from "es-hangul"
import { certificateTags } from "@/entities/certificate"
import { getTagColor, getTagName } from "@/entities/certificate/model/tagMeta";

/**AutocompleteList에 제출되는 props
 *
 * @property {string} query - 사용자가 검색창에 입력한 내용
 * @property {certificate_id: number; certificate_name: string}[] certificates - DB에서 불러온 모든 자격증 목록
 * @property {() => void} onSelect - 검색창을 초기화하는 함수
 */
interface Props {
    query: string
    certificates: { certificate_id: number; certificate_name: string }[]
    onSelect: () => void
}

/**검색창 자동완성 컴포넌트
 *
 * - 초성 검색으로도 자동완성이 가능하며 자격증 이름과 해당하는 태그 UI를 배치했다
 * - 자동완성은 한 번에 5개까지 나올 수 있다
 * - 자동완성으로 표시된 자격증을 클릭하면 자격증 상세 페이지로 리다이렉트 된다
 * - 자동완성으로 표시된 태그를 클릭하면 해당 태그를 지닌 자격증들로 구성된 목록 페이지로 리다이렉트 된다
 *
 * @component
 */
export const AutocompleteList = ({ query, certificates, onSelect }: Props) => {
    const navigate = useNavigate();

    if (!query.trim()) return null;

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
            {filtered.map((cert) => (
                <li
                    key={cert.certificate_id}
                    className={styles.autocompleteItem}
                    onMouseDown={() => {
                        navigate(`/certificate/${cert.certificate_id}`);
                        onSelect();
                    }}
                >
                    <div className={styles.itemContent}>
                        <span className={styles.certName}>{cert.certificate_name}</span>

                        <div className={styles.tagBox}>
                            {(certificateTags[cert.certificate_id] ?? []).map((tagId: number) => {
                                const name = getTagName(tagId);
                                if (!name) return null;

                                return (
                                    <span
                                        key={tagId}
                                        className={styles.tag}
                                        style={{backgroundColor: getTagColor(tagId) ?? "#ccc"}}
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            navigate(`/search?keyword=%23${encodeURIComponent(name)}`);
                                            onSelect();}}
                                    >
                                        #{name}
                                    </span>
                                );})}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}