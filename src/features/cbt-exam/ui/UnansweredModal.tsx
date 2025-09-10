import { ExamStyles } from "@/widgets/cbt-exam/styles";

export function UnansweredModal({
                                    numbers, onSelect, onClose
                                }:{
    numbers:number[]; onSelect:(n:number)=>void; onClose:()=>void;
}){
    return (
        <div className={ExamStyles.overlay} onClick={onClose}>
            <div className={`${ExamStyles.unansweredDialog} ${ExamStyles.unansweredClassic}`} onClick={(e)=>e.stopPropagation()}>
                <div className={ExamStyles.legacyHeader}>
                    <span className={ExamStyles.legacyInfoIcon} aria-hidden
                          style={{
                              backgroundImage: "url('/CBTExamView/what_icon.png')",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center",
                              backgroundSize: "center",
                          }}
                    />
                    <span className={ExamStyles.legacyTitle}>안 푼 문제 번호 보기 :</span>
                    <span className={ExamStyles.legacyDesc}>번호 클릭 시 해당 문제로 이동합니다.</span>
                    <button type="button" className={ExamStyles.legacyClose} onClick={onClose} aria-label="닫기">×</button>
                </div>
                <div className={`${ExamStyles.numGrid} ${ExamStyles.legacyGrid}`}>
                    {numbers.map(n=>(
                        <button key={n} type="button" className={ExamStyles.numBtnLegacy} onClick={()=>onSelect(n)} title={`${n}번으로 이동`}>
                            {n}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
