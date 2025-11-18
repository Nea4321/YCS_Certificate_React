import React from "react";
import { ExamStyles } from "@/widgets/cbt-exam/styles"
import type { LayoutMode } from "@/features/cbt-exam/model/useExamPaging";

export function ExamToolbar({
                                fontZoom, setFontZoom, layout, setLayout, onLayoutChange,
                                totalQuestions, unanswered, toolbarRef, onToggleUi,
                            }:{
    fontZoom:0.75|1|1.25; setFontZoom:React.Dispatch<React.SetStateAction<0.75|1|1.25>>;
    layout:LayoutMode; setLayout:(m:LayoutMode)=>void; onLayoutChange:(m:LayoutMode)=>void;
    totalQuestions:number; unanswered:number;
    toolbarRef: React.Ref<HTMLDivElement>;
    onToggleUi?: () => void;
}){
    const change = (next:LayoutMode) => { setLayout(next); onLayoutChange(next); };

    return (
        <div className={ExamStyles.examToolbar} ref={toolbarRef}>
            <div className={ExamStyles.toolbarGroup}>
                <span className={ExamStyles.toolbarLabel}>글자크기</span>
                <button
                    className={`${ExamStyles.percentBtn} ${fontZoom===0.75?ExamStyles.percentBtnActive:""}`}
                    onClick={()=>setFontZoom(0.75)}
                    style={{ backgroundImage: fontZoom===0.75 ? `url('/CBTExamView/fontzoom100select.png')` : `url('/CBTExamView/fontzoom100.png')`, backgroundSize:"cover" }}
                    aria-label="글자 100%"
                />
                <button
                    className={`${ExamStyles.percentBtn} ${fontZoom===1?ExamStyles.percentBtnActive:""}`}
                    onClick={()=>setFontZoom(1)}
                    style={{ backgroundImage: fontZoom===1 ? `url('/CBTExamView/fontzoom150select.png')` : `url('/CBTExamView/fontzoom150.png')`, backgroundSize:"cover" }}
                    aria-label="글자 150%"
                />
                <button
                    className={`${ExamStyles.percentBtn} ${fontZoom===1.25?ExamStyles.percentBtnActive:""}`}
                    onClick={()=>setFontZoom(1.25)}
                    style={{ backgroundImage: fontZoom===1.25 ? `url('/CBTExamView/fontzoom200select.png')` : `url('/CBTExamView/fontzoom200.png')`, backgroundSize:"cover" }}
                    aria-label="글자 200%"
                />
            </div>

            <div className={ExamStyles.toolbarDivider} />

            <div className={ExamStyles.toolbarGroup}>
                <span className={ExamStyles.toolbarLabel}>화면배치</span>
                <button
                    className={`${ExamStyles.layoutBtn} ${layout==="twoCol"?ExamStyles.layoutBtnActive:""}`}
                    title="기본" onClick={()=>change("twoCol")}
                    style={{ backgroundImage: layout==="twoCol" ? `url('/CBTExamView/layout1_on.png')` : `url('/CBTExamView/layout1_off.png')`, backgroundSize:"cover" }}
                />
                <button
                    className={`${ExamStyles.layoutBtn} ${layout==="narrowSheet"?ExamStyles.layoutBtnActive:""}`}
                    title="분할" onClick={()=>change("narrowSheet")}
                    style={{ backgroundImage: layout==="narrowSheet" ? `url('/CBTExamView/layout2_on.png')` : `url('/CBTExamView/layout2_off.png')`, backgroundSize:"cover" }}
                />
                <button
                    className={`${ExamStyles.layoutBtn} ${layout==="oneCol"?ExamStyles.layoutBtnActive:""}`}
                    title="한 문제" onClick={()=>change("oneCol")}
                    style={{ backgroundImage: layout==="oneCol" ? `url('/CBTExamView/layout3_on.png')` : `url('/CBTExamView/layout3_off.png')`, backgroundSize:"cover" }}
                />
            </div>
            <div className={ExamStyles.toolbarDivider} />
            {onToggleUi && (
                <button
                    type="button"
                    className={ExamStyles.modeSwitchBtn}
                    onClick={onToggleUi}
                >
                    화면모드 전환
                </button>
            )}

            <div className={ExamStyles.toolbarCounters}>
                <div className={ExamStyles.counterRow}>
                    <span className={ExamStyles.counterLabel}>전체 문제 수 :</span>
                    <span className={ExamStyles.counterNum}>{totalQuestions}</span>
                </div>
                <div className={ExamStyles.counterRow}>
                    <span className={ExamStyles.counterLabel}>안 푼 문제 수 :</span>
                    <span className={`${ExamStyles.counterNum} ${ExamStyles.counterNumWarn}`}>{unanswered}</span>
                </div>
            </div>
        </div>
    );
}
