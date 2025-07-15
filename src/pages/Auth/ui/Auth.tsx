"use client"
import { useState } from "react"
import { Login } from "./Login"
import { Signup } from "./Signup"
import { authStyles } from "../styles"

export const Auth = () => {
    const [currentView, setCurrentView] = useState<"login" | "signup">("login")

    const switchToSignup = () => setCurrentView("signup")
    const switchToLogin = () => setCurrentView("login")

    return (
        <div className={authStyles.authContainer}>
            {currentView === "login" ? (
                <Login onSwitchToSignup={switchToSignup} />
            ) : (
                <Signup onSwitchToLogin={switchToLogin} />
            )}
        </div>
    )
}
