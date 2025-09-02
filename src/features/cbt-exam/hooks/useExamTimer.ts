import { useEffect, useMemo, useState, useRef } from "react";

/** 시험 타이머 훅
 *
 * @param enabled - true일 때만 카운트다운
 * @param seconds - 초기 초(default 3600)
 * @returns { leftSec, leftTime, limitSec: limitSecRef.current, limitMin}
 */
export function useExamTimer(enabled: boolean, seconds = 60 * 60) {
    const limitSecRef = useRef(seconds); // 제한 시간
    const [leftSec, setLeftSec] = useState(seconds);

    useEffect(() => {
        if (!enabled) return;
        const t = setInterval(() => setLeftSec((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(t);
    }, [enabled]);

    const leftTime = useMemo(() => {
        const m = String(Math.floor(leftSec / 60)).padStart(2, "0");
        const s = String(leftSec % 60).padStart(2, "0");
        return `${m}분 ${s}초`;
    }, [leftSec]);

    const limitMin = useMemo(
        () => Math.floor(limitSecRef.current / 60),
        []
    );

    return { leftSec, leftTime, limitSec: limitSecRef.current, limitMin};
}
