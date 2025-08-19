// CBT 페이지 우측 답안지
import React from "react";
import { CBTTestStyles } from "@/pages/cbt-test/styles";

/**AnswerSheet 컴포넌트에 전달되는 props
 *
 * @property {number} totalQuestions - 총 문제 수
 * @property {number[]} answers - 정답 상태를 저장한 배열
 * @property {num: number, opt: number} onSelect - 사용자가 답을 선택할 때 호출되는 콜백
 */
interface AnswerSheetProps {
    totalQuestions: number;
    answers: (number | null)[];
    onSelect: (num: number, opt: number) => void;
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
                                                            onSelect,
                                                        }) => (
    <div className={CBTTestStyles.answerArea}>
        <h3 className={CBTTestStyles.answerTitle}>답안지</h3>
        <div className={CBTTestStyles.answerGrid}>
            {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => (
                <div key={num} className={CBTTestStyles.answerRow}>
                    <span>{String(num).padStart(2, "0")}.</span> {/*생성된 답안지의 번호는 두자리 폼(padStart(2, '0')*/}
                    {[1, 2, 3, 4].map((opt) => (// map으로 radio 버튼 1,2,3,4 반복 생성
                                                                // opt = 선택지 번호(1~4)
                        <label key={opt}>
                            <input
                                type="radio"
                                name={`a${num}`}
                                checked={answers[num - 1] === opt} // num: 문제 번호
                                onChange={() => onSelect(num, opt)}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            ))}
        </div>
        <button className={CBTTestStyles.submitBtn} disabled>
            채점하기
        </button>
    </div>
);
