import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { searchBarStyles } from "./styles"
import { useNavigate } from "react-router-dom"

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log("검색:", searchQuery)
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
          onBlur={() => setIsSearchFocused(false)}
          className={searchBarStyles.searchInput}
        />
      </form>
    </div>
  )
}
