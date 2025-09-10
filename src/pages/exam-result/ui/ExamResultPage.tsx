import { useNavigate, useSearchParams } from "react-router-dom";
import { ExamResultStyles } from "../styles";

export function ExamResultPage() {
    const nav = useNavigate();
    const [qs] = useSearchParams();

    const certName = qs.get("certName") ?? "";
    const candidateName = "수험자 (00000000)";
    const score = 0;
    const passed = false;

    const handleDone = () => nav("/cbt");

    return (
        <div className={ExamResultStyles.wrap}>
            <div className={ExamResultStyles.panel}>
                {/* 헤더 (메가폰) */}
                <div className={ExamResultStyles.head}>
                    <span className={ExamResultStyles.headIcon} aria-hidden
                          style={{
                              backgroundImage: "url('/CBTExamView/result_megaphone.png')",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center",
                              backgroundSize: "contain",
                          }}
                    />
                    <span className={ExamResultStyles.headText}>
            다음 기회에 꼭 합격하시길 기원합니다.
          </span>
                </div>

                {/* 표 */}
                <table className={ExamResultStyles.table}>
                    <colgroup>
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "35%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "25%" }} />
                    </colgroup>
                    <thead>
                    <tr>
                        <th>수험자 이름</th>
                        <th>응시 종목</th>
                        <th>득점</th>
                        <th>합격여부</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className={ExamResultStyles.tdName}>{candidateName}</td>
                        <td>{certName}</td>
                        <td className={ExamResultStyles.txtRed}>{score}</td>
                        <td className={passed ? ExamResultStyles.pass : ExamResultStyles.txtRed}>
                            {passed ? "합격" : "불합격"}
                        </td>
                    </tr>
                    </tbody>
                </table>

                {/* 하단 문구 */}
                <div className={ExamResultStyles.quote}>
                    “득점 및 합격여부를 확인하셨습니까?”
                </div>
            </div>
            <div className={ExamResultStyles.actionsOutside}>
                <button
                    type="button"
                    className={ExamResultStyles.doneBtn}
                    onClick={handleDone}
                    style={{
                        backgroundImage: "url('/CBTExamView/submit_bg.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                    }}
                >
                    확인 완료
                </button>
            </div>
        </div>
    );
}