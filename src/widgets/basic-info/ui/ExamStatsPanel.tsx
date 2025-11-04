import { memo, useMemo } from 'react';
import styles from '../styles/ExamStatsPanel.module.css';

export type ExamStatsRow = Record<string, string | number>;
export interface ExamStatsPanelProps {
    data?: ExamStatsRow[];          // pickExamStats(certificate) 결과
    title?: string;                  // 기본: "종목별 검정현황"
}

/** 숫자 1,234 포맷 */
const fmtNum = (v: unknown) => {
    const n = typeof v === 'number' ? v : Number(String(v).replace(/[^\d.-]/g, ''));
    return Number.isFinite(n) ? n.toLocaleString() : String(v ?? '');
};
/** 퍼센트 포맷 */
const fmtRate = (v: unknown) => {
    if (v == null) return '';
    const s = String(v).trim();
    if (/%$/.test(s)) return s;               // 이미 % 포함이면 그대로
    const n = Number(s);
    return Number.isFinite(n) ? `${n}%` : s;
};

const getKey = (row: ExamStatsRow, candidates: string[]) =>
    candidates.find((k) => Object.prototype.hasOwnProperty.call(row, k));

const pickCols = (row: ExamStatsRow) => {
    const yearKey = getKey(row, ['연도', '년도', 'year']) ?? '연도';
    const dApplyKey = getKey(row, ['필기 응시','필기응시','응시(필기)','필기-응시','필기_응시','필기응시자수']);
    const dPassKey  = getKey(row, ['필기 합격','필기합격','합격(필기)','필기-합격','필기_합격','필기합격자수']);
    const dRateKey  = getKey(row, ['필기 합격률','필기합격률','합격률(필기)','필기-합격률','필기_합격률']);
    const pApplyKey = getKey(row, ['실기 응시','실기응시','응시(실기)','실기-응시','실기_응시','실기응시자수']);
    const pPassKey  = getKey(row, ['실기 합격','실기합격','합격(실기)','실기-합격','실기_합격','실기합격자수']);
    const pRateKey  = getKey(row, ['실기 합격률','실기합격률','합격률(실기)','실기-합격률','실기_합격률']);
    return { yearKey, dApplyKey, dPassKey, dRateKey, pApplyKey, pPassKey, pRateKey };
};

const sortRows = (rows: ExamStatsRow[]) => {
    const isTotalLabel = (y: string) => /소계|합계/i.test(y);
    const isRangeLabel = (y: string) => /\d+\s*[~～-]\s*\d+/.test(y);
    return [...rows].sort((a, b) => {
        const ay = String(a['연도'] ?? a['년도'] ?? '');
        const by = String(b['연도'] ?? b['년도'] ?? '');
        const aGroup = isTotalLabel(ay) ? 2 : isRangeLabel(ay) ? 1 : 0;
        const bGroup = isTotalLabel(by) ? 2 : isRangeLabel(by) ? 1 : 0;
        if (aGroup !== bGroup) return aGroup - bGroup;
        if (aGroup === 0) {
            const an = Number(ay.replace(/[^\d]/g, ''));
            const bn = Number(by.replace(/[^\d]/g, ''));
            if (Number.isFinite(an) && Number.isFinite(bn)) return bn - an; // 최신 먼저
        }
        return 0;
    });
};

const cx = (...xs: Array<string | false | undefined>) => xs.filter(Boolean).join(' ');

export const ExamStatsPanel = memo(function ExamStatsPanel({
                                                               data,
                                                               title = '종목별 검정현황',
                                                           }: ExamStatsPanelProps) {
    // ✅ Hooks는 항상 호출 (조건부 X)
    const rows = useMemo(() => sortRows(Array.isArray(data) ? data : []), [data]);
    const cols = useMemo(() => (rows[0] ? pickCols(rows[0]) : pickCols({} as ExamStatsRow)), [rows]);

    // 내용 없으면 렌더 스킵
    if (rows.length === 0) return null;

    return (
        <section className={styles.qstatsWrap} aria-label={title}>
            <h3 className={styles.qstatsTitle}>{title}</h3>
            <div className={styles.qstatsScroll}>
                <table className={styles.qstats}>
                    <colgroup className={styles.cols}>
                           <col /><col /><col /><col /><col /><col /><col />
                    </colgroup>
                    <thead>
                    <tr className={styles.group}>
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
                            <tr key={i} className={isTotal ? styles.total : undefined}>
                                <th className={styles.year}>{year}</th>
                                <td className={styles.num}>{fmtNum(cols.dApplyKey ? r[cols.dApplyKey] : '')}</td>
                                <td className={cx(styles.num, isTotal && styles.bold)}>{fmtNum(cols.dPassKey ? r[cols.dPassKey] : '')}</td>
                                <td className={styles.num}>{fmtRate(cols.dRateKey ? r[cols.dRateKey] : '')}</td>
                                <td className={styles.num}>{fmtNum(cols.pApplyKey ? r[cols.pApplyKey] : '')}</td>
                                <td className={cx(styles.num, isTotal && styles.bold)}>{fmtNum(cols.pPassKey ? r[cols.pPassKey] : '')}</td>
                                <td className={styles.num}>{fmtRate(cols.pRateKey ? r[cols.pRateKey] : '')}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </section>
    );
});
