import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { axiosApi } from "@/shared/api/axios-api"
import { SearchResultList } from "./ui"
import { searchStyles } from "./styles"
import type { Certificate } from "@/entities/certificate/model/types"
import { getChoseong, disassemble } from "es-hangul";
import { certificateTags } from "@/entities/certificate"

/**검색 목록 페이지 컴포넌트
 * - 쿼리스트링의 keyword를 가져와서 사용한다
 * - 만약 keyword의 첫 글자가 '#'라면 태그를 기준으로 검색
 * - 일반 검색일 경우 DB에서 가져온 모든 자격증 목록 중 keyword가 포함된 자격증들을 results 상태를 변경하여 전달,
 *   이후 SearchResultList에 results를 전달하여 화면에 표시
 *
 * @component
 */
export default function SearchResultPage() {
    const [searchParams] = useSearchParams() // 쿼리 매개변수에 대한 데이터를 읽고 수정하는 데 사용되는 훅
    const rawKeyword = searchParams.get("keyword") || "" // searchParams의 keyword 값을 받는 변수
    const keyword = decodeURIComponent(rawKeyword).trim() // URL 인코딩된 값 디코딩
    const [results, setResults] = useState<Certificate[]>([]) // 검색 목록에 보여줘야 할 자격증의 상태 관리
    const navigate = useNavigate() // 리다이렉트를 위한 훅

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
                const response = await axiosApi.get(`/api/cert/list`)
                const data: Certificate[] = response.data
                const deKeyword = [...disassemble(keyword)].join("")

                // 1. 태그 검색 (#전기 등)
                if (keyword.startsWith("#")) {
                    const tagQuery = keyword.slice(1).trim()
                    // certificateTags 기반으로 태그에 해당하는 자격증명 목록
                    const matchedCertNames = Object.entries(certificateTags)
                        .filter(([, tags]) => tags.includes(tagQuery))
                        .map(([name]) => name)
                    // 실제 API에서 가져온 데이터에서 이름 일치하는 자격증만 필터링
                    const filteredByTag = data.filter(cert => matchedCertNames.includes(cert.certificate_name))

                    setResults(filteredByTag)
                    return
                }

                // 2. 일반 검색
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
    }, [keyword]) //  useEffect 재실행

    if (results.length === 0) {
        return (
            <div className={searchStyles.noResultWrapper}>
                <h2>검색 결과가 없습니다</h2>
                <button className={searchStyles.backButton} onClick={() => navigate(-1)}>
                    ← 뒤로가기
                </button>
            </div>
        )
    }

    return (
        <div>
            <div className={searchStyles.pageHeader}>
                <button onClick={() => navigate(-1)} className={searchStyles.backButton}>
                    ← 뒤로가기
                </button>
            </div>
            <SearchResultList results={results} />
        </div>
    )
}
