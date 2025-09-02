export function UnansweredModal({
                                    numbers, onSelect, onClose, styles
                                }:{
    numbers:number[]; onSelect:(n:number)=>void; onClose:()=>void; styles:any;
}){
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={`${styles.unansweredDialog} ${styles.unansweredClassic}`} onClick={(e)=>e.stopPropagation()}>
                <div className={styles.legacyHeader}>
                    <span className={styles.legacyInfoIcon} aria-hidden/>
                    <span className={styles.legacyTitle}>안 푼 문제 번호 보기 :</span>
                    <span className={styles.legacyDesc}>번호 클릭 시 해당 문제로 이동합니다.</span>
                    <button type="button" className={styles.legacyClose} onClick={onClose} aria-label="닫기">×</button>
                </div>
                <div className={`${styles.numGrid} ${styles.legacyGrid}`}>
                    {numbers.map(n=>(
                        <button key={n} type="button" className={styles.numBtnLegacy} onClick={()=>onSelect(n)} title={`${n}번으로 이동`}>
                            {n}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
