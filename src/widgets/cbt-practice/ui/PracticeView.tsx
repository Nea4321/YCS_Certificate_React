import React, {useEffect, useState} from "react";
import { PracticeStyles } from "@/widgets/cbt-practice/styles";
import { usePracticePaging } from "@/features/cbt-exam/model/usePracticePaging";
import { Header } from "@/shared/ui/header/Header";
import { QuestionCard } from "@/features/cbt/question/ui/QuestionCard";
import { AnswerSheet } from "@/features/cbt/select-answer/ui/AnswerSheet";
import { TestPagination } from "@/features/cbt/test-pagination/ui/TestPagination";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {QuestionDTO, UserAnswerDTO, UserCbtHistoryDTO} from "@/entities/cbt/model/types.ts";

export interface PracticeViewProps {
    certName: string;
    totalQuestions: number;
    pageSize: number;                  // 연습 모드: 5 등
    questions: QuestionDTO[];
    currentPage: number;
    setCurrentPage: (p: number) => void;
    answers: (number | null)[];
    setAnswer: (index: number, opt: number | null) => void;
    date?: string;
    start?: string;
    end?: string;
    ui: "exam" | "practice";
    onToggleUi: () => void;
    previousId: number | null;
    certificateId: number | string;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
                                                              certName,
                                                              questions,
                                                              totalQuestions,
                                                              pageSize,
                                                              currentPage,
                                                              setCurrentPage,
                                                              answers,
                                                              setAnswer,
                                                              onToggleUi,
                                                              previousId,
                                                              certificateId
                                                          }) => {
    const [sp] = useSearchParams();
    const certificateIdStr = sp.get("certificateId");
    const navigate = useNavigate();
    const [elapsedSec, setElapsedSec] = useState(0);

    const certIdNum =
        typeof certificateId === "number"
            ? certificateId
            : Number(certificateIdStr ?? certificateId);

    // 🔹 이제 questions는 이미 CBTTestPage에서 필터된 상태이므로 그대로 사용
    const total = totalQuestions ?? questions.length;

    const { totalPages, currentQuestionNumbers, goToQuestion } =
        usePracticePaging(pageSize, currentPage, setCurrentPage, total);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedSec(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async () => {
        const unansweredCount = answers.filter((a) => a == null).length;
        const left_time = elapsedSec;
        const ok = window.confirm(
            unansweredCount > 0
                ? `미응답 ${unansweredCount}문항이 있습니다.\n채점하시겠습니까?`
                : "채점하시겠습니까?"
        );
        if (!ok) return;

        let correctCount = 0;
        const userAnswerPayload: UserAnswerDTO[] = [];

        questions.forEach((q, idx) => {
            const userChoice = answers[idx]; // 1~4 or null
            if (userChoice == null) return;

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

        const totalQuestionsCount = questions.length;
        const score = Math.round(
            (correctCount / totalQuestionsCount) * 100
        );

        if (previousId != null && Number.isFinite(certIdNum)) {
            const payload: UserCbtHistoryDTO = {
                certificate_id: certIdNum as number,
                score,
                correct_Count: correctCount,
                left_time,
                previous_id: previousId,
                answers: userAnswerPayload,
            };

            try {
                await fetch("/api/user/cbt/add", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include",
                    body: JSON.stringify(payload),
                });
            } catch (e) {
                console.error("연습 모드 CBT 기록 저장 실패", e);
            }
        }

        navigate("/cbt/practice/result", {
            state: {
                certName,
                userAnswers: answers,
                questions: questions,   // 🔹 여기서도 props.questions 사용
                from: "practice",
            },
            replace: true,
        });
    };

    return (
        <div className={PracticeStyles.pageBg}>
            <div className={PracticeStyles.examPaper}>
                {/* 상단 바 */}
                <div className={PracticeStyles.examPaperHead}>
                    <div className={PracticeStyles.headCenter}>
                        <h2 className={PracticeStyles.centerTitle}>
                            {certName || "CBT 시험"}
                        </h2>
                    </div>
                    <button
                        type="button"
                        className={PracticeStyles.modeSwitchBtn}
                        onClick={onToggleUi}
                    >
                        화면모드 전환
                    </button>

                    {certificateId ? (
                        <Link
                            to={`/certificate/${certificateId}?tab=exam`}
                            className={PracticeStyles.headCta}
                        >
                            {certName} 자격증 보러가기&nbsp;»
                        </Link>
                    ) : (
                        <span
                            className={`${PracticeStyles.headCta} ${PracticeStyles.headCtaDisabled}`}
                        >
                            자격증 보러가기&nbsp;»
                        </span>
                    )}
                </div>

                {/* 문제 + 답안 그리드 */}
                <div className={PracticeStyles.examGrid}>
                    {/* 좌측 문제 리스트 */}
                    <section className={PracticeStyles.paperLeft}>
                        <Header />
                        <ol
                            className={PracticeStyles.questionList}
                            start={
                                currentQuestionNumbers.length
                                    ? currentQuestionNumbers[0] + 1
                                    : 1
                            }
                        >
                            {currentQuestionNumbers.map((qi) => {
                                const q = questions[qi];   // 🔹 mock이 아니라 props.questions
                                if (!q) return null;

                                const options = q.answers.map((a) =>
                                    a.content.trim()
                                );

                                const prevGlobal = qi > 0 ? questions[qi - 1] : null;
                                const showSubjectHeader =
                                    q.question_type_name &&
                                    (!prevGlobal ||
                                        prevGlobal.question_type_id !== q.question_type_id);

                                return (
                                    <li
                                        key={q.question_id}
                                        id={`question-${qi + 1}`}
                                        className={PracticeStyles.questionItem}
                                    >
                                        {showSubjectHeader && (
                                            <div className={PracticeStyles.subjectHeader}>
                                                {q.question_type_name}
                                            </div>
                                        )}
                                        <QuestionCard
                                            number={qi + 1}
                                            text={q.text}
                                            content={q.content ?? undefined}
                                            img={q.img ?? undefined}
                                            options={options}
                                            selectedAnswer={answers[qi] ?? null}
                                            onSelect={(opt) =>
                                                setAnswer(qi, opt)
                                            }
                                        />
                                    </li>
                                );
                            })}
                        </ol>

                        <TestPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            containerClassName={PracticeStyles.paginationBar}
                            buttonClassName={PracticeStyles.paginationBtn}
                            pageInfoClassName={PracticeStyles.paginationInfo}
                        />

                        <div className={PracticeStyles.mobileSubmitBar}>
                            <button
                                type="button"
                                className={PracticeStyles.mobileSubmitBtn}
                                onClick={handleSubmit}
                                aria-label="채점하기"
                            >
                                채점하기
                            </button>
                        </div>
                    </section>

                    {/* 우측 답안 표기란 */}
                    <aside className={PracticeStyles.paperRight}>
                        <div className={PracticeStyles.answerPanelHead}>
                            답안 표기란
                        </div>
                        <AnswerSheet
                            totalQuestions={totalQuestions}
                            answers={answers}
                            setAnswer={setAnswer}
                            onJump={goToQuestion}
                        />
                        <button
                            type="button"
                            className={PracticeStyles.submitClassic}
                            onClick={handleSubmit}
                        >
                            채점하기
                        </button>
                    </aside>
                </div>
            </div>
        </div>
    );
};
