import React from "react";
import { ExamStyles } from "@/widgets/cbt-exam/styles";

export function ExamHeader({
                               certName, limitMin, leftTime, headerRef,
                           }:{
    certName:string; limitMin:number; leftTime:string;
    headerRef: React.Ref<HTMLDivElement>;
}){
    return (
        <div className={ExamStyles.examHeader} ref={headerRef}
             style={{
                 backgroundImage: "url('/CBTExamView/header_bg.png')",
                 backgroundRepeat: "repeat-x",
                 backgroundPosition: "left",
                 backgroundSize: "top",
             }}>
            <div className={ExamStyles.examTitle}>{certName}</div>
            <div className={ExamStyles.headerRight}>
                <span className={ExamStyles.timerIcon}
                      style={{
                          backgroundImage: "url('/CBTExamView/clock_icon.png')",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          backgroundSize: "contain",
                      }}/>
                <div className={ExamStyles.headerTimer}>
                    <div className={ExamStyles.timerRow}>
                        <span className={ExamStyles.timerLabel}>제한 시간 :</span>
                        <span className={ExamStyles.timerValue}>{limitMin}분</span>
                    </div>
                    <div className={ExamStyles.timerRemaining}>
                        <span className={ExamStyles.timerLabel}>남은 시간 :</span>
                        <span className={ExamStyles.timerLeft}>{leftTime}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
