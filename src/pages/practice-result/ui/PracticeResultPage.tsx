import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { QuestionDTO } from "@/entities/cbt";
import { PracticeStyles } from "@/widgets/cbt-practice/styles";

// UI에서 쓰는 확장 타입: 각 문제에 과목 정보가 붙어 있다고 가정
type UiQuestion = QuestionDTO & {
    question_type_id: number;
    question_type_name: string;
};

type LocState = {
    certName: string;
    userAnswers: (number | null)[];
    questions: UiQuestion[];
};

interface SubjectResult {
    typeId: number;
    typeName: string;
    correct: number;
    total: number;
    score: number; // 0~100
}

export function PracticeResultPage() {
    const nav = useNavigate();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { certName, userAnswers, questions } = (state || {}) as LocState;

    // ✅ 뒤로가기 시 /cbt로 강제 이동 (useEffect는 컴포넌트 최상단에서만)
    useEffect(() => {
        const onPop = () => navigate("/cbt", { replace: true });
        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
    }, [navigate]);

    const result = useMemo(() => {
        if (!questions || !userAnswers || questions.length === 0) {
            return {
                totalCorrect: 0,
                totalScore: 0,
                subjectResults: [] as SubjectResult[],
                isPassed: false,
            };
        }

        let totalCorrect = 0;
        const subjectMap = new Map<number, SubjectResult>();

        questions.forEach((q, idx) => {
            const userChoice = userAnswers[idx]; // 1~4 or null
            const correctChoiceIndex = q.answers.findIndex((a) => a.bool); // 0~3

            const typeId = q.question_type_id;
            const typeName = q.question_type_name;

            if (!subjectMap.has(typeId)) {
                subjectMap.set(typeId, {
                    typeId,
                    typeName,
                    correct: 0,
                    total: 0,
                    score: 0,
                });
            }
            const subj = subjectMap.get(typeId)!;
            subj.total += 1;

            if (userChoice != null && userChoice === correctChoiceIndex + 1) {
                totalCorrect += 1;
                subj.correct += 1;
            }
        });

        const subjectResults: SubjectResult[] = Array.from(subjectMap.values())
            .map((s) => ({
                ...s,
                score: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
            }))
            // 과목 순서는 question_type_id 기준 정렬 (원하면 priority 기준으로도 가능)
            .sort((a, b) => a.typeId - b.typeId);

        const totalScore = Math.round(
            (totalCorrect / questions.length) * 100
        );
        const hasFailedSubject = subjectResults.some((s) => s.score < 40);
        const isPassed = totalScore >= 60 && !hasFailedSubject;

        return { totalCorrect, totalScore, subjectResults, isPassed };
    }, [questions, userAnswers]);

    // state 없을 때 방어
    if (!questions || !userAnswers) {
        return (
            <div className={PracticeStyles.pageBg} style={{ padding: "40px 0" }}>
                <div className={PracticeStyles.examPaper} style={{ paddingTop: 0 }}>
                    <div style={{ padding: 24 }}>결과 데이터를 찾을 수 없습니다.</div>
                </div>
            </div>
        );
    }

    const isPerfect = result.totalScore === 100;

    return (
        <div className={PracticeStyles.pageBg} style={{ padding: "40px 0" }}>
            <div className={PracticeStyles.examPaper} style={{ paddingTop: 0 }}>
                {/* 헤더 */}
                <div className={PracticeStyles.examPaperHead}>
                    <div className={PracticeStyles.headCenter}>
                        <div className={PracticeStyles.centerDate}>연습 모드</div>
                        <h2 className={PracticeStyles.centerTitle}>
                            {certName ?? "연습 결과"}
                        </h2>
                    </div>
                </div>

                {/* 본문 */}
                <div style={{ padding: "20px 16px" }}>
                    <div
                        style={{
                            border: "1px solid #e2e8e2",
                            borderRadius: 8,
                            padding: 16,
                            background: "#fafcf9",
                            marginBottom: 16,
                        }}
                    >
                        <div
                            style={{
                                fontWeight: 800,
                                fontSize: 18,
                                marginBottom: 8,
                            }}
                        >
                            총점: {result.totalScore}점 (
                            {result.totalCorrect}/{questions.length})
                        </div>
                        <div style={{ color: "#58635a" }}>
                            * 과목별 40점 미만, 총 60점 미만이면 불합격 기준
                        </div>
                    </div>

                    {/* 과목별 점수 표 */}
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr style={{ background: "#f3f6f3" }}>
                            <th
                                style={{
                                    textAlign: "left",
                                    padding: "10px 8px",
                                    borderBottom: "1px solid #e2e8e2",
                                }}
                            >
                                과목
                            </th>
                            <th
                                style={{
                                    textAlign: "left",
                                    padding: "10px 8px",
                                    borderBottom: "1px solid #e2e8e2",
                                }}
                            >
                                점수
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {result.subjectResults.map((s) => (
                            <tr key={s.typeId}>
                                <td
                                    style={{
                                        padding: "10px 8px",
                                        borderBottom: "1px solid #eef2ee",
                                    }}
                                >
                                    {s.typeName}
                                </td>
                                <td
                                    style={{
                                        padding: "10px 8px",
                                        borderBottom: "1px solid #eef2ee",
                                    }}
                                >
                                    {s.score}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                        <button
                            className={PracticeStyles.paginationBtn}
                            onClick={() => nav("/cbt")}
                        >
                            목록으로
                        </button>
                        <button
                            type="button"
                            className={PracticeStyles.paginationBtn}
                            onClick={() =>
                                navigate("/cbt/review", {
                                    state: { certName, questions, userAnswers },
                                })
                            }
                        >
                            {isPerfect ? "문제 검토" : "오답노트"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
