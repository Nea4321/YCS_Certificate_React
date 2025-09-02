import React from "react";
import type { Question } from "@/entities/cbt/model/types";

export function QuestionPaper({
                                  slice, startIdx, answers, setAnswer, fontZoom, styles,
                              }:{
    slice: Question[]; startIdx:number;
    answers:(number|null)[]; setAnswer:(i:number,v:number|null)=>void;
    fontZoom:0.75|1|1.25; styles:any;
}){
    return (
        <div className={styles.paper} style={{["--qScaleQ" as any]: fontZoom}}>
            {slice.map((q, i) => {
                const gi = startIdx + i;
                const groupName = `q-${q.id}`;
                return (
                    <div key={q.id} className={styles.qblock}>
                        <div className={styles.qnum}>{q.id}. {q.text}</div>
                        <ol className={styles.opts}>
                            {q.options.map((opt, idx) => {
                                const v = idx + 1;
                                return (
                                    <li key={v} className={styles.opt}>
                                        <label className={styles.optLabel}>
                                            <input
                                                type="radio"
                                                name={groupName}
                                                className={styles.optRadio}
                                                checked={answers[gi] === v}
                                                onChange={() => setAnswer(gi, v)}
                                                aria-label={`${v}번 보기 선택`}
                                            />
                                            <span className={`${styles.optImg} ${styles[`optImg${v}`]}`} aria-hidden="true"/>
                                            <span className={styles.optText}>{opt}</span>
                                        </label>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                );
            })}
        </div>
    );
}
