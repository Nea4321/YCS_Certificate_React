import { useState } from "react"
import { Login } from "./ui/Login"
import { Signup } from "./ui/Signup"
import { authStyles } from "./styles"
import {useNavigate} from "react-router-dom";

/**
 * 로그인,회원가입 페이지 모음.
 *
 * 버튼을 눌러서 auth 페이지에 보여지는걸 다르게 해줌.
 * */
export const Auth = () => {
    const [currentView, setCurrentView] = useState<"login" | "signup">("login")

    const switchToSignup = () => setCurrentView("signup")
    const switchToLogin = () => setCurrentView("login")
    const navigate = useNavigate()

    return (
        <div className={authStyles.authContainer}>
            <button onClick={() => navigate(-1)} className={authStyles.backButton}>
                ← 뒤로가기
            </button>

            {currentView === "login" ? (
                <Login onSwitchToSignup={switchToSignup} />
            ) : (
                <Signup onSwitchToLogin={switchToLogin} />
            )}
        </div>
    )
}
