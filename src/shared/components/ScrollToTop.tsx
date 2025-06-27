import type React from "react"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

// children을 받지 않는 컴포넌트임을 명시
export const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation()

    useEffect(() => {
        // 페이지 변경 시 맨 위로 스크롤
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}
