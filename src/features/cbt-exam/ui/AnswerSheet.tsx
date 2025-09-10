import { ExamStyles } from "@/widgets/cbt-exam/styles";

export function AnswerSheet({
                                totalQuestions, answers, setAnswer,
                            }:{
    totalQuestions:number; answers:(number|null)[]; setAnswer:(i:number,v:number|null)=>void;
}){
    return (
        <aside className={ExamStyles.examSheet}>
            <div className={ExamStyles.sheetHeader}
                 style={{
                     backgroundImage: "url('/CBTExamView/answer_title_bg.png')",
                     backgroundRepeat: "repeat-x",
                     backgroundPosition: "left",
                     backgroundSize: "top",
                 }}
            >답안 표기란</div>
            {Array.from({length: totalQuestions}, (_,i)=>i+1).map(n=>{
                const a = answers[n-1];
                return (
                    <div key={n} className={ExamStyles.sheetRow}>
                        <div className={ExamStyles.sheetRowNum}>{n}</div>
                        <div className={ExamStyles.circleChoices}>
                            {[1, 2, 3, 4].map((v) => (
                                <label
                                    key={v}
                                    className={`${ExamStyles.circleChoice} ${a === v ? ExamStyles.circleChoiceActive : ""}`}
                                    title={`${n}번: ${v}`}
                                >
                                    <input
                                        type="radio"
                                        name={`sheet-${n}`}
                                        checked={a === v}
                                        onChange={() => setAnswer(n - 1, v)}
                                        className={ExamStyles.sheetRadio}
                                    />
                                    <span
                                        className={ExamStyles.ansImg}
                                        aria-hidden="true"
                                        style={{
                                            backgroundImage: `url(${
                                                a === v
                                                    ? "/CBTExamView/check_answer.png"
                                                    : `/CBTExamView/num0${v}_answer.png`
                                            })`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            backgroundSize: "contain",
                                        }}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                );
            })}
        </aside>
    );
}
