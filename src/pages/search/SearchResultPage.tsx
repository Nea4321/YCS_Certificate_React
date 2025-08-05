import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { axiosApi } from "@/shared/api/axios-api"
import { SearchResultList } from "./ui"
import { searchStyles } from "./styles"
import type { Certificate } from "@/entities/certificate/model/types"
import { getChoseong, disassemble } from "es-hangul";
import { certificateTags } from "@/entities/certificate"

export default function SearchResultPage() {
    const [searchParams] = useSearchParams()
    const rawKeyword = searchParams.get("keyword") || ""
    const keyword = decodeURIComponent(rawKeyword).trim() // URL 인코딩된 값 디코딩
    const [results, setResults] = useState<Certificate[]>([])
    const navigate = useNavigate()

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
