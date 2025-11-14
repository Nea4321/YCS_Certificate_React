import React, {useEffect, useState} from "react";
import { ExamStyles } from "@/widgets/cbt-exam/styles";
import type { Question } from "@/entities/cbt/model/types";
import {
    useExamPaging,
    useUnanswered,
    useStickyHeights,
    ExamHeader,
    ExamToolbar,
    QuestionPaper,
    AnswerSheet,
    UnansweredModal,
    FooterBar, useExamViewMobile,
} from "@/features/cbt-exam";
import { SubmitConfirmModal } from "@/features/cbt-exam";
import { Calculator } from "@/features/cbt-exam";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/app/store";
import {setCbtHistory} from "@/shared/slice";

export interface ExamViewProps {
    certName: string;
    pageSize: number;
    currentPage: number;
    setCurrentPage: (p: number) => void;
    answers: (number | null)[];
    setAnswer: (index: number, opt: number | null) => void;
    timer: { leftTime: string; limitMin: number };
    questions: Question[];
    fontZoom: 0.75 | 1 | 1.25;
    setFontZoom: React.Dispatch<React.SetStateAction<0.75 | 1 | 1.25>>;
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

    const dispatch = useDispatch();
    const cbtHistory = useSelector((state: RootState) => state.userCbtHistory);

    const { unanswered, numbers: unansweredNumbers, hasUnanswered } =
        useUnanswered(answers);

    useEffect(() => {
        if (isMobile && layout !== "oneCol") setLayout("oneCol");
    }, [isMobile, layout]);

    const { totalPages, startIdx, currentSlice, onLayoutChange, goToQuestion } =
        useExamPaging(
            layout,
            effectivePageSize,
            currentPage,
            setCurrentPage,
            questions.length,
            questions,
        );

    const wrapCls = [
        ExamStyles.examWrap,
        layout === "twoCol" && ExamStyles.layoutTwoCol,
        layout === "narrowSheet" && ExamStyles.layoutTwoColNarrow,
        layout === "oneCol" && ExamStyles.layoutOneCol,
    ]
        .filter(Boolean)
        .join(" ");

    const handleSubmitClick = () => {
        setShowConfirm(true);
    };

    const handleSubmitConfirm = () => {
        // 남은 시간 redux에 저장
        dispatch(setCbtHistory({...cbtHistory, left_time: leftSec || 0,}))
        setShowConfirm(false);
        navigate('/cbt/exam/result', {
            replace: true,
            state: {
                certName: certName,
                userAnswers: answers,
                questions: questions,
            }
        });
    };

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
                    {!isMobile && (
                        <ExamToolbar
                            fontZoom={fontZoom} setFontZoom={setFontZoom}
                            layout={layout} setLayout={setLayout}
                            onLayoutChange={onLayoutChange}
                            totalQuestions={questions.length}
                            unanswered={unanswered}
                            toolbarRef={toolbarRef}
                        />
                    )}

                    <QuestionPaper
                        slice={currentSlice}
                        startIdx={startIdx}
                        answers={answers}
                        setAnswer={setAnswer}
                        fontZoom={fontZoom}
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
                <div className={ExamStyles.overlay} style={{ pointerEvents: 'none' }}>
                    <div
                        className={`${ExamStyles.calcDialog} ${ExamStyles.calcLegacy} ${ExamStyles.calcCompact} ${ExamStyles.calcWide} ${ExamStyles.calcFlush}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <Calculator onClose={() => setShowCalc(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}
