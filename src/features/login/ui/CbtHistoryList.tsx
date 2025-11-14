import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {myPageStyles} from "@/pages/dashboard/styles";


export interface UserCbtHistory {
    certificate_id: number;
    certificate_name: string;
    score: number;
    correct_Count: number;
    created_at: string;
    left_time: number;
}

// API 호출
export const UserGetCbtHistory = async (): Promise<UserCbtHistory[]> => {
    const response = await axios.get("/api/user/cbt", { withCredentials: true });
    return response.data;
};

// 시간을 "mm분 ss초" 포맷으로 바꾸는 함수
const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}분 ${s}초`;
};

const formatDate = (iso: string) => {
    const date = new Date(iso);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

// 컴포넌트
export const CbtHistoryList: React.FC = () => {
    const [cbtRecords, setCbtRecords] = useState<UserCbtHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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

    return (
        <div className={myPageStyles.infoCard}>
            <div className={myPageStyles.cardHeader}>
                <h3 className={myPageStyles.cardTitle}>CBT 문제 풀이 기록</h3>
            </div>

            <div className={myPageStyles.cbtRecordList}>
                {cbtRecords.map((record) => (
                    <div key={record.certificate_id} className={myPageStyles.cbtRecordItem}>
                        <div className={myPageStyles.cbtRecordInfo}>
                            <h4 className={myPageStyles.cbtCertName}>{record.certificate_name}</h4>
                            <p className={myPageStyles.cbtMeta}>
                                <span>🕒 {formatDate(record.created_at)}</span>
                                <span> | 걸린 시간 : {formatDuration(record.left_time)}</span>
                                <span> | 점수: {record.score}점</span>
                                <span> | 맞힌 문제: {record.correct_Count}</span>
                            </p>
                        </div>

                        <div className={myPageStyles.cbtActions}>
                            <button
                                className={myPageStyles.solveButton}
                                onClick={() => navigate(`/cbt/start?certificateId=${record.certificate_id}&certName=${encodeURIComponent(record.certificate_name)}`)}
                            >
                                문제 풀러가기
                            </button>
                            {/*<button*/}
                            {/*    className={myPageStyles.reviewButton}*/}
                            {/*    onClick={() => navigate(`/cbt/${record.certificate_id}/wrong`)}*/}
                            {/*>*/}
                            {/*    오답노트 보기*/}
                            {/*</button>*/}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

