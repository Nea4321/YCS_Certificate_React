import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { QuestionDTO } from "@/entities/cbt";
import { buildReviewList, type ReviewItem } from "../lib/buildReviewList";
import styles from "./styles/reviewStyles.module.css";

type LocState = {
    certName: string;
    questions: QuestionDTO[];
    userAnswers: (number | null)[];
};

export function ReviewPage() {
    const nav = useNavigate();
    const { state } = useLocation() as { state?: LocState };

    const all: ReviewItem[] = useMemo(() => {
        if (!state?.questions || !state?.userAnswers) return [];
        return buildReviewList(state.questions, state.userAnswers);
    }, [state]);

    const [onlyWrong, setOnlyWrong] = useState(false);

    // 🔹 어느 문항의 해설이 열려있는지 (question_id 기준)
    const [openedSolutions, setOpenedSolutions] = useState<number[]>([]);

    const items = useMemo(
        () => (onlyWrong ? all.filter((i) => !i.isCorrect) : all),
        [all, onlyWrong]
    );

    const pageSize = window.matchMedia("(max-width:768px)").matches ? 1 : 5;
    const [page, setPage] = useState(1);
    const total = items.length;
    const start = (page - 1) * pageSize;
    const slice = items.slice(start, start + pageSize);

    const toggleSolution = (questionId: number) => {
        setOpenedSolutions(prev =>
            prev.includes(questionId)
                ? prev.filter(id => id !== questionId)
                : [...prev, questionId]
        );
    };

    if (!all.length) {
        return (
            <div className={styles.emptyWrap}>
                데이터가 없습니다.
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
                <h2 className={styles.title}>오답노트 / 전체 검토</h2>
                <div className={styles.meta}>
                    {state?.certName ?? "CBT"} · 총 {all.length}문항
                    {onlyWrong && (
                        <> (오답 {all.filter((i) => !i.isCorrect).length}문항)</>
                    )}
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

            {/* 기본 번호(바깥 숫자) 제거를 위해 list-style: none 적용 */}
            <ol className={styles.list} start={start + 1}>
                {slice.map(it => {
                    const q = it.question;
                    const got = it.isCorrect;

                    // 🔹 정답 보기 중 solution 있는 것 하나 뽑기 (여러 개면 첫 번째)
                    const correctAnswer = q.answers.find(a => a.bool && a.solution?.trim());
                    const solutionText = correctAnswer?.solution?.trim() ?? "";
                    const isSolutionOpen = openedSolutions.includes(q.question_id);

                    return (
                        <li key={q.question_id} className={styles.card}>
                            <div className={styles.qhead}>
                                <div className={styles.qtitle}>
                                    <strong>{it.index + 1}.</strong>&nbsp;{q.text}
                                </div>
                                <span
                                    className={`${styles.resultChip} ${
                                        got ? styles.resultChipOk : styles.resultChipNo
                                    }`}
                                >
                                    {got ? "정답" : "오답"}
                                </span>
                            </div>

                            {q.content && (
                                <pre className={styles.content}>{q.content}</pre>
                            )}

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
                                            <span className={styles.optText}>
                                                {(a.content ?? "").trim()}
                                            </span>

                                            <span className={styles.optTags}>
                                                {isC && (
                                                    <em className={styles.tagCorrect}>정답</em>
                                                )}
                                                {isU && !isC && (
                                                    <em className={styles.tagWrong}>내 선택</em>
                                                )}
                                                {isU && isC && (
                                                    <em className={styles.tagMyCorrect}>
                                                        내 선택(정답)
                                                    </em>
                                                )}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* 🔹 해설 버튼 + 영역 */}
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
                                            <pre className={styles.solutionBody}>
                                                {solutionText}
                                            </pre>
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
                    onClick={() =>
                        setPage((p) => Math.min(Math.ceil(total / pageSize), p + 1))
                    }
                    disabled={start + pageSize >= total}
                    className={styles.btnGhost}
                >
                    다음
                </button>
            </div>

            <div className={styles.actions}>
                <button onClick={() => nav(-1)} className={styles.btnSecondary}>
                    결과로 돌아가기
                </button>
            </div>
        </div>
    );
}
