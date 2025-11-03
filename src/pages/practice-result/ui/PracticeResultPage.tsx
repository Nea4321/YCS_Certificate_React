import {useEffect, useMemo} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Question } from "@/entities/cbt";
import { PracticeStyles } from "@/widgets/cbt-practice/styles";

type LocState = {
    certName: string;
    userAnswers: (number | null)[];
    questions: Question[];
};

export function PracticeResultPage() {
    const nav = useNavigate();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { certName, userAnswers, questions } = (state || {}) as LocState;

    const result = useMemo(() => {
        if (!questions || !userAnswers || questions.length === 0) {
            return {
                totalCorrect: 0,
                totalScore: 0,
                subjectScores: {} as Record<number, number>,
                isPassed: false,
            };
        }

        useEffect(() => {
            const onPop = () => navigate("/cbt", { replace: true });
            window.addEventListener("popstate", onPop);
            return () => window.removeEventListener("popstate", onPop);
        }, [navigate]);

        const subjectCorrectCounts: Record<number, number> = {};
        const subjectTotalCounts: Record<number, number> = {};
        let totalCorrect = 0;

        questions.forEach((q, idx) => {
            const userChoice = userAnswers[idx]; // 1~4 or null
            const correctChoiceIndex = q.answers.findIndex(a => a.bool); // 0~3
            const subjectId = q.question_type_id;

            if (!subjectTotalCounts[subjectId]) {
                subjectTotalCounts[subjectId] = 0;
                subjectCorrectCounts[subjectId] = 0;
            }
            subjectTotalCounts[subjectId]++;

            if (userChoice != null && userChoice === correctChoiceIndex + 1) {
                totalCorrect++;
                subjectCorrectCounts[subjectId]++;
            }
        });

        const subjectScores: Record<number, number> = {};
        Object.keys(subjectTotalCounts).forEach(k => {
            const sid = Number(k);
            const score = (subjectCorrectCounts[sid] / subjectTotalCounts[sid]) * 100;
            subjectScores[sid] = Math.round(score);
        });

        const totalScore = Math.round((totalCorrect / questions.length) * 100);
        const hasFailedSubject = Object.values(subjectScores).some(s => s < 40);
        const isPassed = totalScore >= 60 && !hasFailedSubject;

        return { totalCorrect, totalScore, subjectScores, isPassed };
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

    return (
        <div className={PracticeStyles.pageBg} style={{ padding: "40px 0" }}>
            <div className={PracticeStyles.examPaper} style={{ paddingTop: 0 }}>
                {/* 헤더 */}
                <div className={PracticeStyles.examPaperHead}>
                    <div className={PracticeStyles.headCenter}>
                        <div className={PracticeStyles.centerDate}>연습 모드</div>
                        <h2 className={PracticeStyles.centerTitle}>{certName ?? "연습 결과"}</h2>
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
                        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>
                            총점: {result.totalScore}점 ({result.totalCorrect}/{questions.length})
                        </div>
                        <div style={{ color: "#58635a" }}>
                            * 과목별 40점 미만, 총 60점 미만이면 불합격 기준 (연습 모드)
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
                                과목 ID
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
                        {Object.entries(result.subjectScores).map(([sid, score]) => (
                            <tr key={sid}>
                                <td style={{ padding: "10px 8px", borderBottom: "1px solid #eef2ee" }}>{sid}</td>
                                <td style={{ padding: "10px 8px", borderBottom: "1px solid #eef2ee" }}>{score}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                        <button className={PracticeStyles.paginationBtn} onClick={() => nav("/cbt")}>
                            목록으로
                        </button>
                        <button
                            type="button"
                            className={PracticeStyles.paginationBtn}
                            onClick={() =>
                                navigate("/cbt/review", { state: { certName, questions, userAnswers } })
                            }
                        >
                            오답노트
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
