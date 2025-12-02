import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { QuestionDTO, UserPreviousDTO } from "@/entities/cbt";
import styles from "./styles/reviewStyles.module.css";

type ReviewItem = {
    index: number;
    question: QuestionDTO;
    user: number | null; // 1~4 or null
    correct: number;     // 1~4 (없으면 0)
    isCorrect: boolean;
};

const byQuestionNumSafe = (a: QuestionDTO, b: QuestionDTO) => {
    const an = a.question_num;
    const bn = b.question_num;
    return an - bn;
};

export function PreviousReviewPage() {
    const nav = useNavigate();
    const { previousId } = useParams<{ previousId: string }>();
    const { state } = useLocation() as { state?: { certName?: string } };
    const certName = state?.certName ?? "CBT";

    const [questions, setQuestions] = useState<QuestionDTO[]>([]);
    // ✅ question_id 기반으로 userChoice 저장 (순서 꼬임 방지)
    const [userChoiceByQid, setUserChoiceByQid] = useState<Map<number, number>>(() => new Map());

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [openedSolutions, setOpenedSolutions] = useState<number[]>([]);
    const toggleSolution = (questionId: number) => {
        setOpenedSolutions((prev) =>
            prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
        );
    };

    useEffect(() => {
        if (!previousId) return;

        (async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`/api/user/cbt/previous/${previousId}`, { credentials: "include" });
                if (!res.ok) throw new Error(`previous 조회 실패: ${res.status}`);

                const data: UserPreviousDTO = await res.json();

                // 1) question_types 평탄화
                const flatQuestions: QuestionDTO[] =
                    data.previous.list.question_types.flatMap((qt) => qt.questions ?? []);

                // 2) 백이 준 question_num 기준으로 확정 정렬
                flatQuestions.sort(byQuestionNumSafe);

                // 3) answer_id -> { questionId, choice(1~4) }
                const answerIdToPick = new Map<number, { questionId: number; choice: number }>();
                flatQuestions.forEach((q) => {
                    q.answers.forEach((a, idx) => {
                        answerIdToPick.set(a.answer_id, { questionId: q.question_id, choice: idx + 1 });
                    });
                });

                // 4) userAnswer(answer_id) -> question_id -> choice
                const qidToUserChoice = new Map<number, number>();
                data.userAnswer.forEach((ua) => {
                    const hit = answerIdToPick.get(ua.answer_id);
                    if (hit) qidToUserChoice.set(hit.questionId, hit.choice);
                });

                setQuestions(flatQuestions);
                setUserChoiceByQid(qidToUserChoice);
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : "기록을 불러오지 못했습니다.";
                console.error(e);
                setError(msg);
            } finally {
                setLoading(false);
            }
        })();
    }, [previousId]);

    const all: ReviewItem[] = useMemo(() => {
        if (!questions.length) return [];
        return questions.map((q, idx) => {
            const user = userChoiceByQid.get(q.question_id) ?? null;
            const correctIdx = q.answers.findIndex((a) => a.bool);
            const correct = correctIdx >= 0 ? correctIdx + 1 : 0;
            const isCorrect = user !== null && user === correct;
            return { index: idx, question: q, user, correct, isCorrect };
        });
    }, [questions, userChoiceByQid]);

    const [onlyWrong, setOnlyWrong] = useState(false);
    const items = useMemo(() => (onlyWrong ? all.filter((i) => !i.isCorrect) : all), [all, onlyWrong]);

    const pageSize = window.matchMedia("(max-width:768px)").matches ? 1 : 5;
    const [page, setPage] = useState(1);
    const total = items.length;
    const start = (page - 1) * pageSize;
    const slice = items.slice(start, start + pageSize);

    if (loading) return <div className={styles.emptyWrap}>기록을 불러오는 중입니다...</div>;

    if (error || !all.length) {
        return (
            <div className={styles.emptyWrap}>
                {error ?? "데이터가 없습니다."}
                <div className={styles.emptyActions}>
                    <button onClick={() => nav("/cbt")} className={styles.btnPrimary}>
                        CBT 홈으로
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.wrap}>
            <header className={styles.header}>
                <h2 className={styles.title}>문제 검토 / 오답노트</h2>
                <div className={styles.meta}>
                    {certName} · 총 {all.length}문항
                    {onlyWrong && <> (오답 {all.filter((i) => !i.isCorrect).length}문항)</>}
                </div>
                <div className={styles.controls}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={onlyWrong}
                            onChange={(e) => {
                                setOnlyWrong(e.target.checked);
                                setPage(1);
                            }}
                        />{" "}
                        오답만 보기
                    </label>
                </div>
            </header>

            <ol className={styles.list} start={start + 1}>
                {slice.map((it) => {
                    const q = it.question;
                    const got = it.isCorrect;

                    const correctAnswer = q.answers.find((a) => a.bool && (a.solution ?? "").trim().length > 0);
                    const solutionText = correctAnswer?.solution?.trim() ?? "";
                    const isSolutionOpen = openedSolutions.includes(q.question_id);

                    return (
                        <li key={q.question_id} className={styles.card}>
                            <div className={styles.qhead}>
                                <div className={styles.qtitle}>
                                    <strong>{q.question_num ?? it.index + 1}.</strong>&nbsp;{q.text}
                                </div>
                                <span
                                    className={`${styles.resultChip} ${got ? styles.resultChipOk : styles.resultChipNo}`}
                                >
                  {got ? "정답" : "오답"}
                </span>
                            </div>

                            {q.content && <pre className={styles.content}>{q.content}</pre>}

                            <ul className={styles.optList}>
                                {q.answers.map((a, idx) => {
                                    const v = idx + 1;
                                    const isC = v === it.correct;
                                    const isU = v === it.user;

                                    return (
                                        <li
                                            key={v}
                                            className={[
                                                styles.opt,
                                                isC && styles.optCorrect,
                                                isU && !isC && styles.optUserWrong,
                                                isU && isC && styles.optUserCorrect,
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                        >
                                            <span className={styles.bullet}>{v}</span>
                                            <span className={styles.optText}>{(a.content ?? "").trim()}</span>

                                            <span className={styles.optTags}>
                        {isC && <em className={styles.tagCorrect}>정답</em>}
                                                {isU && !isC && <em className={styles.tagWrong}>내 선택</em>}
                                                {isU && isC && <em className={styles.tagMyCorrect}>내 선택(정답)</em>}
                      </span>
                                        </li>
                                    );
                                })}
                            </ul>

                            {solutionText && (
                                <div className={styles.solutionArea}>
                                    <button
                                        type="button"
                                        className={styles.solutionBtn}
                                        onClick={() => toggleSolution(q.question_id)}
                                    >
                                        {isSolutionOpen ? "해설 닫기" : "해설 보기"}
                                    </button>

                                    {isSolutionOpen && (
                                        <div className={styles.solutionBox}>
                                            <div className={styles.solutionTitle}>해설</div>
                                            <pre className={styles.solutionBody}>{solutionText}</pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ol>

            <div className={styles.pager}>
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={styles.btnGhost}
                >
                    이전
                </button>
                <span className={styles.pagerInfo}>
          {page}/{Math.ceil(total / pageSize)}
        </span>
                <button
                    onClick={() => setPage((p) => Math.min(Math.ceil(total / pageSize), p + 1))}
                    disabled={start + pageSize >= total}
                    className={styles.btnGhost}
                >
                    다음
                </button>
            </div>

            <div className={styles.actions}>
                <button onClick={() => nav(-1)} className={styles.btnSecondary}>
                    이전 화면으로
                </button>
            </div>
        </div>
    );
}
