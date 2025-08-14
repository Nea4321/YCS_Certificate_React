import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { axiosApi } from "@/shared/api/axios-api"
import { SearchResultList } from "./ui"
import { searchStyles } from "./styles"
import type { Certificate } from "@/entities/certificate/model/types"
import { getChoseong, disassemble } from "es-hangul"
import { certificateTags } from "@/entities/certificate"
import { TagFilterBar } from "@/shared/ui/header/ui/TagFilterBar"

export default function SearchResultPage() {
    const [searchParams] = useSearchParams()
    const rawKeyword = searchParams.get("keyword") || ""
    const keyword = decodeURIComponent(rawKeyword).trim()
    const [results, setResults] = useState<Certificate[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axiosApi.get(`/api/cert/list`)
                const data: Certificate[] = response.data
                const deKeyword = [...disassemble(keyword)].join("")

                if (keyword.startsWith("#")) {
                    const tagQuery = keyword.slice(1).trim()
                    const matchedCertIds = Object.entries(certificateTags)
                        .filter(([, tags]) => tags.includes(tagQuery))
                        .map(([id]) => Number(id))

                    const filteredByTag = data.filter(cert =>
                        matchedCertIds.includes(cert.certificate_id)
                    )
                    setResults(filteredByTag)
                    return
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
