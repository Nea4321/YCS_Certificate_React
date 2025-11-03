// usePracticePaging.ts
import { useMemo, useState, useEffect } from "react";

const HEADER_OFFSET = 120; // 헤더+여백 만큼 위로 여유(원하면 100~140 사이로 조절)

function smoothScrollToElement(el: HTMLElement, offset = HEADER_OFFSET) {
    const rect = el.getBoundingClientRect();
    const docY = window.scrollY || document.documentElement.scrollTop || 0;

    // 목표 스크롤 위치(문서 기준)
    let targetY = rect.top + docY - offset;

    // 문서 범위 안으로 클램프
    const maxY = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
    );
    if (targetY < 0) targetY = 0;
    if (targetY > maxY) targetY = maxY;

    window.scrollTo({ top: targetY, behavior: "smooth" });
}

export function usePracticePaging(
    pageSize: number,
    currentPage: number,
    setCurrentPage: (p: number) => void,
    totalQuestions: number
) {
    const totalPages = Math.ceil(totalQuestions / pageSize);
    const startIdx = (currentPage - 1) * pageSize;

    const [scrollToQuestion, setScrollToQuestion] = useState<number | null>(null);

    const currentQuestionNumbers = useMemo(
        () =>
            Array.from({ length: pageSize }, (_, i) => startIdx + i).filter(
                (n) => n < totalQuestions
            ),
        [startIdx, pageSize, totalQuestions]
    );

    const goToQuestion = (questionNumber: number) => {
        const targetPage = Math.ceil(questionNumber / pageSize);

        // 페이지가 다르면 이동만 하고 스크롤은 useEffect에서
        if (currentPage !== targetPage) {
            setScrollToQuestion(questionNumber);
            setCurrentPage(targetPage);
            return;
        }

        // 같은 페이지면 즉시 스크롤
        const el = document.getElementById(`question-${questionNumber}`);
        if (el) smoothScrollToElement(el);
    };

    useEffect(() => {
        if (scrollToQuestion != null) {
            const el = document.getElementById(`question-${scrollToQuestion}`);
            if (el) {
                // 렌더링이 끝난 뒤 스크롤(안전)
                requestAnimationFrame(() => smoothScrollToElement(el));
            }
            setScrollToQuestion(null);
        }
    }, [currentPage, scrollToQuestion]);

    return { totalPages, startIdx, currentQuestionNumbers, goToQuestion };
}
