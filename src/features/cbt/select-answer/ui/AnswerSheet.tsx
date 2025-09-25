// CBT 페이지 우측 답안지
import React from "react";
import { PracticeStyles } from "@/widgets/cbt-practice/styles";

/**AnswerSheet 컴포넌트에 전달되는 props
 *
 * @property {number} totalQuestions - 총 문제 수
 * @property {number[]} answers - 정답 상태를 저장한 배열
 * @property {num: number, opt: number} onSelect - 사용자가 답을 선택할 때 호출되는 콜백
 */
interface AnswerSheetProps {
    totalQuestions: number;
    answers: (number | null)[];
    setAnswer: (index: number, opt: number | null) => void;
    onJump: (questionNumber: number) => void;
}

/**CBT 문제 페이지의 우측 답안지 컴포넌트
 *
 * - 문제마다 4개의 보기가 존재하며 사용자가 선택하면 onSelect 콜백을 호출하여
 * 부모 컴포넌트 CBTTestPage 의 answers 상태가 갱신된다
 * - 갱신된 answers 배열과 동기화하여 좌측 문제 컴포넌트와 상태를 공유한다
 *
 * @component
 *
 * @example
 * <AnswerSheet
 *  totalQuestions={25}
 *  answers={[1,2,4,null,...]}
 *  onSelect={(num, opt) => {
 *  }}/>
 */
export const AnswerSheet: React.FC<AnswerSheetProps> = ({
                                                            totalQuestions,
                                                            answers,
                                                            setAnswer,
                                                            onJump, // onSelect -> onJump
                                                        }) => (
    <div className={PracticeStyles.answerArea}>
        <div className={PracticeStyles.answerSheetContent}>
            <h3 className={PracticeStyles.answerTitle}>답안지</h3>
            <div className={PracticeStyles.answerGrid}>
                {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => (
                    <div
                        key={num}
                        className={PracticeStyles.answerRow}
                        // 💡 행 전체를 클릭하면 onJump 호출
                        onClick={() => onJump(num)}
                    >
                        <div className={PracticeStyles.answerNumber}>{String(num).padStart(2, "0")}</div>
                        <div className={PracticeStyles.answerOptions}>
                            {[1, 2, 3, 4].map((opt) => (
                                <label key={opt} onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="radio"
                                        name={`a${num}`}
                                        checked={answers[num - 1] === opt}
                                        onChange={() => {
                                            setAnswer(num - 1, opt);
                                            onJump(num);
                                        }}
                                    />
                                    <span>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className={PracticeStyles.submitBtnWrapper}>
            <button className={PracticeStyles.submitBtn}>
                채점하기
            </button>
        </div>
    </div>
);