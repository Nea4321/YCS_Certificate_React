import type React from "react"
import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { searchBarStyles } from "./styles"
import { useNavigate } from "react-router-dom"
import { AutocompleteList } from "@/shared"
import { axiosApi } from "@/shared/api/axios-api"

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [allCertificates, setAllCertificates] = useState<{ certificate_id: number, certificate_name: string }[]>([])
  const navigate = useNavigate()

  useEffect(() => { //초기에 전체 자격증 받아오기
    axiosApi.get("/api/cert/list").then(res => {
      setAllCertificates(res.data)
    }).catch(err => {
      console.error("자격증 목록 불러오기 실패:", err)
    })
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery)}`);
    }
  }

  return (
    <div className={`${searchBarStyles.searchContainer} ${isSearchFocused ? searchBarStyles.searchFocused : ""}`}>
      <form onSubmit={handleSearch} className={searchBarStyles.searchForm}>
        <Search className={searchBarStyles.searchIcon} size={20} />
        <input
          type="text"
          placeholder="자격증을 검색해보세요..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
          // 자동완성 클릭이 먼저 가능하도록 딜레이
          className={searchBarStyles.searchInput}
          autoComplete="off" // 이전 검색기록 비활성화
          spellCheck={false} // 맞춤법 검사 비활성화
          autoCorrect="off" // 자동 고침 비활성화
          autoCapitalize="off" // 첫 글자 자동 대문자 비활성화
        />
      </form>
      {isSearchFocused && (
          <AutocompleteList
              query={searchQuery}
              certificates={allCertificates}
              onSelect={() => setSearchQuery("")}
          />
      )}
    </div>

  )
}
