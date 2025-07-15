import { Link, useLocation } from "react-router-dom"
import { navigationStyles } from "./styles"

export const Navigation = () => {
  const location = useLocation()

  const isActivePage = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path)
  }

  return (
    <nav className={navigationStyles.desktopNav}>
      <Link
        to="/"
        className={`${navigationStyles.navLink} ${
          isActivePage("/") && !isActivePage("/departments") ? navigationStyles.activeLink : ""
        }`}
      >
        홈
      </Link>
      <Link
        to="/departments"
        className={`${navigationStyles.navLink} ${isActivePage("/departments") ? navigationStyles.activeLink : ""}`}
      >
        학과별 자격증
      </Link>
        <Link
            to="/auth"
            className={`${navigationStyles.navLink} ${
                isActivePage("/auth") ? navigationStyles.activeLink : ""}`}
        >
            로그인
        </Link>
    </nav>
  )
}
