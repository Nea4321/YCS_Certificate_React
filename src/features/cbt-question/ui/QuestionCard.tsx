// CBT 페이지 좌측 문제
import React from "react";
import { CBTTestStyles } from "@/pages/cbt-test/styles";

/**QuestionCard에 전달되는 props
 *
 * @property {number} number - 문제 번호
 * @property {string} text - 문제 본문
 * @property {string[]} options - 문제 보기 배열
 * @property {number | null} selectedAnswer - 사용자가 선택한 답
 * @property {(opt: number) => void} onSelect - 사용자가 답을 선택할 때 호출되는 콜백
 */
interface QuestionCardProps {
    number: number;
    text: string;
    options: string[];
    selectedAnswer: number | null;
    onSelect: (opt: number) => void;
}

/**CBT 문제 페이지의 좌측 문제 컴포넌트
 * - 문제마다 4개의 보기가 존재하며 사용자가 선택하면 onSelect 콜백을 호출하여
 * 부모 컴포넌트 CBTTestPage.tsx의 answers 상태가 갱신된다
 * - 갱신된 answers 배열과 동기화하여 우측 답안지 컴포넌트와 상태를 공유한다
 *
 * @component
 *
 * @example
 * <QuestionCard
 *   number={3}
 *   text="다음 중 옳은 것은?"
 *   options={['A', 'B', 'C', 'D']}
 *   selectedAnswer={answers[2]}
 *   onSelect={(opt) => update(2, opt)}
 * />
 */
export const QuestionCard: React.FC<QuestionCardProps> = ({
                                                              number,
                                                              text,
                                                              options,
                                                              selectedAnswer,
                                                              onSelect,
                                                          }) => (
    <div className={CBTTestStyles.questionCard}>
        <div className={CBTTestStyles.questionHeader}>문제 {number}</div>
        <p className={CBTTestStyles.questionText}>{text}</p>
        <div className={CBTTestStyles.choices}>
            {options.map((opt, idx) => (
                // idx: 보기(radio 버튼) 순번(0~3)
                <label key={idx} className={CBTTestStyles.choiceItem}>
                    <input // map으로 radio 버튼 1,2,3,4 반복 생성
                        // 각 라디오 버튼 값이 해당 버튼의 키 값이 됨(opt)
                        type="radio"
                        name={`q${number}`}
                        checked={selectedAnswer === idx + 1}
                        // idx + 1: 보기(radio 버튼) 번호(1~4)
                        onChange={() => onSelect(idx + 1)}
                    />
                    {idx + 1}. {opt}
                </label>
            ))}
        </div>
    </div>
);
