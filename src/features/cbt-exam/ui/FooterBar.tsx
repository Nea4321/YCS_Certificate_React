import React from "react";
import { TestPagination } from "@/features/cbt";

export function FooterBar({
                              currentPage, totalPages, onPageChange,
                              hasUnanswered, onOpenUnanswered, onOpenCalc,
                              footerRef, styles,
                          }:{
    currentPage:number; totalPages:number; onPageChange:(p:number)=>void;
    hasUnanswered:boolean; onOpenUnanswered:()=>void; onOpenCalc:()=>void;
    footerRef: React.Ref<HTMLDivElement>; styles:any;
}){
    return (
        <div className={styles.examFooterRow} ref={footerRef}>
            <div className={styles.footerLeft}>
                <button className={styles.footerCalcBtn} onClick={onOpenCalc} title="계산기">
                    <img src="/CBTExamView/calc_btn.png" className={styles.calcIcon} alt="" aria-hidden />
                    <span>계산기</span>
                </button>
            </div>

            <div className={styles.footerPagerWrap}>
                <TestPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    containerClassName={styles.footerPager}
                    buttonClassName={styles.footerBtn}
                    pageInfoClassName={styles.footerPage}
                />
            </div>

            <button
                type="button"
                className={`${styles.unansweredFooterBtn} ${!hasUnanswered ? styles.unansweredBtnDisabled : ""}`}
                onClick={hasUnanswered ? onOpenUnanswered : undefined}
                disabled={!hasUnanswered}
                title="안 푼 문제 번호 보기"
            >
                <img src="/CBTExamView/unanswer_icon.png" className={styles.unanswerIcon} alt="" aria-hidden />
                안 푼 문제
            </button>
        </div>
    );
}
