import React from "react";
import { PracticeStyles } from "@/widgets/cbt-practice/styles";

interface AnswerSheetProps {
    totalQuestions: number;
    answers: (number | null)[];
    setAnswer: (index: number, opt: number | null) => void;
    onJump: (questionNumber: number) => void;
}

export const AnswerSheet: React.FC<AnswerSheetProps> = ({
                                                            totalQuestions,
                                                            answers,
                                                            setAnswer,
                                                            onJump,
                                                        }) => (
    <div className={PracticeStyles.answerSheet}>
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => (
            <div
                key={num}
                className={PracticeStyles.answerRowClassic}
                onClick={() => onJump(num)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onJump(num)}
            >
                <div className={PracticeStyles.answerNo}>{num}</div>
                <div className={PracticeStyles.answerDots}>
                    {[1, 2, 3, 4].map((opt) => (
                        <label key={opt} onClick={(e) => e.stopPropagation()} className={PracticeStyles.dotLabel}>
                            <input
                                type="radio"
                                name={`a${num}`}
                                checked={answers[num - 1] === opt}
                                onChange={() => {
                                    setAnswer(num - 1, opt);
                                    onJump(num);
                                }}
                            />
                            <span className={PracticeStyles.dotCircle}>{opt}</span>
                        </label>
                    ))}
                </div>
            </div>
        ))}
    </div>
);
