import { ExamStyles } from "@/widgets/cbt-exam/styles";

export function SubmitConfirmModal({
                                       unansweredCount,
                                       onCancel,
                                       onConfirm,
                                   }: {
    unansweredCount: number;        // 0이면 전부 답변 완료
    onCancel: () => void;
    onConfirm: () => void;
}) {
    const hasUnanswered = unansweredCount > 0;

    const mainMessage = hasUnanswered
        ? `안 푼 문제가 ${unansweredCount}개 존재합니다. 그래도 답안을 제출하시겠습니까?`
        : `답안을 제출하시겠습니까?`;

    return (
        <div className={ExamStyles.overlay} onClick={onCancel}>
            <div
                className={ExamStyles.submitWarn}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="submit-warn-title"
            >
                {/* 상단 경고 바 */}
                <div className={ExamStyles.submitWarnHead}>
                    <div className={ExamStyles.submitWarnHeadCenter}>
                        <span className={ExamStyles.submitWarnIcon} aria-hidden
                        style={{
                            backgroundImage: "url('/CBTExamView/warning_icon.png')",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                        }}
                        />
                        <h3 id="submit-warn-title" className={ExamStyles.submitWarnTitle}>주의</h3>
                    </div>
                    <button
                        type="button"
                        className={ExamStyles.submitWarnClose}
                        onClick={onCancel}
                        style={{
                            backgroundImage: "url('/CBTExamView/submit_close.png')",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                        }}
                        aria-label="닫기"
                    />
                </div>

                {/* 본문 */}
                <div className={ExamStyles.submitWarnBody}
                     style={{
                         backgroundImage: "url('/CBTExamView/submitWran_bg.png')",
                         backgroundRepeat: "no-repeat",
                         backgroundPosition: "center",
                         backgroundSize: "center",
                     }}>
                    <p className={ExamStyles.submitWarnMsg}>{mainMessage}</p>

                    <p className={ExamStyles.submitWarnNote}>
                        [ 답안 제출 이후에는 문제풀이가 불가합니다. ]
                    </p>
                </div>

                {/* 하단 버튼 */}
                <div className={ExamStyles.submitWarnFoot}>
                    <button type="button" className={ExamStyles.submitWarnBtnYes} onClick={onConfirm}
                            style={{
                                backgroundImage: "url('/CBTExamView/submit_yes.png')",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "center",
                            }}>
                        예
                    </button>
                    <button type="button" className={ExamStyles.submitWarnBtnNo} onClick={onCancel}
                            style={{
                                backgroundImage: "url('/CBTExamView/submit_bg.png')",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "center",
                            }}>
                        아니오
                    </button>
                </div>
            </div>
        </div>
    );
}
