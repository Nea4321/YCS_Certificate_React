import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { myPageStyles } from "@/pages/dashboard/styles";
import {ChevronUp} from "lucide-react";

export interface UserCbtHistoryList {
    previous_id: number;
    score: number;
    correct_count: number;
    created_at: string;
    left_time: number;
}

export interface UserCbtHistoryCert {
    certificate_id: number;
    certificate_name: string;
    list: UserCbtHistoryList[];
}

// API 호출
export const UserGetCbtHistory = async (): Promise<UserCbtHistoryCert[]> => {
    const response = await axios.get("/api/user/cbt", { withCredentials: true });
    return response.data;
};

// 시간을 "mm분 ss초" 포맷으로
const formatDuration = (sec: number) => {
    const left_time = 5400 - sec;
    const m = Math.floor(left_time / 60);
    const s = left_time % 60;
    return `${m}분 ${s}초`;
};

const formatDate = (iso: string) => {
    const date = new Date(iso);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

// 컴포넌트
export const CbtHistoryList: React.FC = () => {
    const [cbtRecords, setCbtRecords] = useState<UserCbtHistoryCert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string[]>([]);
    const params = new URLSearchParams(location.search);


    const navigate = useNavigate();
    // const cbtHistory = useSelector((state: RootState) => state.userCbtHistory);

    useEffect(() => {
        const fetchCbtHistory = async () => {
            try {
                const data = await UserGetCbtHistory();
                setCbtRecords(data);
            } catch (err) {
                console.error("CBT 기록 불러오기 실패", err);
                setError("CBT 기록을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchCbtHistory();
    }, []);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;
    if (cbtRecords.length === 0) return <p>CBT 기록이 없습니다.</p>;

    // 그룹화 -> 자격증 이름이 키, 시험 기록이 데이터 로 맵? 배열을 만듬
    // A 자격증 -> {...},{...} / B자격증 -> {...}
    // const grouped = cbtRecords.reduce((acc: Record<string, UserCbtHistory[]>, r) => {
    //     if (!acc[r.certificate_name]) acc[r.certificate_name] = [];
    //     acc[r.certificate_name].push(r);
    //     return acc;
    // }, {});

    // 문제 보기 버튼을 누르면 실행되는 함수
    // 눌렀을 때 expande(자격증 이름 들어가는 배열) 이 비어있으면 이름을 추가하고 펼침
    // 값이 이미 있으면 expnaded 에 값을 제거하면서 닫음
    const toggle = (certName: string) => {
        setExpanded(prev =>
            prev.includes(certName)
                ? prev.filter(v => v !== certName)
                : [...prev, certName]
        );
    };

    return (
        <div className={myPageStyles.infoCard}>
            <div className={myPageStyles.cardHeader}>
                <h3 className={myPageStyles.cardTitle}>CBT 문제 풀이 기록</h3>
            </div>

            <div className={myPageStyles.cbtRecordList}>
                {cbtRecords.map( cert => {
                    const isOpen = expanded.includes(cert.certificate_name);

                    return (
                        <div key={cert.certificate_id}>
                            {!isOpen && (
                                <div className={myPageStyles.cbtRecordItem}>
                                    <h4 className={myPageStyles.cbtCertName}>{cert.certificate_name}</h4>
                                    <div className={myPageStyles.buttonGroup}>
                                        <button
                                            className={myPageStyles.toggleButton}
                                            onClick={() => toggle(cert.certificate_name)}
                                        >
                                            문제 기록 확인
                                        </button>
                                    <button
                                        className={myPageStyles.solveButton}
                                        onClick={() => navigate(`/cbt/start?certificateId=${cert.certificate_id}&certName=${encodeURIComponent(cert.certificate_name)}`)}
                                    >
                                        문제 풀기
                                    </button>

                                    <button
                                        className={myPageStyles.wrongReviewButton}
                                        // onClick={() =>
                                        //     navigate(
                                        //         `/cbt/incorrect?certId=${cert.certificate_id}&certName=${encodeURIComponent(
                                        //             cert.certificate_name
                                        //         )}`
                                        //     )
                                        // }
                                    >
                                        오답노트
                                    </button>


                                    </div>
                                </div>
                            )}

                            {/* --- 펼친 상태: 레코드별로 한 줄씩 렌더링 --- */}
                            {isOpen &&
                                cert.list.map((record) => (
                                    <div
                                        key={`${record.previous_id}-${record.created_at}`}
                                        className={myPageStyles.cbtRecordItem}
                                    >
                                        {/* 왼쪽: 자격증 이름(모든 줄 동일하게 표시) */}
                                        <h4 className={myPageStyles.cbtCertName}>{cert.certificate_name}</h4>

                                        {/* 가운데: 기록 정보 */}
                                        <p className={myPageStyles.cbtMeta}>
                                            <span>🕒 {formatDate(record.created_at)}</span>
                                            <span> | 걸린 시간 : {formatDuration(record.left_time)}</span>
                                            <span> | 점수: {record.score}점</span>
                                            <span> | 맞힌 문제: {record.correct_count}개</span>
                                        </p>

                                        {/* 오른쪽: 버튼 2개 */}
                                        <div className={myPageStyles.cbtActions}>
                                            <button
                                                className={myPageStyles.retryButton}
                                                onClick={() =>  {
                                                    params.set('previousId', record.previous_id.toString());
                                                    navigate(`/cbt/test?${params.toString()}`);}
                                            }
                                            >
                                                문제 다시 풀기
                                            </button>

                                            <button
                                                className={myPageStyles.reviewButton}
                                                onClick={() =>
                                                    navigate(`/cbt/review/previous/${record.previous_id}`, {
                                                        state: { certName: cert.certificate_name },
                                                    })
                                                }
                                            >
                                                문제 검토
                                            </button>
                                        </div>
                                    </div>
                                ))}

                            {/* 펼친 상태일 때 맨 위에 접기 버튼 */}
                            {isOpen && (
                                <div className={myPageStyles.collapseWrapper}>
                                    <button className={myPageStyles.collapseButton} onClick={() => toggle(cert.certificate_name)}>
                                        <ChevronUp size={24} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};