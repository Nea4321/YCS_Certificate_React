"use client"

import { Link, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { mobileMenuStyles } from "./styles"
import {useSelector} from "react-redux";
import {RootState} from "@/app/store";

interface MobileMenuProps {
  isOpen: boolean
  onToggle: () => void
}

export const MobileMenu = ({ isOpen, onToggle }: MobileMenuProps) => {
  const location = useLocation()
  const email = useSelector((state: RootState) => state.user.userEmail)
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
              to="/cbt"
              className={`${mobileMenuStyles.mobileNavLink} ${
                  isActivePage("/cbt") ? mobileMenuStyles.activeLink : ""
              }`}
              onClick={handleLinkClick}
          >
            CBT
          </Link>

          {!email ? (
          <Link
              to="/auth"
              className={`${mobileMenuStyles.mobileNavLink}${
                  isActivePage("/auth") ? mobileMenuStyles.activeLink : ""
              }`}
              onClick={handleLinkClick}
          >
            로그인
          </Link>
          ):(
              <Link
                  to="/logout"
                  className={`${mobileMenuStyles.mobileNavLink}${
                      isActivePage("/logout") ? mobileMenuStyles.activeLink : ""
                  }`}
                  onClick={handleLinkClick}
              >
                로그아웃
              </Link>
          )}
          {email && (
              <Link
                  to="/dashboard"
                  className={`${mobileMenuStyles.mobileNavLink}${
                      isActivePage("/dashboard") && !isActivePage("/") ? mobileMenuStyles.activeLink : ""
                  }`}
                  onClick={handleLinkClick}
              >
                <div>{email}</div>
              </Link>
          )}

        </div>
      </div>

      {/* 모바일 메뉴 오버레이 */}
      {isOpen && <div className={mobileMenuStyles.mobileMenuOverlay} onClick={onToggle} />}
    </>
  )
}
