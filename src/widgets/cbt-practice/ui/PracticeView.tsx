import React, { useMemo } from "react";
import { PracticeStyles } from "@/widgets/cbt-practice/styles";
import { Header } from "@/shared/ui/header/Header";
import { QuestionCard } from "@/features/cbt/question/ui/QuestionCard";
import { AnswerSheet } from "@/features/cbt/select-answer/ui/AnswerSheet";
import { TestPagination } from "@/features/cbt/test-pagination/ui/TestPagination";

/** 연습 모드 전용 뷰
 *
 * 단일 책임: 연습 화면 UI만 렌더링
 */
export interface PracticeViewProps {
    certName: string;
    modeLabel: string;
    totalQuestions: number;
    pageSize: number;                  // 연습 모드: 5
    currentPage: number;
    setCurrentPage: (p: number) => void;
    answers: (number | null)[];
    setAnswer: (index: number, opt: number | null) => void;
    date?: string;
    start?: string;
    end?: string;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
                                                              certName,
                                                              modeLabel,
                                                              totalQuestions,
                                                              pageSize,
                                                              currentPage,
                                                              setCurrentPage,
                                                              answers,
                                                              setAnswer,
                                                              date,
                                                              start,
                                                              end,
                                                          }) => {
    const startIdx = (currentPage - 1) * pageSize;
    const totalPages = Math.ceil(totalQuestions / pageSize);

    const nums = useMemo(
        () => Array.from({ length: pageSize }, (_, i) => startIdx + i + 1).filter((n) => n <= totalQuestions),
        [startIdx, pageSize, totalQuestions]
    );

    return (
        <div className={PracticeStyles.testWrapper}>
            <div className={PracticeStyles.questionArea}>
                <Header />
                <div className={PracticeStyles.testContent}>
                    <h2 className={PracticeStyles.testTitle}>{certName || "CBT 시험"}</h2>
                    <div className={PracticeStyles.testInfo}>
                        <p>
                            <strong>시험 유형:</strong> {modeLabel}
                        </p>
                        {date && <p><strong>시험 일자:</strong> {date}</p>}
                        {start && end && <p><strong>출제 범위:</strong> {start} ~ {end}</p>}
                    </div>

                    {nums.map((n) => (
                        <QuestionCard
                            key={n}
                            number={n}
                            text={`문제 ${n} 내용`}
                            options={["보기1", "보기2", "보기3", "보기4"]}
                            selectedAnswer={answers[n - 1]}
                            onSelect={(opt) => setAnswer(n - 1, opt)}
                        />
                    ))}

                    <TestPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        containerClassName={PracticeStyles.paginationControls}
                        buttonClassName={PracticeStyles.pageButton}
                        pageInfoClassName={PracticeStyles.pageStatus}
                    />
                </div>
            </div>

            <AnswerSheet
                totalQuestions={totalQuestions}
                answers={answers}
                onSelect={(num, opt) => setAnswer(num - 1, opt)}
            />
        </div>
    );
};
