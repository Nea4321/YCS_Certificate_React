import { useLayoutEffect } from "react";

/** 시험 모드 진입 시 전역 크롬(헤더 여백 등) 정리
 *
 * - body.examMode 토글
 * - .main-content 상단 패딩 제거(인라인)
 */
export function useExamChrome(ui: "practice" | "exam") {
    useLayoutEffect(() => {
        if (ui !== "exam") return;

        document.body.classList.add("examMode");

        const main =
            (document.querySelector(".main-content") as HTMLElement | null) ||
            (document.querySelector('[class*="mainContent"]') as HTMLElement | null);

        const prev = main?.getAttribute("style") || "";
        if (main) {
            main.style.setProperty("padding-top", "0px", "important");
            main.style.setProperty("max-width", "100%", "important");
            main.style.setProperty("overflow-x", "hidden", "important");
        }

        return () => {
            document.body.classList.remove("examMode");
            if (main) main.setAttribute("style", prev);
        };
    }, [ui]);
}
