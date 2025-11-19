import type { QuestionDTO } from "@/entities/cbt/model/types";
import { ExamStyles } from "@/widgets/cbt-exam/styles"

type UiQuestion = QuestionDTO & {
    question_type_id?: number;
    question_type_name?: string;
};

export function QuestionPaper({
                                  slice, startIdx, answers, setAnswer, fontZoom, allQuestions
                              }:{
    slice: QuestionDTO[]; startIdx:number;
    answers:(number|null)[]; setAnswer:(i:number,v:number|null)=>void;
    fontZoom:0.75|1|1.25;
    allQuestions: UiQuestion[];
}){
    return (
        <div className={ExamStyles.paper} style={{["--qScaleQ" as any]: fontZoom}}>
            {slice.map((q, i) => {
                const gi = startIdx + i;
                const groupName = `q-${q.question_id}`;
                const questionNo = gi + 1;
                const globalIndex = startIdx + i;          // 🔹 전체 문제에서의 인덱스
                const prevGlobal =
                    globalIndex > 0 ? allQuestions[globalIndex - 1] : null;


                const showSubjectHeader =
                    q.question_type_name &&
                    (!prevGlobal ||
                        prevGlobal.question_type_id !== q.question_type_id);
                return (
                    <div key={q.question_id} id={`q-${questionNo}`} className={ExamStyles.qblock}>
                        {showSubjectHeader && (
                            <div className={ExamStyles.subjectHeader}>
                                {q.question_type_name}
                            </div>
                        )}
                        <div className={ExamStyles.qnum}>{questionNo}. {q.text}</div>
                        {q.content &&
                            <div className={ExamStyles.content}>{q.content}</div>
                        }
                        <ol className={ExamStyles.opts}>
                            {q.answers.map((answer, idx) => {
                                const v = idx + 1;
                                return (
                                    <li key={v} className={ExamStyles.opt}>
                                        <label className={ExamStyles.optLabel}>
                                            <input
                                                type="radio"
                                                name={groupName}
                                                className={ExamStyles.optRadio}
                                                checked={answers[gi] === v}
                                                onChange={() => setAnswer(gi, v)}
                                                aria-label={`${v}번 보기 선택`}
                                            />
                                            <span className={`${ExamStyles.optImg} ${ExamStyles[`optImg${v}`]}`}
                                                  style={{
                                                      backgroundImage: `url(${
                                                          answers[gi] === v
                                                              ? "/CBTExamView/numcheck.png"
                                                              : `/CBTExamView/num0${v}.png`
                                                      })`,
                                                      backgroundRepeat: "no-repeat",
                                                      backgroundPosition: "center",
                                                      backgroundSize: "contain",
                                                  }}
                                                  aria-hidden="true"
                                            />
                                            <span className={ExamStyles.optText}>{answer.content}</span>
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
