import { useMemo, useState, useEffect } from "react";

export function usePracticePaging(
    pageSize: number,
    currentPage: number,
    setCurrentPage: (p: number) => void,
    totalQuestions: number
) {
    const totalPages = Math.ceil(totalQuestions / pageSize);
    const startIdx = (currentPage - 1) * pageSize;

    // 페이지 변경 후 스크롤할 문제 번호를 저장하는 state
    const [scrollToQuestion, setScrollToQuestion] = useState<number | null>(null);

    // 현재 페이지에 보여줄 문제 번호들
    const currentQuestionNumbers = useMemo(
        () => Array.from({ length: pageSize }, (_, i) => startIdx + i).filter((n) => n < totalQuestions),
        [startIdx, pageSize, totalQuestions]
    );

    const goToQuestion = (questionNumber: number) => {
        const targetPage = Math.ceil(questionNumber / pageSize);
        if (currentPage !== targetPage) {
            setScrollToQuestion(questionNumber); // 스크롤 예약
            setCurrentPage(targetPage); // 페이지 이동
        } else {
            // 같은 페이지면 바로 스크롤
            const questionElement = document.getElementById(`question-${questionNumber}`);
            if (questionElement) {
                questionElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    };

    // 페이지 변경 후 예약된 스크롤을 실행하는 useEffect
    useEffect(() => {
        if (scrollToQuestion) {
            const questionElement = document.getElementById(`question-${scrollToQuestion}`);
            if (questionElement) {
                // requestAnimationFrame을 사용하여 렌더링 후 스크롤이 실행되도록
                requestAnimationFrame(() => {
                    questionElement.scrollIntoView({ behavior: "smooth", block: "center" });
                });
            }
            setScrollToQuestion(null);
        }
    }, [currentPage, scrollToQuestion]);

    return { totalPages, startIdx, currentQuestionNumbers, goToQuestion };
}