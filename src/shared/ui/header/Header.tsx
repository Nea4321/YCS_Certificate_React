import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Logo, SearchBar, Navigation, MobileMenu } from "./ui"
import { headerStyles } from "./styles"
import {useLocation} from "react-router-dom";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const lastScrollY = useRef(0)

  // 스크롤 감지 및 헤더 숨기기/보이기
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // 스크롤 위치에 따른 배경 변화
      setIsScrolled(currentScrollY > 10)

      // 헤더 숨기기/보이기 로직
      if (currentScrollY > 100) {
        // 100px 이상 스크롤했을 때만 동작
        if (currentScrollY > lastScrollY.current && currentScrollY > 70) {
          // 아래로 스크롤 - 헤더 숨기기
          setIsHidden(true)
        } else if (currentScrollY < lastScrollY.current) {
          // 위로 스크롤 - 헤더 보이기
          setIsHidden(false)
        }
      } else {
        // 페이지 상단 근처에서는 항상 헤더 보이기
        setIsHidden(false)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  // 로그인 화면이면 헤더 없음
  if(location.pathname === "/auth") {return null}

  return (
    <header
      className={`${headerStyles.header} ${isScrolled ? headerStyles.scrolled : ""} ${isHidden ? headerStyles.hidden : ""}`}
    >
      <div className={headerStyles.container}>
        <Logo />
        <SearchBar />
        <Navigation />
        <MobileMenu isOpen={isMobileMenuOpen} onToggle={toggleMobileMenu} />
      </div>
    </header>
  )
}
