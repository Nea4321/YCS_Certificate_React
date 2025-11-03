import { useEffect, useState } from "react";

export function useExamViewMobile(basePageSize: number, breakpoint = 768) {
    const [isMobile, setIsMobile] = useState<boolean>(
        typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
    );

    useEffect(() => {
        const on = () => setIsMobile(window.innerWidth <= breakpoint);
        on();
        window.addEventListener("resize", on);
        return () => window.removeEventListener("resize", on);
    }, [breakpoint]);

    const effectivePageSize = isMobile ? 1 : basePageSize; // ← 페이징 해결 포인트
    return { isMobile, effectivePageSize };
}
