import type React from "react"
import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { searchBarStyles } from "./styles"
import { useNavigate } from "react-router-dom"
import { AutocompleteList } from "@/shared"
import { axiosApi } from "@/shared/api/axios-api"

/**헤더 자격증 검색 컴포넌트
 *
 * - 페이지에 처음 접근하면 DB에 저장된 모든 자격증을 불러온다
 * - 이후 사용자가 검색창에 입력한 내용은 searchQuery 상태로 관리된다
 * - 사용자가 검색을 실행하면 searchQuery의 내용을 바탕으로
 * `/search?keyword=${encodeURIComponent(searchQuery)}` 에 리다이렉트
 * - 이후 검색창은 공백으로 상태 변경
 *
 * @component
 */
export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("") // 검색 입력 상태
  const [isSearchFocused, setIsSearchFocused] = useState(false) // 포커스 상태
  // 로드한 전체 자격증(자동완성)
  const [allCertificates, setAllCertificates] = useState<{ certificate_id: number, certificate_name: string; tag: number[]}[]>([])
  const navigate = useNavigate()

  useEffect(() => { //초기에 전체 자격증 받아오기
    axiosApi.get("/api/cert/list").then(res => {
      setAllCertificates(res.data)
    }).catch(err => {
      console.error("자격증 목록 불러오기 실패:", err)
    })
  }, [])

  // 검색 제출을 위한 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("")// 검색 후 비우기
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
      {/*검색창에 포커스가 잡혀있을 경우에만 자동완성이 표시되도록 조건을 줌*/}
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
