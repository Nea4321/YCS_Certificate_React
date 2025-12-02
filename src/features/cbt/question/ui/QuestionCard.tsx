import React from "react";
import { PracticeStyles } from "@/widgets/cbt-practice/styles";

interface QuestionCardProps {
    number: number;
    text: string;
    subject?: string;
    options: string[];
    selectedAnswer: number | null;
    onSelect: (opt: number) => void;
    content?: string | null;
    img?: string | null;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
                                                              number,
                                                              text,
                                                              subject,
                                                              options,
                                                              selectedAnswer,
                                                              onSelect,
                                                              content,
                                                              img,
                                                          }) => (
    <div className={PracticeStyles.qBlock}>
        {subject && <div className={PracticeStyles.subjectBadge}>{subject}</div>}
        <div className={PracticeStyles.qTitle}>
            <span className={PracticeStyles.qNumber}>{number}.</span>
            <span className={PracticeStyles.qText}>{text}</span>
        </div>
        {content ? <div className={PracticeStyles.content}>{content}</div> : null}
        {img ? (
            <div className={PracticeStyles.figure}>
                <img src={img} alt={`문제 ${number} 관련 이미지`} />
            </div>
        ) : null}
        <ul className={PracticeStyles.optList}>
            {options.map((opt, idx) => {
                const optNo = idx + 1;
                return (
                    <li key={optNo} className={PracticeStyles.optItem}>
                        <label className={PracticeStyles.optLabel}>
                            <input
                                type="radio"
                                name={`q${number}`}
                                checked={selectedAnswer === optNo}
                                onChange={() => onSelect(optNo)}
                            />
                            <span className={PracticeStyles.optBullet}>{optNo}</span>
                            <span className={PracticeStyles.optText}>{opt}</span>
                        </label>
                    </li>
                );
            })}
        </ul>
    </div>
);
