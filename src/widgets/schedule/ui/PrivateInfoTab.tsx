// widgets/schedule/ui/PrivateInfoTab.tsx
import React from "react";
import { certificateDetailStyles } from "@/widgets/certificate/styles";

// JSON: { "시험내용": { "syllabus": [ { 등급, 과목, 검정내용, 검정항목, ext } ... ] } }
export type PrivateSyllabusRow = {
    ["등급"]?: string;
    ["과목"]?: string;
    ["검정항목"]?: string;
    ["검정내용"]?: string;
    ext?: Record<string, unknown>;   // ← string 말고 unknown
};

// JSON: { "시험내용": { "coverage": [ { 구분, 등급, 종목, 평가범위, parsedWeights } ... ] } }
export type PrivateCoverageRow = {
    ["등급"]?: string;
    ["구분"]?: string;
    ["종목"]?: string;
    ["평가범위"]?: string;
    ext?: Record<string, string>;
    parsedWeights?: { 비율: number; 항목: string }[];
};

interface PrivateInfoTabProps {
    syllabus?: PrivateSyllabusRow[];   // 리눅스마스터, 코활, GTQ 등
    coverage?: PrivateCoverageRow[];   // 전산회계(coverage 기반)
}

export const PrivateInfoTab: React.FC<PrivateInfoTabProps> = ({
                                                                  syllabus = [],
                                                                  coverage = [],
                                                              }) => {
    const hasSyllabus = syllabus && syllabus.length > 0;
    const hasCoverage = coverage && coverage.length > 0;

    // 🔹 syllabus 안에 진짜 "검정항목/검정내용" 이 있는지
    const hasSyllabusDetail = hasSyllabus &&
        syllabus.some(row => row["검정항목"] || row["검정내용"]);

    // 🔹 GTQ처럼 ext 에만 정보가 있는지
    const hasSyllabusExt = hasSyllabus &&
        syllabus.some(row => row.ext && Object.keys(row.ext).length > 0);

    if (!hasSyllabus && !hasCoverage) {
        return null;
    }

    return (
        <div>
            {/* 1) 일반형 (리눅스마스터/코활 등: 검정항목/검정내용 있는 경우) */}
            {hasSyllabus && hasSyllabusDetail && (
                <>
                <h3 style={{ marginTop: 4, marginBottom: 8 }}>등급/과목별 시험정보</h3>
                <div className={certificateDetailStyles.privateTableWrap}>
                    <table className={certificateDetailStyles.privateInfoTable}>
                        <thead>
                        <tr>
                            <th>등급</th>
                            <th>과목</th>
                            <th>검정항목</th>
                            <th>검정내용</th>
                        </tr>
                        </thead>
                        <tbody>
                        {syllabus.map((row, idx) => (
                            <tr key={`syllabus-${idx}`}>
                                <td>{row["등급"] ?? ""}</td>
                                <td>{row["과목"] ?? ""}</td>
                                <td>{row["검정항목"] ?? ""}</td>
                                <td>{row["검정내용"] ?? ""}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                </>
            )}

            {hasSyllabus && !hasSyllabusDetail && hasSyllabusExt && (
                <>
                    <h3 style={{ marginTop: 4, marginBottom: 8 }}>등급/과목별 시험정보</h3>
                    <div className={certificateDetailStyles.privateTableWrap}>
                        <table className={certificateDetailStyles.privateInfoTable}>
                        <thead>
                        <tr>
                            <th>등급</th>
                            <th>과목</th>
                            <th>시험시간</th>
                            <th>문항·시험방법</th>
                            <th>사용 SW</th>
                        </tr>
                        </thead>
                        <tbody>
                        {syllabus.map((row, idx) => {
                            const ext = (row.ext ?? {}) as Record<string, unknown>;

                            // ▽ 등급: row["등급"] 우선, 없으면 ext["등급목록"] 사용
                            let level = row["등급"] ?? "";
                            const gradeList = ext["등급목록"];
                            if (!level) {
                                if (Array.isArray(gradeList)) {
                                    level = gradeList.join(", ");
                                } else if (typeof gradeList === "string") {
                                    level = gradeList;
                                }
                            }

                            // ▽ 시험시간: 공통
                            const examTime =
                                (ext["시험시간"] as string | undefined) ?? "";

                            // ▽ 문항·시험방법: GTQ(문항및시험방법) ↔ ITQ(시험방식)
                            const examMethod =
                                (ext["문항및시험방법"] as string | undefined) ??
                                (ext["시험방식"] as string | undefined) ??
                                "";

                            // ▽ 사용 SW: GTQ(swVersion) ↔ ITQ(S/W)
                            const sw =
                                (ext["swVersion"] as string | undefined) ??
                                (ext["S/W"] as string | undefined) ??
                                "";

                            return (
                                <tr key={`syllabus-ext-${idx}`}>
                                    <td>{level}</td>
                                    <td>{row["과목"] ?? ""}</td>
                                    <td>{examTime}</td>
                                    <td>{examMethod}</td>
                                    <td>{sw}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                        </table>
                    </div>
                </>
            )}


            {/* 3) coverage 기반 (전산회계 등) */}
            {hasCoverage && (
                <>
                    <h3 style={{ marginTop: hasSyllabus ? 16 : 4, marginBottom: 8 }}>
                        등급/구분별 평가범위
                    </h3>
                    <div className={certificateDetailStyles.privateTableWrap}>
                        <table className={certificateDetailStyles.privateInfoTable}>
                        <thead>
                        <tr>
                            <th>등급</th>
                            <th>구분</th>
                            <th>종목</th>
                            <th>평가범위</th>
                            <th>세부 비율</th>
                        </tr>
                        </thead>
                        <tbody>
                        {coverage.map((row, idx) => (
                            <tr key={`cov-${idx}`}>
                                <td>{row["등급"] ?? ""}</td>
                                <td>{row["구분"] ?? ""}</td>
                                <td>{row["종목"] ?? ""}</td>
                                <td>{row["평가범위"] ?? ""}</td>
                                <td>
                                    {row.parsedWeights &&
                                        row.parsedWeights
                                            .map(w => `${w.항목} ${w.비율}%`)
                                            .join(", ")}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};
