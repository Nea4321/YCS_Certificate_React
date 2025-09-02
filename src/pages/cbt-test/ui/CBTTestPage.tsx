import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCbtParams } from "@/shared/lib/url/getCbtParams";
import { useExamChrome } from "@/features/cbt-exam/hooks/useExamChrome";
import { useExamTimer } from "@/features/cbt-exam/hooks/useExamTimer";
import { useAnswers } from "@/features/cbt-exam/hooks/useAnswers";
import { mockQuestions } from "@/entities/cbt/lib/mockQuestions";
import { ExamView } from "@/widgets/cbt-exam/ui/ExamView";
import { PracticeView } from "@/widgets/cbt-practice/ui/PracticeView";

export const CBTTestPage: React.FC = () => {
    const location = useLocation();
    const { ui, mode, date, start, end, certName } = getCbtParams(location.search);

    const modeLabel = useMemo(() => (mode === "past" ? "기출문제" : "랜덤문제"), [mode]);
    const totalQuestions = mockQuestions.length;

    const [fontZoom, setFontZoom] = useState<0.75 | 1 | 1.25>(1);  // 글자 크기 상태
    const [pageSize, setPageSize] = useState(3);  // 기본 페이지 크기
    const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 상태

    // 글자 크기 및 화면 크기에 따른 문제 수 계산
    const calculatePageSize = () => {
        const windowHeight = window.innerHeight;
        const baseProblemHeight = 150; // 문제 하나의 기본 높이 (예시)
        const adjustedHeight = windowHeight * 0.6; // 화면의 60%를 문제 영역으로 사용

        // 글자 크기 조정
        const adjustedProblemHeight = baseProblemHeight * fontZoom;

        // 한 화면에 들어갈 수 있는 문제 개수 계산
        return Math.floor(adjustedHeight / adjustedProblemHeight);
    };

    useEffect(() => {
        const dynamicPageSize = calculatePageSize();
        setPageSize(dynamicPageSize);  // 동적으로 계산된 페이지 크기 업데이트
    }, [fontZoom]);  // 글자 크기 변경 시 페이지 크기 조정

    const { answers, setAnswer } = useAnswers(totalQuestions);

    // 시험 전용: 전역 크롬/타이머
    useExamChrome(ui);

    const { leftTime, limitMin} = useExamTimer(ui === "exam", 60 * 60);
    const timer = { leftTime, limitMin };


    return (
        <>
            {ui === "exam" ? (
                <ExamView
                    certName={certName}
                    pageSize={pageSize}  // 동적으로 계산된 pageSize 전달
                    currentPage={currentPage}  // 현재 페이지 전달
                    setCurrentPage={setCurrentPage}  // 페이지 이동 처리 함수 전달
                    answers={answers}
                    setAnswer={setAnswer}
                    timer={timer}
                    questions={mockQuestions}
                    fontZoom={fontZoom}
                    setFontZoom={setFontZoom}  // 글자 크기 변경 함수 전달
                />
            ) : (
                <PracticeView
                    certName={certName}
                    modeLabel={modeLabel}
                    totalQuestions={totalQuestions}
                    pageSize={pageSize}  // 동적으로 계산된 pageSize 전달
                    currentPage={currentPage}  // 현재 페이지 전달
                    setCurrentPage={setCurrentPage}  // 페이지 이동 처리 함수 전달
                    answers={answers}
                    setAnswer={setAnswer}
                    date={mode === "past" ? date : undefined}
                    start={mode === "random" ? start : undefined}
                    end={mode === "random" ? end : undefined}
                />
            )}
        </>
    );
};
