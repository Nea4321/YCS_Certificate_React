"use client"

import { Link, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { mobileMenuStyles } from "./styles"

interface MobileMenuProps {
  isOpen: boolean
  onToggle: () => void
}

export const MobileMenu = ({ isOpen, onToggle }: MobileMenuProps) => {
  const location = useLocation()

  const isActivePage = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path)
  }

  const handleLinkClick = () => {
    onToggle() // 메뉴 닫기
  }

  return (
    <>
      {/* 모바일 메뉴 버튼 */}
      <button className={mobileMenuStyles.mobileMenuButton} onClick={onToggle} aria-label="메뉴 열기">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 모바일 메뉴 */}
      <div className={`${mobileMenuStyles.mobileMenu} ${isOpen ? mobileMenuStyles.mobileMenuOpen : ""}`}>
        <div className={mobileMenuStyles.mobileMenuContent}>
          <Link
            to="/"
            className={`${mobileMenuStyles.mobileNavLink} ${
              isActivePage("/") && !isActivePage("/departments") ? mobileMenuStyles.activeLink : ""
            }`}
            onClick={handleLinkClick}
          >
            홈
          </Link>

          <Link
            to="/departments"
            className={`${mobileMenuStyles.mobileNavLink} ${
              isActivePage("/departments") ? mobileMenuStyles.activeLink : ""
            }`}
            onClick={handleLinkClick}
          >
            학과별 자격증
          </Link>

          <Link
              to="/auth"
              className={`${mobileMenuStyles.mobileNavLink}${
                  isActivePage("/departments") ? mobileMenuStyles.activeLink : ""
              }`}
              onClick={handleLinkClick}
          >
            로그인
          </Link>

        </div>
      </div>

      {/* 모바일 메뉴 오버레이 */}
      {isOpen && <div className={mobileMenuStyles.mobileMenuOverlay} onClick={onToggle} />}
    </>
  )
}
