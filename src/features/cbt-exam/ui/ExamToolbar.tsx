import React from "react";
import type { LayoutMode } from "../../model/useExamPaging";

export function ExamToolbar({
                                fontZoom, setFontZoom, layout, setLayout, onLayoutChange,
                                totalQuestions, unanswered, toolbarRef, styles,
                            }:{
    fontZoom:0.75|1|1.25; setFontZoom:React.Dispatch<React.SetStateAction<0.75|1|1.25>>;
    layout:LayoutMode; setLayout:(m:LayoutMode)=>void; onLayoutChange:(m:LayoutMode)=>void;
    totalQuestions:number; unanswered:number;
    toolbarRef: React.Ref<HTMLDivElement>; styles:any;
}){
    const change = (next:LayoutMode) => { setLayout(next); onLayoutChange(next); };

    return (
        <div className={styles.examToolbar} ref={toolbarRef}>
            <div className={styles.toolbarGroup}>
                <span className={styles.toolbarLabel}>글자크기</span>
                <button
                    className={`${styles.percentBtn} ${fontZoom===0.75?styles.percentBtnActive:""}`}
                    onClick={()=>setFontZoom(0.75)}
                    style={{ backgroundImage: fontZoom===0.75 ? `url('/CBTExamView/fontzoom100%select.png')` : `url('/CBTExamView/fontzoom100%.png')`, backgroundSize:"cover" }}
                    aria-label="글자 100%"
                />
                <button
                    className={`${styles.percentBtn} ${fontZoom===1?styles.percentBtnActive:""}`}
                    onClick={()=>setFontZoom(1)}
                    style={{ backgroundImage: fontZoom===1 ? `url('/CBTExamView/fontzoom150%select.png')` : `url('/CBTExamView/fontzoom150%.png')`, backgroundSize:"cover" }}
                    aria-label="글자 150%"
                />
                <button
                    className={`${styles.percentBtn} ${fontZoom===1.25?styles.percentBtnActive:""}`}
                    onClick={()=>setFontZoom(1.25)}
                    style={{ backgroundImage: fontZoom===1.25 ? `url('/CBTExamView/fontzoom200%select.png')` : `url('/CBTExamView/fontzoom200%.png')`, backgroundSize:"cover" }}
                    aria-label="글자 200%"
                />
            </div>

            <div className={styles.toolbarDivider} />

            <div className={styles.toolbarGroup}>
                <span className={styles.toolbarLabel}>화면배치</span>
                <button
                    className={`${styles.layoutBtn} ${layout==="twoCol"?styles.layoutBtnActive:""}`}
                    title="기본" onClick={()=>change("twoCol")}
                    style={{ backgroundImage: layout==="twoCol" ? `url('/CBTExamView/layout1_on.png')` : `url('/CBTExamView/layout1_off.png')`, backgroundSize:"cover" }}
                />
                <button
                    className={`${styles.layoutBtn} ${layout==="narrowSheet"?styles.layoutBtnActive:""}`}
                    title="분할" onClick={()=>change("narrowSheet")}
                    style={{ backgroundImage: layout==="narrowSheet" ? `url('/CBTExamView/layout2_on.png')` : `url('/CBTExamView/layout2_off.png')`, backgroundSize:"cover" }}
                />
                <button
                    className={`${styles.layoutBtn} ${layout==="oneCol"?styles.layoutBtnActive:""}`}
                    title="한 문제" onClick={()=>change("oneCol")}
                    style={{ backgroundImage: layout==="oneCol" ? `url('/CBTExamView/layout3_on.png')` : `url('/CBTExamView/layout3_off.png')`, backgroundSize:"cover" }}
                />
            </div>

            <div className={styles.toolbarCounters}>
                <div className={styles.counterRow}>
                    <span className={styles.counterLabel}>전체 문제 수 :</span>
                    <span className={styles.counterNum}>{totalQuestions}</span>
                </div>
                <div className={styles.counterRow}>
                    <span className={styles.counterLabel}>안 푼 문제 수 :</span>
                    <span className={`${styles.counterNum} ${styles.counterNumWarn}`}>{unanswered}</span>
                </div>
            </div>
        </div>
    );
}
