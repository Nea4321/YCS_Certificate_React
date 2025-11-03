import {useLocation, useNavigate} from "react-router-dom";
import { ExamResultStyles } from "../styles";
import {useMemo} from "react";
import {Question} from "@/entities/cbt";

interface ScoreResult {
    totalScore: number;
    subjectScores: { [key: number]: number };
    isPassed: boolean;
}

export function ExamResultPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const { certName, userAnswers, questions } = location.state || {
        certName: "정보를 불러올 수 없습니다.",
        userAnswers: [],
        questions: [],
    };

    const result: ScoreResult = useMemo(() => {
        if (!questions || !userAnswers || questions.length === 0) {
            return { totalScore: 0, subjectScores: {}, isPassed: false };
        }

        const subjectCorrectCounts: { [key: number]: number } = {};
        const subjectTotalCounts: { [key: number]: number } = {};
        let totalCorrect = 0;

        questions.forEach((q: Question, index: number) => {
            const userChoice = userAnswers[index]; // 사용자가 선택한 답 (1, 2, 3, 4)
            const correctChoiceIndex = q.answers.findIndex(ans => ans.bool); // 정답의 인덱스 (0, 1, 2, 3)
            const subjectId = q.question_type_id;

            if (!subjectTotalCounts[subjectId]) {
                subjectTotalCounts[subjectId] = 0;
                subjectCorrectCounts[subjectId] = 0;
            }
            subjectTotalCounts[subjectId]++;

            if (userChoice !== null && userChoice === correctChoiceIndex + 1) {
                totalCorrect++;
                subjectCorrectCounts[subjectId]++;
            }
        });

        const subjectScores: { [key: number]: number } = {};
        Object.keys(subjectTotalCounts).forEach(id => {
            const subjectId = Number(id);
            const score = (subjectCorrectCounts[subjectId] / subjectTotalCounts[subjectId]) * 100;
            subjectScores[subjectId] = Math.round(score);
        });

        const totalScore = Math.round((totalCorrect / questions.length) * 100);

        const hasFailedSubject = Object.values(subjectScores).some(score => score < 40);
        const isPassed = totalScore >= 60 && !hasFailedSubject;

        return { totalScore, subjectScores, isPassed };

    }, [questions, userAnswers]);


    const candidateName = "수험자 (00000000)";

    const handleDone = () => navigate("/cbt");

    const finalMessage = result.isPassed
        ? "합격을 축하합니다!"
        : "다음 기회에 꼭 합격하시길 기원합니다.";

    return (
        <div className={ExamResultStyles.wrap}>
            <div className={ExamResultStyles.panel}>
                <div className={ExamResultStyles.head}>
                    <span className={ExamResultStyles.headIcon} aria-hidden style={{ backgroundImage: "url('/CBTExamView/result_megaphone.png')" }} />
                    <span className={ExamResultStyles.headText}>{finalMessage}</span>
                </div>

                {/* 표 */}
                <table className={ExamResultStyles.table}>
                    <colgroup>
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "35%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "25%" }} />
                    </colgroup>
                    <thead>
                    <tr>
                        <th>수험자 이름</th>
                        <th>응시 종목</th>
                        <th>득점</th>
                        <th>합격여부</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className={ExamResultStyles.tdName}>{candidateName}</td>
                        <td>{certName}</td>
                        <td className={result.isPassed ? '' : ExamResultStyles.txtRed}>{result.totalScore}</td>
                        <td className={result.isPassed ? ExamResultStyles.pass : ExamResultStyles.txtRed}>
                            {result.isPassed ? "합격" : "불합격"}
                        </td>
                    </tr>
                    </tbody>
                </table>

                {/* 하단 문구 */}
                <div className={ExamResultStyles.quote}>
                    “득점 및 합격여부를 확인하셨습니까?”
                </div>
            </div>
            <div className={ExamResultStyles.actionsOutside}>
                <button
                    type="button"
                    className={ExamResultStyles.doneBtn}
                    onClick={handleDone}
                    style={{
                        backgroundImage: "url('/CBTExamView/submit_bg.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                    }}
                >
                    확인 완료
                </button>
                <button
                    type="button"
                    className={ExamResultStyles.reviewBtn}
                    onClick={() =>
                        navigate("/cbt/review", { state: { certName, questions, userAnswers } })
                    }
                    style={{
                        backgroundImage: "url('/CBTExamView/submit_bg.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                    }}
                >
                    오답노트
                </button>
            </div>
        </div>
    );
}