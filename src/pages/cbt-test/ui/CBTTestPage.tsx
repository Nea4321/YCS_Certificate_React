// CBT 문제 페이지
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { CBTTestStyles } from "../styles";
import { Header } from "@/shared/ui/header/Header";
import { QuestionCard } from "@/features/cbt-question/ui/QuestionCard";
import { AnswerSheet } from "@/features/cbt-answersheet/ui/AnswerSheet";
import { TestPagination } from "@/features/cbt-test-pagination/ui/TestPagination";


/**문제 타입 정의
 *
 * @property {number} id - 문제 번호
 * @property {string} text - 문제 본문
 * @property {string} options - 문제 보기 배열
 */
type Question = {
    id: number;
    text: string;
    options: string[];
};

/**총 문제 수 25개의 임시 데이터를 생성
 *
 * 각 문제는 4개의 보기를 포함한다
 *
 * @param {number} i - 문제 인덱스
 * @returns {Question}
 */
const mockQuestions: Question[] = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    text: `문제 ${i + 1} 내용`,
    options: ["보기1", "보기2", "보기3", "보기4"],
}));

/**사용자가 선택한 자격증의 CBT 문제 페이지
 * 이전 CBTStartPage으로 인해 만들어진 쿼리스트링을 받아서 사용한다
 */
export const CBTTestPage: React.FC = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search); // 쿼리스트링을 다루는 URLSearchParams 객체 query

    const mode = query.get("mode"); // 이전 CBTStartPage에서 사용자가 선택한 문제 유형 받아오기
    const date = query.get("date"); // 이전 CBTStartPage에서 사용자가 선택한 시험 일자 받아오기(기출문제)
    const start = query.get("start"); // 이전 CBTStartPage에서 사용자가 선택한 시작 일자 받아오기(랜덤문제)
    const end = query.get("end"); // 이전 CBTStartPage에서 사용자가 선택한 종료 일자 받아오기(랜덤문제)
    const certName = query.get("certName") || ""; // 이전 CBTStartPage에서 사용자가 선택한 CBT 자격증 이름 받아오기
    const modeLabel = mode === "past" ? "기출문제" : "랜덤문제"; // 문제 유형이 past라면 기출 아니면 랜덤

    const totalQuestions = mockQuestions.length; // 총 문제 개수
    const questionsPerPage = 5; // 한 페이지에 보여질 문제 수
    const totalPages = Math.ceil(totalQuestions / questionsPerPage); // 문제 개수 / 보여질 문제 수로 페이지 계산

    const [currentPage, setCurrentPage] = useState(1); // 문제 페이징
    const [answers, setAnswers] = useState<(number | null)[]>(
        Array(totalQuestions).fill(null)
    ); // 답안지 상태 동기화

    /**현재 페이지의 첫 문제 인덱스 값을 받는다*
     *
     * (현재 페이지 -1) * 한 페이지에 보여질 문제 수
     *
     * ex) 3 페이지라면 (3-1)*5 = 10 answers[10] = 11번 문제
     */
    const startIdx = (currentPage - 1) * questionsPerPage;

    /**현재 페이지에 해당하는 문제 목록을 반환
     *
     * ex) 3 페이지라면 mockQuestions.slice(10, 15) -> 11번 ~ 15번 문제
     */
    const currentQuestions = mockQuestions.slice(startIdx, startIdx + questionsPerPage);

    return (
        <div className={CBTTestStyles.testWrapper}>
            <div className={CBTTestStyles.questionArea}>
                <Header />
                <div className={CBTTestStyles.testContent}>
                    <h2 className={CBTTestStyles.testTitle}>{certName || "CBT 시험"}</h2>
                    <div className={CBTTestStyles.testInfo}>
                        <p>
                            <strong>시험 유형:</strong> {modeLabel}
                        </p>
                        {mode === "past" && date && <p><strong>시험 일자:</strong> {date}</p>}
                        {mode === "random" && start && end && (
                            <p><strong>출제 범위:</strong> {start} ~ {end}</p>
                        )}
                        {/*사용자가 이전 CBTStartPage에서 선택한 조건 화면에 표시*/}
                    </div>

                    {currentQuestions.map((q, idx) => ( // 좌측 문제 창
                        <QuestionCard
                            key={q.id}
                            number={q.id}
                            text={q.text}
                            options={q.options}
                            selectedAnswer={answers[startIdx + idx]}
                            onSelect={(opt) => {
                                const updated = [...answers];
                                updated[startIdx + idx] = opt; // startIdx: (현재 페이지 -1) * 5, idx: 문제 순번(0~3),
                                // opt: 사용자가 선택한 보기 번호(1~4)
                                setAnswers(updated);
                                // 버튼을 활성화 하면 해당 라디오 버튼 값(opt)이 updated(answers의 복사본) 배열에 들어가고
                                // setAnswers(updated)로 인해
                                // Answers의 상태를 변경하여 우측 답안지와 동기화 됨(좌,우측 라디오 버튼은 answers를 참조)
                            }}
                        />
                    ))}

                    <TestPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {/*우측 답안지*/}
            <AnswerSheet
                totalQuestions={totalQuestions}
                answers={answers}
                onSelect={(num, opt) => {
                    const updated = [...answers];
                    updated[num - 1] = opt;
                    // num: 문제 번호(1~25)
                    setAnswers(updated);
                    // 버튼을 활성화 하면 해당 라디오 버튼 값(opt)이 updated(answers의 복사본) 배열에 들어가고
                    // setAnswers(updated)로 인해
                    // Answers의 상태를 변경하여 우측 답안지와 동기화 됨(좌,우측 라디오 버튼은 answers를 참조)
                }}
            />
        </div>
    );
};
