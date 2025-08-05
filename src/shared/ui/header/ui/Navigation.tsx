import { Link, useLocation } from "react-router-dom"
import { navigationStyles } from "./styles"
import {GetCookie} from "@/features/login/cookie/GetCooKie.ts";
import {DeleteCookie} from "@/features/login/cookie/DeleteCooKie.ts";

export const Navigation = () => {

  const location = useLocation()
    // 메인페이지에 이메일을 이런식으로 표시 하기위해 가져오는 임시 코드 -> 지울 예정
    const email = GetCookie("user-key");
    const logout = () => {DeleteCookie("user-key")};


    const isActivePage = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path)
    }

  return (
    <nav className={navigationStyles.desktopNav}>
      <Link
        to="/"
        className={`${navigationStyles.navLink} ${
          isActivePage("/") && !isActivePage("/departments") && !isActivePage("/auth") ? navigationStyles.activeLink : ""
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
        {/* email 값 없으면 로그인, email 값 있으면 로그아웃 표시 -> 임시 코드로 수정 예정
            현재 생각 로직 : 백엔드에서 로그인 (db에 있는거 확인) 확인하면
            유저 정보(email,이름..) 과 함께 isLogin(boolean 자료형, 로그인 여부를 알리는 변수) 를 넘겨서
            isLogin 으로 버튼 표시 판단 할 예정

            로그아웃 로직 : isLogin,백엔드에서 받아온 유저정보들 을 null로 바꾼 후 메인페이지로 이동되게 코드 만들 예정*/}
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
                to="/"
                onClick={() => {logout()}}
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
