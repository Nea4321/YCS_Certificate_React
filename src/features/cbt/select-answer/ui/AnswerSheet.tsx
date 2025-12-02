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
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => {
            const a = answers[num - 1];

            return (
                <div key={num} className={PracticeStyles.answerRowClassic}>
                    <button
                        type="button"
                        className={PracticeStyles.answerNo}
                        onClick={() => onJump(num)}
                    >
                        {num}
                    </button>

                    <div className={PracticeStyles.answerDots}>
                        {[1, 2, 3, 4].map((opt) => (
                            <label
                                key={opt}
                                className={PracticeStyles.dotLabel}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setAnswer(num - 1, opt);
                                }}
                            >
                                <input
                                    type="radio"
                                    name={`a${num}`}
                                    checked={a === opt}
                                    readOnly
                                    tabIndex={-1}
                                    aria-hidden="true"
                                    className={PracticeStyles.sheetRadioHidden}
                                />
                                <span className={PracticeStyles.dotCircle}>{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
            );
        })}
    </div>
);
