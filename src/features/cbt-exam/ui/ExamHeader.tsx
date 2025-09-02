import React from "react";

export function ExamHeader({
                               certName, limitMin, leftTime, headerRef, styles,
                           }:{
    certName:string; limitMin:number; leftTime:string;
    headerRef: React.Ref<HTMLDivElement>; styles:any;
}){
    return (
        <div className={styles.examHeader} ref={headerRef}>
            <div className={styles.examTitle}>{certName}</div>
            <div className={styles.headerRight}>
                <span className={styles.timerIcon} />
                <div className={styles.headerTimer}>
                    <div className={styles.timerRow}>
                        <span className={styles.timerLabel}>제한 시간 :</span>
                        <span className={styles.timerValue}>{limitMin}분</span>
                    </div>
                    <div className={styles.timerRemaining}>
                        <span className={styles.timerLabel}>남은 시간 :</span>
                        <span className={styles.timerLeft}>{leftTime}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
