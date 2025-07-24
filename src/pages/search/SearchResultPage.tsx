import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { axiosApi } from "@/shared/api/axios-api"
import { SearchResultList } from "./ui"
import { searchStyles } from "./styles"
import type { Certificate } from "@/entities/certificate/model/types"

export default function SearchResultPage() {
    const [searchParams] = useSearchParams()
    const keyword = searchParams.get("keyword") || ""
    const [results, setResults] = useState<Certificate[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axiosApi.get(`/api/cert/search?keyword=${keyword}`)
                const data: Certificate[] = response.data
                setResults(data)
            } catch (error) {
                console.error("검색 오류", error)
                setResults([])
            }
        }

        if (keyword) {
            fetchResults() }
    }, [keyword])

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
