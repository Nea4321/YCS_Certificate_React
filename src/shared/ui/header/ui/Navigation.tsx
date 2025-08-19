import { Link, useLocation } from "react-router-dom"
import { navigationStyles } from "./styles"
import {useSelector} from "react-redux";
import {RootState} from "@/app/store";

export const Navigation = () => {

  const location = useLocation()
    // 리덕스에서 이메일 가져옴
    const email = useSelector((state: RootState) => state.user.userEmail)


    const isActivePage = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path)
    }

  return (
    <nav className={navigationStyles.desktopNav}>
      <Link
        to="/"
        className={`${navigationStyles.navLink} ${
          isActivePage("/") && (!isActivePage("/departments") && !isActivePage("/auth") && !isActivePage("/dashboard") && !isActivePage("/cbt")) ? navigationStyles.activeLink : ""
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
        {/* redux에 email 있으면 로그인 버튼 표시
            없으면 로그아웃 버튼 표시*/}
        {!email ? (
        <Link
            to="/auth"
            className={`${navigationStyles.navLink} ${
                isActivePage("/auth") ? navigationStyles.activeLink : ""}`}
        >
            로그인
        </Link>
        ) : (
            <Link
                to="/logout"
                className={`${navigationStyles.navLink}`}
            >
                로그아웃
            </Link>

        )}
        {email && (
        <Link
            to="/dashboard"
            className={`${navigationStyles.navLink} ${
                isActivePage("/dashboard") ? navigationStyles.activeLink : ""}`}

        >
            <div>{email}</div>
        </Link>
        )}

    </nav>
  )
}
