import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCbtParams } from "@/shared/lib/url/getCbtParams";
import { useExamChrome } from "@/features/cbt-exam/hooks/useExamChrome";
import { useExamTimer } from "@/features/cbt-exam/hooks/useExamTimer";
import { useAnswers } from "@/features/cbt-exam/hooks/useAnswers";
import { ExamView } from "@/widgets/cbt-exam/ui/ExamView";
import { PracticeView } from "@/widgets/cbt-practice/ui/PracticeView";
import { CBTTestStyle } from "@/pages/cbt-test/styles";
import {QuestionDTO, PreviousDTO,UserPreviousDTO} from "@/entities/cbt/model/types.ts";

export const CBTTestPage: React.FC = () => {

    type UiQuestion = QuestionDTO & {
        question_type_id: number;
        question_type_name: string;
    };

    const location = useLocation();
    const navigate = useNavigate();
    const { ui, certName } = getCbtParams(location.search);
    const search = new URLSearchParams(location.search);
    const showCorrect = search.get("showCorrect") === "1";
    const questionInfoId = search.get("questionInfoId");
    const certificateIdParam = search.get("certificateId");
    const certificateIdNum = certificateIdParam ? Number(certificateIdParam) : null;
    const previous_id = search.get("previousId");
    const prevTypeFromQuery = search.get("prevType");

    const [questions, setQuestions] = useState<UiQuestion[]>([]);
    const [previousId, setPreviousId] = useState<number | null>(null);
    const [prevType, setPrevType] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totalQuestions = questions.length;

    const [fontZoom, setFontZoom] = useState<0.75 | 1 | 1.25>(1);
    const [examPageSize, setExamPageSize] = useState(3);
    const PRACTICE_PAGE_SIZE = 4;
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);

        if (previous_id) {
            // 기록 회차 재생
            const previousIdNum = parseInt(previous_id, 10);
            setPreviousId(previousIdNum);
            fetch(`/api/user/cbt/previous/${previousIdNum}`)
                .then(res => {
                    if (!res.ok) throw new Error(res.statusText);
                    return res.json();
                })
                .then((data: UserPreviousDTO) => {
                    setPrevType(data.previous.type ?? null);
                    const qList: UiQuestion[] =
                        data.previous.list.question_types.flatMap(qt =>
                            qt.questions.map(q => ({
                                ...q,
                                question_type_id: qt.question_type_id,
                                question_type_name: qt.question_type_name,
                            }))
                        );
                    const hasNum = qList.every(() => true);
                    if (hasNum) qList.sort((a, b) => (a.question_num! - b.question_num!));

                    setQuestions(qList);
                    console.log(
                        "[CBTTestPage retry] prevId",
                        previousIdNum,
                        qList
                            .map(q => [q.question_num, q.question_id])
                            .slice(0, 20)
                    );
                })
                .catch(e => {
                    console.error(e);
                    setError("문제를 불러오지 못했습니다.");
                })
                .finally(() => setLoading(false));

        } else if (questionInfoId) {
            // 새 CBT 랜덤 문제
            fetch(`/api/user/cbt?question_info_id=${questionInfoId}`)
                .then(res => {
                    if (!res.ok) throw new Error(`Failed to fetch CBT questions: ${res.status}`);
                    return res.json();
                })
                .then((data: PreviousDTO) => {
                    setPreviousId(data.previous_id);
                    setPrevType(data.type ?? "user");

                    const qList: UiQuestion[] =
                        data.list?.question_types?.flatMap(qt =>
                            (qt.questions ?? []).map(q => ({
                                ...q,
                                question_type_id: qt.question_type_id,
                                question_type_name: qt.question_type_name,
                            }))

                        );
                    const hasNum = qList.every(() => true);
                    if (hasNum) qList.sort((a, b) => (a.question_num! - b.question_num!));
                    setQuestions(qList);
                })
                .catch(e => {
                    console.error(e);
                    setError("문제를 불러오지 못했습니다.");
                })
                .finally(() => setLoading(false));

        } else {
            setError("questionInfoId 또는 previousId가 없습니다. 다시 시험을 시작해 주세요.");
            setLoading(false);
        }
    }, [questionInfoId, previous_id]);
    const isIncorrectPrevious = (prevTypeFromQuery ?? prevType) === "incorrect";

    const calculatePageSize = () => {
        const windowHeight = window.innerHeight;
        const baseProblemHeight = 150;
        const adjustedHeight = windowHeight * 0.6;
        const adjustedProblemHeight = baseProblemHeight * fontZoom;
        return Math.floor(adjustedHeight / adjustedProblemHeight);
    };

    const toggleUi = () => {
        const params = new URLSearchParams(location.search);
        const nextUi = ui === "exam" ? "practice" : "exam";
        params.set("ui", nextUi);
        navigate(`${location.pathname}?${params.toString()}`, {
            replace: true,
        });
    };

    useEffect(() => {
        const dynamicPageSize = calculatePageSize();
        setExamPageSize(dynamicPageSize);
    }, [fontZoom]);

    const { answers, setAnswer } = useAnswers(totalQuestions);

    useEffect(() => {
        if (!showCorrect) return;
        if (!questions.length) return;

        questions.forEach((q, qIndex) => {
            const correctIdx = q.answers?.findIndex((a) => a.bool) ?? -1;
            if (correctIdx >= 0) {
                setAnswer(qIndex, correctIdx + 1);
            }
        });
    }, [showCorrect, questions]);

    useExamChrome(ui);
    const { leftTime, limitMin, leftSec } = useExamTimer(ui === "exam", 90 * 60);
    const timer = { leftTime, limitMin, leftSec };

    if (loading) {
        return (
            <div className={CBTTestStyle.notFound}>
                <h2>CBT 문제를 불러오는 중입니다...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className={CBTTestStyle.notFound}>
                <h2>CBT 문제를 찾을 수 없습니다.</h2>
                <p>{error}</p>
                <button
                    className={CBTTestStyle.backButton}
                    onClick={() => navigate("/cbt")}
                >
                    CBT 목록으로 돌아가기
                </button>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className={CBTTestStyle.notFound}>
                <h2>CBT 문제를 찾을 수 없습니다.</h2>
                <p>요청하신 문제 데이터가 존재하지 않습니다.</p>
                <button
                    className={CBTTestStyle.backButton}
                    onClick={() => navigate("/cbt")}
                >
                    CBT 목록으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <>
            {ui === "exam" ? (
                <ExamView
                    certName={certName}
                    pageSize={examPageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    answers={answers}
                    setAnswer={setAnswer}
                    timer={timer}
                    questions={questions}
                    fontZoom={fontZoom}
                    setFontZoom={setFontZoom}
                    ui={ui}
                    onToggleUi={toggleUi}
                    previousId={previousId}
                    certificateId={certificateIdNum ?? 0}
                    showSubjectPerQuestion={isIncorrectPrevious}
                />
            ) : (
                <PracticeView
                    certName={certName}
                    totalQuestions={totalQuestions}
                    questions={questions}
                    pageSize={PRACTICE_PAGE_SIZE}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    answers={answers}
                    setAnswer={setAnswer}
                    ui={ui}
                    onToggleUi={toggleUi}
                    previousId={previousId}
                    certificateId={certificateIdNum ?? 0}
                    showSubjectPerQuestion={isIncorrectPrevious}
                />
            )}
        </>
    );
};