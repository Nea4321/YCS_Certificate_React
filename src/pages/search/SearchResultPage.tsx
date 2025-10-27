import { useNavigate, useSearchParams } from "react-router-dom"
import {useEffect, useMemo, useState} from "react"
import { axiosApi } from "@/shared/api/axios-api"
import { SearchResultList } from "./ui"
import { searchStyles } from "./styles"
import type { Certificate } from "@/entities/certificate/model/types"
import { getChoseong, disassemble } from "es-hangul"
import { certificateTags, loadCertTagMap } from "@/entities/certificate";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store/store";
import { TagFilterBar } from "@/shared/ui/tag/TagFilterBar.tsx"

/**검색 목록 페이지 컴포넌트
 * - 쿼리스트링의 keyword를 가져와서 사용한다
 * - 만약 keyword의 첫 글자가 '#'라면 태그를 기준으로 검색
 * - 일반 검색일 경우 DB에서 가져온 모든 자격증 목록 중 keyword가 포함된 자격증들을 results 상태를 변경하여 전달,
 *   이후 SearchResultList에 results를 전달하여 화면에 표시
 *
 * @component
 */
export default function SearchResultPage() {
    const [searchParams] = useSearchParams()
    const rawKeyword = searchParams.get("keyword") || ""
    const keyword = decodeURIComponent(rawKeyword).trim()
    const [results, setResults] = useState<Certificate[]>([])
    const navigate = useNavigate()

    const tagList = useSelector((s: RootState) => s.tag.list);
    const tagNameToId = useMemo(() => {
        const m = new Map<string, number>();
        tagList.forEach(t => m.set(t.tag_Name, t.tag_id));
        return m;
    }, [tagList]);

    /**사용자가 검색을 제출하면 실행하는 useEffect
     * - 모든 자격증 정보를 불러온다
     * - 태그 검색, 일반 검색의 조건을 검사한다
     *
     * @returns results가 0이라면 검색 결과가 없습니다
     *  results가 0이 아니라면 <SearchResultList results={results} />
     *
     */
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const { data } = await axiosApi.get<Certificate[]>(`/api/cert/list`);
                loadCertTagMap(data);
                const deKeyword = [...disassemble(keyword)].join("");

                if (keyword.startsWith("#")) {
                    const raw = keyword.slice(1).trim();

                    const maybeNum = Number(raw);
                    const tagId =
                        (Number.isFinite(maybeNum) && maybeNum > 0 ? maybeNum : undefined) ??
                        tagNameToId.get(raw);
                    if (!tagId) {
                        setResults([]);
                        return;
                    }

                    const matchedCertIds = Object.entries(certificateTags)
                        .filter(([, ids]) => (ids as number[]).includes(tagId))
                        .map(([id]) => Number(id));

                    setResults(data.filter(c => matchedCertIds.includes(c.certificate_id)));
                    return;
                }

                const filtered = data.filter(cert => {
                    const name = cert.certificate_name
                    const choseong = getChoseong(name)
                    return (
                        name.includes(keyword) ||
                        name.toLowerCase().includes(keyword.toLowerCase()) ||
                        choseong.includes(deKeyword)
                    )
                })
                setResults(filtered)
            } catch (error) {
                console.error("검색 에러", error)
                setResults([])
            }
        }

        fetchResults()
    }, [keyword])

    return (
        <div>
            <div className={searchStyles.pageHeader}>
                <button onClick={() => navigate(-1)} className={searchStyles.backButton}>
                    ← 뒤로가기
                </button>
            </div>

            <div className={searchStyles.filterWrap}>
                <TagFilterBar closeOnTagClick={true} />
            </div>

            {results.length === 0 ? (
                <div className={searchStyles.noResultWrapper}>
                    <h2>검색 결과가 없습니다</h2>
                    <button className={searchStyles.backButton} onClick={() => navigate(-1)}>
                        ← 뒤로가기
                    </button>
                </div>
            ) : (
                <SearchResultList results={results} />
            )}
        </div>
    )
}
