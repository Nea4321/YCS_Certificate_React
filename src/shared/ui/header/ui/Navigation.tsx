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
          isActivePage("/") && !isActivePage("/departments") && !isActivePage("/cbt") ? navigationStyles.activeLink : ""
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
            to="/cbt"
            className={`${navigationStyles.navLink} ${isActivePage("/cbt") ? navigationStyles.activeLink : ""}`}
        >
            CBT
        </Link>
    </nav>
  )
}
