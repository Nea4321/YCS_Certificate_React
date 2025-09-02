export function AnswerSheet({
                                totalQuestions, answers, setAnswer, styles
                            }:{
    totalQuestions:number; answers:(number|null)[]; setAnswer:(i:number,v:number|null)=>void;
    styles:any;
}){
    return (
        <aside className={styles.examSheet}>
            <div className={styles.sheetHeader}>답안 표기란</div>
            {Array.from({length: totalQuestions}, (_,i)=>i+1).map(n=>{
                const a = answers[n-1];
                return (
                    <div key={n} className={styles.sheetRow}>
                        <div className={styles.sheetRowNum}>{n}</div>
                        <div className={styles.circleChoices}>
                            {[1,2,3,4].map(v=>(
                                <label key={v}
                                       className={`${styles.circleChoice} ${a===v?styles.circleChoiceActive:""}`}
                                       title={`${n}번: ${v}`}>
                                    <input
                                        type="radio"
                                        name={`sheet-${n}`}
                                        checked={a===v}
                                        onChange={()=>setAnswer(n-1, v)}
                                        className={styles.sheetRadio}
                                    />
                                    <span className={`${styles.ansImg} ${styles[`ansImg${v}`]}`} aria-hidden="true"/>
                                </label>
                            ))}
                        </div>
                    </div>
                );
            })}
        </aside>
    );
}
