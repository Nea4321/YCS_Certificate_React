import { useEffect, useState } from "react";

/**
 * 화면이 주어진 media query를 만족하는지 boolean을 반환합니다.
 * - SSR 안전 (window 없는 환경에서 기본값 반환)
 * - matchMedia change 이벤트 구독/해제
 */
export function useMedia(query: string, defaultState = false) {
    const getMatch = () => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return defaultState;
        }
        return window.matchMedia(query).matches;
    };

    const [matches, setMatches] = useState<boolean>(getMatch);

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return;
        }
        const mql = window.matchMedia(query);

        // 초기 싱크 (SSR 이후 첫 마운트에서 한번 더 반영)
        setMatches(mql.matches);

        const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

        // 최신 브라우저
        if ("addEventListener" in mql) {
            mql.addEventListener("change", handler);
            return () => mql.removeEventListener("change", handler);
        }
    }, [query]);

    return matches;
}
