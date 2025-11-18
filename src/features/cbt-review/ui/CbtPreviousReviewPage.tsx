import {
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import type { QuestionDTO } from "@/entities/cbt";
import {
    buildReviewList,
    type ReviewItem,
} from "../lib/buildReviewList";
import styles from "./styles/reviewStyles.module.css";

type UserAnswerDTO = {
    answer_id: number;
    bool: boolean;
};

// 백엔드 UserPreviousDTO 형태 맞춰줌
type UserPreviousDTO = {
    previous: {
        // PreviousDTO 안에서 우리가 쓰는 건 list 뿐이면 최소만 선언해도 됨
        list: {
            question_types: {
                question_type_id: number;
                question_type_name: string;
                questions: QuestionDTO[];
            }[];
        };
    };
    userAnswer: UserAnswerDTO[];
};

export function PreviousReviewPage() {
    const nav = useNavigate();
    const { previousId } = useParams<{ previousId: string }>();
    const { state } = useLocation() as { state?: { certName?: string } };
    const certName = state?.certName ?? "CBT";

    const [questions, setQuestions] = useState<QuestionDTO[]>([]);
    const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- 1) previous/{id} 호출해서 데이터 가져오기 ---
    useEffect(() => {
        if (!previousId) return;

        (async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`/api/user/cbt/previous/${previousId}`, {
                    credentials: "include",
                });
                if (!res.ok) {
                    throw new Error(`previous 조회 실패: ${res.status}`);
                }

                const data: UserPreviousDTO = await res.json();

                // 1-1. 전체 문제 flat (CBTTestPage에서 했던 방식과 동일)
                const flatQuestions: QuestionDTO[] =
                    data.previous.list.question_types.flatMap((qt) => qt.questions ?? []);

                // 1-2. answer_id -> (question_id, 보기 번호) 로 매핑
                //   userAnswer에는 answer_id만 있으므로, 해당 answer가
                //   몇 번 보기(1~4)인지 찾아서 userAnswers 배열을 만든다.
                const answerIndexMap = new Map<number, number>(); // answer_id -> choice(1~4)
                flatQuestions.forEach((q) => {
                    q.answers.forEach((a, idx) => {
                        // a.answer_id 기준 (프로젝트 타입에 맞게 필드 이름 확인)
                        answerIndexMap.set(a.answer_id, idx + 1);
                    });
                });

                // question_id -> userChoice(1~4) 매핑
                const userChoiceMap = new Map<number, number>();
                data.userAnswer.forEach((ua) => {
                    const choice = answerIndexMap.get(ua.answer_id);
                    if (choice != null) {
                        // 해당 answer가 속한 question_id 찾기
                        const q = flatQuestions.find((q) =>
                            q.answers.some((a) => a.answer_id === ua.answer_id)
                        );
                        if (q) userChoiceMap.set(q.question_id, choice);
                    }
                });

                const uaArray: (number | null)[] = flatQuestions.map((q) =>
                    userChoiceMap.has(q.question_id)
                        ? (userChoiceMap.get(q.question_id) as number)
                        : null
                );

                setQuestions(flatQuestions);
                setUserAnswers(uaArray);
            } catch (e: any) {
                console.error(e);
                setError(e.message ?? "기록을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        })();
    }, [previousId]);

    // --- 2) 아래는 기존 ReviewPage 로직과 거의 동일 ---

    const all: ReviewItem[] = useMemo(() => {
        if (!questions.length || !userAnswers.length) return [];
        return buildReviewList(questions, userAnswers);
    }, [questions, userAnswers]);

    const [onlyWrong, setOnlyWrong] = useState(false);

    const items = useMemo(
        () => (onlyWrong ? all.filter((i) => !i.isCorrect) : all),
        [all, onlyWrong]
    );

    const pageSize = window.matchMedia("(max-width:768px)").matches ? 1 : 5;
    const [page, setPage] = useState(1);
    const total = items.length;
    const start = (page - 1) * pageSize;
    const slice = items.slice(start, start + pageSize);

    if (loading) {
        return (
            <div className={styles.emptyWrap}>
                기록을 불러오는 중입니다...
            </div>
        );
    }

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

            <ol className={styles.list} start={start + 1}>
                {slice.map((it) => {
                    const q = it.question;
                    const got = it.isCorrect;
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
                    이전 화면으로
                </button>
            </div>
        </div>
    );
}
