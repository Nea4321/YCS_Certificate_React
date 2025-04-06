import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@/app/styles/index.css" // 올바른 경로로 수정
import { bootstrap, AppProvider, Router } from "@/app"

// 앱 초기화
bootstrap()

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppProvider>
            <Router />
        </AppProvider>
    </StrictMode>,
)

