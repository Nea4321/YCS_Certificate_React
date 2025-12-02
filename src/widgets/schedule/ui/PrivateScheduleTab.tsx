// widgets/schedule/ui/PrivateScheduleTab.tsx
import React from "react";
import { certificateDetailStyles } from "@/widgets/certificate/styles";

// 🔹 KAIT JSON 구조에 맞춘 타입
export type PrivateScheduleRow = {
    ["등급"]?: string;
    ["차수"]?: string;
    ["회차"]?: string;
    ["표시"]?: string;
    ["시험일자표시"]?: string;
    ["원서접수표시"]?: string;
    ["발표표시"]?: string;          // 성적공고 / 발표일

    // GTQ/ITQ 계열
    ["시험일"]?: string;
    ["온라인원서접수표시"]?: string;
    ["성적공고표시"]?: string;

    // 🔹 ISO 날짜 필드들 (민간용 달력에서만 씀)
    examDate?: string;       // "2025-02-09"
    resultDate?: string;     // "2025-02-27"
    resultStart?: string;    // "2025-02-20"
    resultEnd?: string;      // "2025-02-27"
    registerStart?: string;  // "2025-01-02"
    registerEnd?: string;    // "2025-01-08"
};


export type PrivateTimeRow = {
    ["등급"]?: string;              // ✅ 등급 추가
    ["차수"]?: string;
    ["교시"]?: string;          // 코딩활용능력처럼 교시 컬럼이 따로 있을 수도 있음
    ["입실완료시간"]?: string;
    ["시험시간표시"]?: string;
    ["비고"]?: string;
};

interface PrivateScheduleTabProps {
    schedule: PrivateScheduleRow[];
    times: PrivateTimeRow[];
}

const formatDateWithYear = (
    label?: string,
    isoDate?: string
): string => {
    if (!label) return "";

    // 이미 4자리 연도 있으면 그대로
    if (/\d{4}/.test(label)) return label;

    if (!isoDate || isoDate.length < 4) {
        return label;
    }
    const year = isoDate.substring(0, 4); // "2025"

    // 범위형 "01.02 ~ 01.08" 처리
    if (label.includes("~")) {
        const [leftRaw, rightRaw] = label.split("~");
        const left = leftRaw.trim();
        const right = rightRaw.trim();

        const leftFormatted = `${year}.${left}`;
        const rightFormatted = /\d{4}/.test(right)
            ? right
            : `${year}.${right}`;

        return `${leftFormatted} ~ ${rightFormatted}`;
    }

    // 단일 날짜 "02.09(일)" → "2025.02.09(일)"
    return `${year}.${label}`;
};
export const PrivateScheduleTab: React.FC<PrivateScheduleTabProps> = ({
                                                                          schedule,
                                                                          times,
                                                                      }) => (
    <div>
        {schedule.length > 0 && (
            <>
                <h3 style={{ marginTop: 4 }}>회차별 일정</h3>
                <div className={certificateDetailStyles.privateTableWrap}>
                    <table className={certificateDetailStyles.privateScheduleTable}>
                        <thead>
                        <tr>
                            <th>등급</th>
                            <th>회차</th>
                            <th>차수</th>
                            <th>시험일</th>
                            <th>원서접수</th>
                            <th>성적공고</th>
                        </tr>
                        </thead>
                        <tbody>
                        {schedule.map((row, idx) => (
                            <tr key={idx}>
                                <td>{row["등급"] ?? ""}</td>
                                <td>{row["회차"] ?? ""}</td>
                                <td>{row["차수"] ?? ""}</td>
                                <td>
                                    {formatDateWithYear(
                                        row["시험일자표시"] ?? row["시험일"],
                                        row.examDate
                                    )}
                                </td>
                                <td>
                                    {formatDateWithYear(
                                        row["원서접수표시"]
                                        ?? row["표시"]
                                        ?? row["온라인원서접수표시"],
                                        row.registerStart
                                    )}
                                </td>
                                <td>
                                    {formatDateWithYear(
                                        row["발표표시"] ?? row["성적공고표시"],
                                        row.resultStart
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}

        {times.length > 0 && (
            <>
                <h3 style={{ marginTop: 24 }}>시험시간</h3>
                <div className={certificateDetailStyles.privateTableWrap}>
                    <table className={certificateDetailStyles.privateTimeTable}>
                        <thead>
                        <tr>
                            <th>급수</th>
                            <th>차수/교시</th>
                            <th>입실완료</th>
                            <th>시험시간</th>
                            <th>비고</th>
                        </tr>
                        </thead>
                        <tbody>
                        {times.map((row, idx) => (
                            <tr key={idx}>
                                <td>{row["등급"] ?? ""}</td>
                                <td>{row["교시"] ?? row["차수"] ?? ""}</td>
                                <td>{row["입실완료시간"] ?? ""}</td>
                                <td>{row["시험시간표시"] ?? ""}</td>
                                <td>{row["비고"] ?? ""}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}
    </div>
);



