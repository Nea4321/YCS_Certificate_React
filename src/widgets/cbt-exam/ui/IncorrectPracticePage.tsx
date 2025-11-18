// src/pages/cbt-test/IncorrectPracticePage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { ExamView } from "@/widgets/cbt-exam/ui/ExamView";
import { CBTTestStyle } from "@/pages/cbt-test/styles";

import { useAnswers } from "@/features/cbt-exam/hooks/useAnswers";
import { useExamChrome } from "@/features/cbt-exam/hooks/useExamChrome";
import { useExamTimer } from "@/features/cbt-exam/hooks/useExamTimer";

import type {
    QuestionDTO,
    UserIncorrectDTO,
} from "@/entities/cbt/model/types";

export const IncorrectPracticePage: React.FC = () => {
    const [sp] = useSearchParams();
    const navigate = useNavigate();

    const certIdParam = sp.get("certId");
    const certNameParam = sp.get("certName") || "CBT 오답 연습";

    const [questions, setQuestions] = useState<QuestionDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [fontZoom, setFontZoom] = useState<0.75 | 1 | 1.25>(1);
    const [examPageSize, setExamPageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);

    // ✨ CBT 크롬 잠그기(마우스 우클릭 방지 등) - 그냥 exam 모드처럼
    useExamChrome("exam");

    // ───────────────────────────────────────────
    // 1) 오답 기반 연습 세트 가져오기
    // ───────────────────────────────────────────
    useEffect(() => {
        if (!certIdParam) {
            setError("certId가 없습니다. 마이페이지에서 다시 진입해 주세요.");
            setLoading(false);
            return;
        }

        const fetchIncorrect = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`/api/user/cbt?cert_id=${certIdParam}`, {
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error(`오답 세트를 불러오지 못했습니다. (${res.status})`);
                }

                const json: UserIncorrectDTO = await res.json();

                // 🔁 UserIncorrectDTO → QuestionDTO[] 로 매핑
                const mapped: QuestionDTO[] =
                    json.userIncorrectQuestionDTOList.map((q,idx) => ({
                        question_id: q.question_id,
                        question_num: idx + 1,
                        text: q.text,
                        content: q.content ?? "",
                        img: q.img ?? "",
                        answers: q.userIncorrectAnswerDTOList.map((a) => ({
                            question_id: q.question_id,
                            answer_id: a.answer_id,
                            bool: a.bool,
                            content: a.content,
                            img: a.img,
                            solution: a.solution,
                        })),
                    }));

                setQuestions(mapped);
            } catch (e: any) {
                console.error(e);
                setError(
                    e?.message ?? "오답 연습 세트를 불러오는 중 오류가 발생했습니다."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchIncorrect();
    }, [certIdParam]);

    const totalQuestions = questions.length;

    // ───────────────────────────────────────────
    // 2) 답안 상태 관리 (ExamView와 동일)
    // ───────────────────────────────────────────
    const { answers, setAnswer } = useAnswers(totalQuestions);

    // ───────────────────────────────────────────
    // 3) 페이지 사이즈 동적 계산 (ExamView / CBTTestPage와 동일 로직)
    // ───────────────────────────────────────────
    const calculatePageSize = () => {
        const windowHeight = window.innerHeight;
        const baseProblemHeight = 150;
        const adjustedHeight = windowHeight * 0.6;
        const adjustedProblemHeight = baseProblemHeight * fontZoom;
        return Math.floor(adjustedHeight / adjustedProblemHeight);
    };

    useEffect(() => {
        const dynamicPageSize = calculatePageSize();
        setExamPageSize(dynamicPageSize);
    }, [fontZoom]);

    // ───────────────────────────────────────────
    // 4) 타이머 – 연습 모드라 실제 제한은 없지만 모양 맞추기
    //    isExamRunning=false로 주면 useExamTimer가 카운트다운 안 할 거라고 가정
    // ───────────────────────────────────────────
    const { leftTime, limitMin, leftSec } = useExamTimer(false, 90 * 60);
    const timer = { leftTime, limitMin, leftSec };

    // ───────────────────────────────────────────
    // 5) 로딩/에러 화면
    // ───────────────────────────────────────────
    if (loading) {
        return (
            <div className={CBTTestStyle.notFound}>
                <h2>오답 연습 세트를 불러오는 중입니다...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className={CBTTestStyle.notFound}>
                <h2>오답 연습 세트를 찾을 수 없습니다.</h2>
                <p>{error}</p>
                <button
                    className={CBTTestStyle.backButton}
                    onClick={() => navigate("/dashboard")}
                >
                    마이페이지로 돌아가기
                </button>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className={CBTTestStyle.notFound}>
                <h2>오답 연습할 문제가 없습니다.</h2>
                <p>이 자격증에 대한 오답 기록이 없거나, 데이터를 찾지 못했습니다.</p>
                <button
                    className={CBTTestStyle.backButton}
                    onClick={() => navigate("/mypage")}
                >
                    마이페이지로 돌아가기
                </button>
            </div>
        );
    }

    // ───────────────────────────────────────────
    // 6) ExamView 재사용 (스타일 완전 동일)
    //    - ui는 그냥 "exam" 고정
    //    - previousId = null → /add 저장 안 된다
    // ───────────────────────────────────────────
    return (
        <ExamView
            certName={certNameParam}
            pageSize={examPageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            answers={answers}
            setAnswer={setAnswer}
            timer={timer}
            questions={questions}
            fontZoom={fontZoom}
            setFontZoom={setFontZoom}
            ui="exam"
            onToggleUi={() => {
                /* 연습 세트는 모드 전환 없음 */
            }}
            previousId={null}
            certificateId={Number(certIdParam)}
        />
    );
};
