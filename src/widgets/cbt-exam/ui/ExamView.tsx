import React, { useEffect, useState } from "react";
import { ExamStyles } from "@/widgets/cbt-exam/styles";
import {
    useExamPaging,
    useUnanswered,
    useStickyHeights,
    ExamHeader,
    ExamToolbar,
    QuestionPaper,
    AnswerSheet,
    UnansweredModal,
    FooterBar,
    useExamViewMobile,
} from "@/features/cbt-exam";
import { SubmitConfirmModal } from "@/features/cbt-exam";
import { Calculator } from "@/features/cbt-exam";
import { useNavigate } from "react-router-dom";
import { QuestionDTO, UserAnswerDTO, UserCbtHistoryDTO } from "@/entities/cbt";

export interface ExamViewProps {
    certName: string;
    pageSize: number;
    currentPage: number;
    setCurrentPage: (p: number) => void;
    answers: (number | null)[];
    setAnswer: (index: number, opt: number | null) => void;
    timer: { leftTime: string; limitMin: number; leftSec: number };
    questions: QuestionDTO[];
    fontZoom: 0.75 | 1 | 1.25;
    setFontZoom: React.Dispatch<React.SetStateAction<0.75 | 1 | 1.25>>;
    ui: "exam" | "practice";
    onToggleUi: () => void;
    previousId: number | null;
    certificateId: number;
    showSubjectPerQuestion: boolean;
}

export function ExamView({
                             certName,
                             pageSize,
                             currentPage,
                             setCurrentPage,
                             answers,
                             setAnswer,
                             timer,
                             questions,
                             fontZoom,
                             setFontZoom,
                             onToggleUi,
                             previousId,
                             certificateId,
                             showSubjectPerQuestion,
                         }: ExamViewProps) {
    const { leftTime, limitMin, leftSec } = timer;

    type LayoutMode = "twoCol" | "narrowSheet" | "oneCol";
    const [layout, setLayout] = useState<LayoutMode>("twoCol");
    const [showUnanswered, setShowUnanswered] = useState(false);
    const [showCalc, setShowCalc] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const navigate = useNavigate();
    const { bodyRef, headerRef, footerRef, toolbarRef } = useStickyHeights();
    const { isMobile, effectivePageSize } = useExamViewMobile(pageSize);

    const { unanswered, numbers: unansweredNumbers, hasUnanswered } =
        useUnanswered(answers);

    useEffect(() => {
        if (isMobile && layout !== "oneCol") setLayout("oneCol");
    }, [isMobile, layout]);

    const {
        totalPages,
        startIdx,
        currentSlice,
        onLayoutChange,
        goToQuestion,
    } = useExamPaging(
        layout,
        effectivePageSize,
        currentPage,
        setCurrentPage,
        questions.length,
        questions
    );

    const totalQuestions = questions.length;

    /** 제출 버튼 클릭 → 확인 모달 열기 */
    const handleSubmitClick = () => {
        setShowConfirm(true);
    };

    /** 모달에서 "제출" 확정 시 → 채점 + 기록 저장 + 결과 페이지 이동 */
    const handleSubmitConfirm = async () => {
        let correctCount = 0;
        const userAnswerPayload: UserAnswerDTO[] = [];

        questions.forEach((q, idx) => {
            const userChoice = answers[idx]; // 1~4 or null
            if (userChoice == null) return;  // 미응답은 기록 안 함

            const answerIndex = userChoice - 1;
            const selectedAnswer = q.answers[answerIndex];
            if (!selectedAnswer) return;

            const isCorrect = selectedAnswer.bool;
            if (isCorrect) correctCount++;

            userAnswerPayload.push({
                answer_id: selectedAnswer.answer_id,
                bool: isCorrect,
            });
        });

        const score = Math.round((correctCount / totalQuestions) * 100);
        const totalDurationSec = limitMin * 60;
        const left_time = totalDurationSec - (leftSec ?? 0);

        if (previousId != null) {
            const payload: UserCbtHistoryDTO = {
                certificate_id: certificateId,
                score,
                correct_Count: correctCount,
                left_time,
                previous_id: previousId,
                answers: userAnswerPayload,
            };

            try {
                await fetch("/api/user/cbt/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(payload),
                });
            } catch (e) {
                console.error("CBT 기록 저장 실패", e);
            }
        }

        setShowConfirm(false);
        navigate("/cbt/exam/result", {
            replace: true,
            state: {
                certName,
                userAnswers: answers,
                questions,
            },
        });
    };

    const wrapCls = [
        ExamStyles.examWrap,
        layout === "twoCol" && ExamStyles.layoutTwoCol,
        layout === "narrowSheet" && ExamStyles.layoutTwoColNarrow,
        layout === "oneCol" && ExamStyles.layoutOneCol,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={wrapCls} style={{ ["--qScale" as any]: fontZoom }}>
            <div className={ExamStyles.examBody} ref={bodyRef}>
                <ExamHeader
                    certName={certName}
                    limitMin={limitMin}
                    leftTime={leftTime}
                    headerRef={headerRef}
                />

                <div className={ExamStyles.paperCol}>
                    <div className={ExamStyles.modeSwitchBar}></div>

                    {!isMobile && (
                        <ExamToolbar
                            fontZoom={fontZoom}
                            setFontZoom={setFontZoom}
                            layout={layout}
                            setLayout={setLayout}
                            onLayoutChange={onLayoutChange}
                            totalQuestions={questions.length}
                            unanswered={unanswered}
                            toolbarRef={toolbarRef}
                            onToggleUi={onToggleUi}
                        />
                    )}

                    <QuestionPaper
                        slice={currentSlice}
                        startIdx={startIdx}
                        answers={answers}
                        setAnswer={setAnswer}
                        fontZoom={fontZoom}
                        allQuestions={questions}
                        showSubjectPerQuestion={showSubjectPerQuestion}
                    />
                </div>

                <AnswerSheet
                    totalQuestions={questions.length}
                    answers={answers}
                    setAnswer={setAnswer}
                    onJump={goToQuestion}
                />
            </div>

            <FooterBar
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onOpenCalc={() => setShowCalc(true)}
                onOpenUnanswered={() => setShowUnanswered(true)}
                onSubmitClick={handleSubmitClick}
                unansweredDisabled={!hasUnanswered}
                footerRef={footerRef}
            />

            {/* 안 푼 문제 모달 */}
            {showUnanswered && hasUnanswered && (
                <UnansweredModal
                    numbers={unansweredNumbers}
                    onSelect={(n) => {
                        goToQuestion(n);
                        setShowUnanswered(false);
                    }}
                    onClose={() => setShowUnanswered(false)}
                />
            )}

            {/* 제출 확인 모달 */}
            {showConfirm && (
                <SubmitConfirmModal
                    unansweredCount={unanswered}
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={handleSubmitConfirm}
                />
            )}

            {/* 계산기 모달 */}
            {showCalc && (
                <div
                    className={ExamStyles.overlay}
                    style={{ pointerEvents: "none" }}
                >
                    <div
                        className={`${ExamStyles.calcDialog} ${ExamStyles.calcLegacy} ${ExamStyles.calcCompact} ${ExamStyles.calcWide} ${ExamStyles.calcFlush}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ pointerEvents: "auto" }}
                    >
                        <Calculator onClose={() => setShowCalc(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}
