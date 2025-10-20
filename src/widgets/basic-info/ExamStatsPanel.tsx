import React from 'react';

// 네가 쓰는 타입
export type ExamStatsRow = Record<string, string | number>;
export interface ExamStatsPanelProps {
    data?: ExamStatsRow[];  // pickExamStats(certificate) 로 얻은 값
}

/** 숫자 1,234 꼴로 */
const fmtNum = (v: unknown) => {
    const n = typeof v === 'number' ? v : Number(String(v).replace(/[^\d.-]/g, ''));
    return Number.isFinite(n) ? n.toLocaleString() : String(v ?? '');
};
/** 퍼센트는 원문이 % 포함이면 그대로, 숫자면 xx.x% 로 */
const fmtRate = (v: unknown) => {
    if (v == null) return '';
    const s = String(v).trim();
    if (/%$/.test(s)) return s;
    const n = Number(s);
    return Number.isFinite(n) ? `${n}%` : s;
};

/** row 안에서 키 후보들 중 존재하는 키 반환 */
const getKey = (row: ExamStatsRow, candidates: string[]) =>
    candidates.find((k) => Object.prototype.hasOwnProperty.call(row, k));

/** 큐넷/크롤링 케이스마다 제각각인 키를 유연하게 매핑 */
const pickCols = (row: ExamStatsRow) => {
    const yearKey =
        getKey(row, ['연도', '년도', 'year']) ?? '연도';

    // 필기
    const dApplyKey  = getKey(row, ['필기 응시','필기응시','응시(필기)','필기-응시','필기_응시','필기응시자수']);
    const dPassKey   = getKey(row, ['필기 합격','필기합격','합격(필기)','필기-합격','필기_합격','필기합격자수']);
    const dRateKey   = getKey(row, ['필기 합격률','필기합격률','합격률(필기)','필기-합격률','필기_합격률']);

    // 실기
    const pApplyKey  = getKey(row, ['실기 응시','실기응시','응시(실기)','실기-응시','실기_응시','실기응시자수']);
    const pPassKey   = getKey(row, ['실기 합격','실기합격','합격(실기)','실기-합격','실기_합격','실기합격자수']);
    const pRateKey   = getKey(row, ['실기 합격률','실기합격률','합격률(실기)','실기-합격률','실기_합격률']);

    return { yearKey, dApplyKey, dPassKey, dRateKey, pApplyKey, pPassKey, pRateKey };
};

export const ExamStatsPanel: React.FC<ExamStatsPanelProps> = ({ data }) => {
    if (!Array.isArray(data) || data.length === 0) return null;

    // 요약/소계는 마지막으로 내려보내기
    const rows = [...data];
    const isTotalLabel = (y: string) => /소계|합계/i.test(y);
    const isRangeLabel = (y: string) => /\d+\s*[~～-]\s*\d+/.test(y); // 1977~2000, 1977 ～2000 등

    rows.sort((a, b) => {
        const ay = String(a['연도'] ?? a['년도'] ?? '');
        const by = String(b['연도'] ?? b['년도'] ?? '');

        // 그룹: 일반(0) < 구간(1) < 소계(2)
        const aGroup = isTotalLabel(ay) ? 2 : isRangeLabel(ay) ? 1 : 0;
        const bGroup = isTotalLabel(by) ? 2 : isRangeLabel(by) ? 1 : 0;
        if (aGroup !== bGroup) return aGroup - bGroup;

        // 일반년도끼리는 최신연도 먼저 (내림차순)
        if (aGroup === 0) {
            const an = Number(String(ay).replace(/[^\d]/g, '')); // 2024 같은 순수 연도
            const bn = Number(String(by).replace(/[^\d]/g, ''));
            if (Number.isFinite(an) && Number.isFinite(bn)) return bn - an;
        }

        // 구간끼리(보통 한 행)나 소계끼리는 기존 순서 유지
        return 0;
    });

    // 대표 row로 키 후보를 확정
    const probe = rows.find(Boolean)!;
    const cols = pickCols(probe);

    return (
        <div className="qstats-wrap">
            <style>{CSS}</style>
            <h3 className="qstats-title">종목별 검정현황</h3>
            <div className="qstats-scroll">
                <table className="qstats">
                    <colgroup>
                        <col style={{ width: 92 }} />
                        <col style={{ width: 110 }} />
                        <col style={{ width: 110 }} />
                        <col style={{ width: 110 }} />
                        <col style={{ width: 110 }} />
                        <col style={{ width: 110 }} />
                        <col style={{ width: 110 }} />
                    </colgroup>
                    <thead>
                    <tr className="group">
                        <th rowSpan={2}>연도</th>
                        <th colSpan={3}>필기</th>
                        <th colSpan={3}>실기</th>
                    </tr>
                    <tr>
                        <th>응시</th>
                        <th>합격</th>
                        <th>합격률(%)</th>
                        <th>응시</th>
                        <th>합격</th>
                        <th>합격률(%)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((r, i) => {
                        const year = String(r[cols.yearKey] ?? '');
                        const isTotal = /소계|합계/i.test(year);
                        return (
                            <tr key={i} className={isTotal ? 'total' : undefined}>
                                <th className="year">{year}</th>
                                <td className="num">{fmtNum(cols.dApplyKey ? r[cols.dApplyKey] : '')}</td>
                                <td className={isTotal ? 'num bold' : 'num'}>{fmtNum(cols.dPassKey ? r[cols.dPassKey] : '')}</td>
                                <td className="num">{fmtRate(cols.dRateKey ? r[cols.dRateKey] : '')}</td>
                                <td className="num">{fmtNum(cols.pApplyKey ? r[cols.pApplyKey] : '')}</td>
                                <td className={isTotal ? 'num bold' : 'num'}>{fmtNum(cols.pPassKey ? r[cols.pPassKey] : '')}</td>
                                <td className="num">{fmtRate(cols.pRateKey ? r[cols.pRateKey] : '')}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const CSS = `
.qstats-wrap { margin-top: 28px; }
.qstats-title { font-size: 18px; font-weight: 700; margin: 0 0 10px; }
.qstats-scroll { overflow: auto; border: 1px solid #e5e7eb; border-radius: 8px; }
.qstats { width: 100%; min-width: 740px; border-collapse: collapse; table-layout: fixed; font-size: 14px; }
.qstats thead th { background: #f6f8fb; color:#111827; border-bottom:1px solid #e5e7eb; padding: 12px 14px; text-align: center; }
.qstats thead tr.group th { background:#eef3fb; font-weight:700; }
.qstats tbody th.year { background: #fafafa; font-weight:600; text-align:center; }
.qstats td, .qstats th { border-bottom: 1px solid #eef0f3; padding: 10px 14px; }
.qstats tbody tr:nth-child(even) td { background: #fcfcfd; }
.qstats td.num { text-align: center; font-variant-numeric: tabular-nums; }
.qstats td.bold { font-weight: 600; }
.qstats tbody tr.total th,
.qstats tbody tr.total td { background:#f9fafb; font-weight:600; }
`;
