import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { axiosApi } from "@/shared/api/axios-api"
import { SearchResultList } from "./ui"
import { searchStyles } from "./styles"
import type { Certificate } from "@/entities/certificate/model/types"
import { getChoseong, disassemble } from "es-hangul";

export default function SearchResultPage() {
    const [searchParams] = useSearchParams()
    const keyword = searchParams.get("keyword") || ""
    const [results, setResults] = useState<Certificate[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axiosApi.get(`/api/cert/list`)
                const data: Certificate[] = response.data

                // es-hangul 초성/중성/종성 단위로 완전히 분리
                const deKeyword = [...disassemble(keyword)].join("")

                // es-hangul 초성+일반 포함 필터링
                const filtered = data.filter(cert => {
                    const name = cert.certificate_name
                    const choseong = getChoseong(name)
                    return (
                        name.includes(keyword) || // 일반 포함
                        name.toLowerCase().includes(keyword.toLowerCase()) || // 영문
                        choseong.startsWith(deKeyword) //초성
                    )
                })
                setResults(filtered)
            } catch (error) {
                console.error("검색 에러", error)
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
