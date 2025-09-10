import React from "react";
import { TestPagination } from "@/features/cbt";
import { ExamStyles } from "@/widgets/cbt-exam/styles";

type Props = {
    currentPage: number;
    totalPages: number;
    onPageChange: (p: number) => void;

    onOpenCalc: () => void;
    onOpenUnanswered: () => void;
    onSubmitClick: () => void;
    unansweredDisabled: boolean;

    footerRef: React.Ref<HTMLDivElement>;
};

export const FooterBar: React.FC<Props> = ({
                                               currentPage,
                                               totalPages,
                                               onPageChange,
                                               onOpenCalc,
                                               onOpenUnanswered,
                                               onSubmitClick,
                                               unansweredDisabled,
                                               footerRef,
                                           }) => {

    const pagerBtnStyle: React.CSSProperties = {
        backgroundImage: "url('/CBTExamView/footer_btn.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "center",
    };

    return (

        <div className={ExamStyles.examFooterRow} ref={footerRef}>
            <div className={ExamStyles.footerLeft}>
                <button className={ExamStyles.footerCalcBtn} onClick={onOpenCalc} title="계산기"
                        style={{
                            backgroundImage: "url('/CBTExamView/footer_btn.png')",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "center",
                        }}>
                    <img src="/CBTExamView/calc_btn.png" className={ExamStyles.calcIcon} alt="" aria-hidden />
                    <span>계산기</span>
                </button>
            </div>

            {/* 가운데: 페이징 */}
            <div className={ExamStyles.footerPagerWrap}>
                <TestPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    containerClassName={ExamStyles.footerPager}
                    buttonClassName={ExamStyles.footerBtn}
                    pageInfoClassName={ExamStyles.footerPage}
                    buttonStyle={pagerBtnStyle}
                />
            </div>

            {/* 우측: 안 푼 문제 / 제출 */}
            <div className={ExamStyles.footerRight}>
                <button
                    type="button"
                    className={`${ExamStyles.unansweredFooterBtn} ${
                        unansweredDisabled ? ExamStyles.unansweredBtnDisabled : ""
                    }`}
                    style={{
                        backgroundImage: "url('/CBTExamView/footer_btn.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "center",
                    }}
                    onClick={!unansweredDisabled ? onOpenUnanswered : undefined}
                    disabled={unansweredDisabled}
                    title="안 푼 문제 번호 보기"
                >
                    <img
                        src="/CBTExamView/unanswer_icon.png"
                        className={ExamStyles.unanswerIcon}
                        alt=""
                        aria-hidden
                    />
                    안 푼 문제
                </button>

                <button
                    type="button"
                    className={ExamStyles.submitBtn}
                    onClick={onSubmitClick}
                    title="답안 제출"
                    style={{
                        backgroundImage: "url('/CBTExamView/submit_bg.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                    }}
                >
                    <img
                        src="/CBTExamView/submit_icon.png"
                        className={ExamStyles.submitIcon}
                        alt=""
                        aria-hidden
                    />
                    답안 제출
                </button>
            </div>
        </div>
    );
};
