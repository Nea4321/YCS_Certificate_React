import { useSearchParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { axiosApi } from "@/shared/api/axios-api"

interface Certificate {
    certificate_id: number
    certificate_name: string
}

export default function SearchResult() {
    const [searchParams] = useSearchParams()
    const keyword = searchParams.get("keyword") || ""
    const [results, setResults] = useState<Certificate[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [redirecting, setRedirecting] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axiosApi.get(`/api/cert/search?keyword=${keyword}`)
                const data: Certificate[] = response.data

                if (data.length === 1) {
                    setRedirecting(true)
                    navigate(`/certificate/${data[0].certificate_id}`)
                } else {
                    setResults(data)
                }
            } catch (error) {
                console.error("검색 에러", error)
                setResults([]) // 오류 시에도 빈 배열로 설정
            } finally {
                setLoading(false)
            }
        }

        if (keyword) {
            fetchResults()
        }
    }, [keyword, navigate])

    if (loading) return <p>로딩 중</p>
    if (redirecting) return <p>페이지로 이동 중</p>
    if (results === null) return null
    if (results.length === 0) return <p>검색 결과 없음</p>

    return (
        <div style={{ padding: "20px" }}>
            <h2>"{keyword}" 검색 결과</h2>
            <ul>
                {results.map((cert) => (
                    <li key={cert.certificate_id}>{cert.certificate_name}</li>
                ))}
            </ul>
        </div>
    )
}
