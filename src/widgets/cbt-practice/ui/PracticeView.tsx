import React, {useMemo} from "react";
import { PracticeStyles } from "@/widgets/cbt-practice/styles";
import { usePracticePaging } from "@/features/cbt-exam/model/usePracticePaging";
import { Header } from "@/shared/ui/header/Header";
import { QuestionCard } from "@/features/cbt/question/ui/QuestionCard";
import { AnswerSheet } from "@/features/cbt/select-answer/ui/AnswerSheet";
import { TestPagination } from "@/features/cbt/test-pagination/ui/TestPagination";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import { questions as mockQuestions } from "@/entities/cbt/lib/mockQuestions";

export interface PracticeViewProps {
    certName: string;
    modeLabel: string;
    totalQuestions: number;
    pageSize: number;                  // 연습 모드: 5 등
    currentPage: number;
    setCurrentPage: (p: number) => void;
    answers: (number | null)[];
    setAnswer: (index: number, opt: number | null) => void;
    date?: string;
    start?: string;
    end?: string;
    certificateId?: number | string;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
                                                              certName,
                                                              totalQuestions,
                                                              pageSize,
                                                              currentPage,
                                                              setCurrentPage,
                                                              answers,
                                                              setAnswer,
                                                              date,
                                                          }) => {
    const [sp] = useSearchParams();
    const certificateIdStr = sp.get("certificateId");
    const navigate = useNavigate();
    const allQuestions = mockQuestions.slice(0, totalQuestions);

    const certificateId = useMemo(() => {
        const n = Number(certificateIdStr);
        return Number.isFinite(n) ? n : null;
    }, [certificateIdStr]);

    const filteredQuestions = useMemo(() => {
        if (!certificateId) return mockQuestions;
        return mockQuestions.filter((q: { certificate_id: number; }) => q.certificate_id === certificateId);
    }, [certificateId]);

    const total = totalQuestions ?? filteredQuestions.length;

    const { totalPages, currentQuestionNumbers, goToQuestion } =
        usePracticePaging(pageSize, currentPage, setCurrentPage, total);

    const handleSubmit = () => {
        const unansweredCount = answers.filter((a) => a == null).length;
        const ok = window.confirm(
            unansweredCount > 0
                ? `미응답 ${unansweredCount}문항이 있습니다.\n채점하시겠습니까?`
                : "채점하시겠습니까?"
        );
        if (!ok) return;

        navigate("/cbt/practice/result", {
            state: {
                certName,
                userAnswers: answers,
                questions: allQuestions,
                from: "practice",
            },
            replace: true,
        });
    };

    return (
        <div className={PracticeStyles.pageBg}>
            {/* 가운데 정렬된 시험지 */}
            <div className={PracticeStyles.examPaper}>
                {/* 상단 바 (필요 없으면 숨겨도 됨) */}
                <div className={PracticeStyles.examPaperHead}>
                    <div className={PracticeStyles.headCenter}>
                        {date && <div className={PracticeStyles.centerDate}>{date}</div>}
                        <h2 className={PracticeStyles.centerTitle}>{certName || "CBT 시험"}</h2>
                    </div>

                    {certificateId ? (
                        <Link
                            to={`/certificate/${certificateId}?tab=exam`}
                            className={PracticeStyles.headCta}
                        >
                            {certName} 자격증 보러가기&nbsp;»
                        </Link>
                    ) : (
                        <span className={`${PracticeStyles.headCta} ${PracticeStyles.headCtaDisabled}`}>
                        자격증 보러가기&nbsp;»
                        </span>
                    )}
                </div>
                {/* 종이 내부: 좌측 문제 / 우측 답안 표기란 */}
                <div className={PracticeStyles.examGrid}>
                    {/* 좌측 문제 리스트 */}
                    <section className={PracticeStyles.paperLeft}>
                        <Header />
                        <ol
                            className={PracticeStyles.questionList}
                            start={currentQuestionNumbers.length ? currentQuestionNumbers[0] + 1 : 1}
                        >
                            {currentQuestionNumbers.map((qi) => {
                                const q = filteredQuestions[qi];
                                if (!q) return null;

                                const options = q.answers.map((a: { content: string; }) => a.content.trim());

                                return (
                                    <li key={q.question_id} id={`question-${qi + 1}`} className={PracticeStyles.questionItem}>
                                        <QuestionCard
                                            number={qi + 1}
                                            text={q.text}
                                            content={q.content ?? undefined}
                                            img={q.img ?? undefined}
                                            options={options}                       // ← 보기 주입
                                            selectedAnswer={answers[qi] ?? null}     // ← 현재 선택한 보기(1~4)
                                            onSelect={(opt) => setAnswer(qi, opt)}  // ← 선택 저장
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

                    {/* 우측 답안 표기란 (종이 안쪽) */}
                    <aside className={PracticeStyles.paperRight}>
                        <div className={PracticeStyles.answerPanelHead}>답안 표기란</div>
                        <AnswerSheet
                            totalQuestions={totalQuestions}
                            answers={answers}
                            setAnswer={setAnswer}
                            onJump={goToQuestion}
                        />
                        <button type="button" className={PracticeStyles.submitClassic} onClick={handleSubmit}>
                            채점하기
                        </button>
                    </aside>
                </div>
            </div>
        </div>
    );
};
