import React, { useState } from "react";
import { ExamStyles } from "@/widgets/cbt-exam/styles";
import type { Question } from "@/entities/cbt/model/types";
import {
    useExamPaging, useUnanswered, useStickyHeights,
    ExamHeader, ExamToolbar, QuestionPaper, AnswerSheet, UnansweredModal, FooterBar,
    LayoutMode
} from "@/features/cbt-exam";
import { Calculator } from "@/features/cbt-exam"; // 네가 둔 위치 그대로

export interface ExamViewProps {
    certName: string;
    pageSize: number;
    currentPage: number;
    setCurrentPage: (p:number)=>void;
    answers: (number|null)[];
    setAnswer: (index:number, opt:number|null)=>void;
    timer: { leftTime: string; limitMin: number };
    questions: Question[];
    fontZoom: 0.75|1|1.25;
    setFontZoom: React.Dispatch<React.SetStateAction<0.75|1|1.25>>;
}

export const ExamView: React.FC<ExamViewProps> = ({
                                                      certName, pageSize, currentPage, setCurrentPage,
                                                      answers, setAnswer, timer, questions, fontZoom, setFontZoom,
                                                  }) => {
    const { leftTime, limitMin } = timer;

    const [layout, setLayout] = useState<LayoutMode>("twoCol");
    const [showUnanswered, setShowUnanswered] = useState(false);
    const [showCalc, setShowCalc] = useState(false);

    const { bodyRef, headerRef, footerRef, toolbarRef } = useStickyHeights();
    const { effPageSize, totalPages, startIdx, currentSlice, onLayoutChange, goToQuestion } =
        useExamPaging(layout, pageSize, currentPage, setCurrentPage, questions.length, questions);
    const { unanswered, numbers: unansweredNumbers, hasUnanswered } = useUnanswered(answers);

    const wrapCls = [
        ExamStyles.examWrap,
        layout === "twoCol" && ExamStyles.layoutTwoCol,
        layout === "narrowSheet" && ExamStyles.layoutTwoColNarrow,
        layout === "oneCol" && ExamStyles.layoutOneCol,
    ].filter(Boolean).join(" ");

    return (
        <div className={wrapCls} style={{ ["--qScale" as any]: fontZoom }}>
            <div className={ExamStyles.examBody} ref={bodyRef}>
                <ExamHeader certName={certName} limitMin={limitMin} leftTime={leftTime} headerRef={headerRef} styles={ExamStyles} />

                <div className={ExamStyles.paperCol}>
                    <ExamToolbar
                        fontZoom={fontZoom} setFontZoom={setFontZoom}
                        layout={layout} setLayout={setLayout} onLayoutChange={onLayoutChange}
                        totalQuestions={questions.length} unanswered={unanswered}
                        toolbarRef={toolbarRef} styles={ExamStyles}
                    />
                    <QuestionPaper slice={currentSlice} startIdx={startIdx} answers={answers} setAnswer={setAnswer} fontZoom={fontZoom} styles={ExamStyles} />
                </div>

                <AnswerSheet totalQuestions={questions.length} answers={answers} setAnswer={setAnswer} styles={ExamStyles} />
            </div>

            <FooterBar
                currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}
                hasUnanswered={hasUnanswered}
                onOpenUnanswered={() => setShowUnanswered(true)}
                onOpenCalc={() => setShowCalc(true)}
                footerRef={footerRef} styles={ExamStyles}
            />

            {showUnanswered && hasUnanswered && (
                <UnansweredModal
                    numbers={unansweredNumbers}
                    onSelect={(n)=>{ goToQuestion(n); setShowUnanswered(false); }}
                    onClose={()=>setShowUnanswered(false)}
                    styles={ExamStyles}
                />
            )}

            {showCalc && (
                <div className={ExamStyles.overlay} onClick={()=>setShowCalc(false)}>
                    <div className={`${ExamStyles.calcDialog} ${ExamStyles.calcLegacy} ${ExamStyles.calcCompact} 
                    ${ExamStyles.calcWide} ${ExamStyles.calcFlush}`}
                         onClick={(e)=>e.stopPropagation()}>
                        <Calculator onClose={()=>setShowCalc(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};
