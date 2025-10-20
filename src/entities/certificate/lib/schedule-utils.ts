// src/entities/certificate/lib/schedule-utils.ts
import type {
    Schedule,
    ExamEventDto,
    ExamEventTypeBE,
} from '@/entities/certificate/model/types';

// ===== 변환기: Schedule[] -> ExamEventDto[] =====
export function schedulesToEvents(rows: Schedule[]): ExamEventDto[] {
    const out: ExamEventDto[] = [];

    for (const s of rows) {
        for (const r of s.schedule ?? []) {
            // 필기 접수
            pushByKeys(out, r,
                ['applyStart', '원서접수 시작', '원서접수시작', '필기접수시작', '필기접수 시작'],
                ['applyEnd',   '원서접수 종료', '원서접수종료', '필기접수종료', '필기접수 종료'],
                'DOC_REG');

            // 필기 시험일 (단일/범위 한 셀 지원)
            pushByKeys(out, r, ['examDate', '시험일', '필기시험일'], null, 'DOC_EXAM', { allowSameCellRange: true });

            // 필기 발표
            pushByKeys(out, r, ['resultDate', '합격자발표', '발표일', '필기합격자발표'], null, 'DOC_PASS');

            // 실기 접수
            pushByKeys(out, r,
                ['pracApplyStart', '실기접수시작', '실기접수 시작'],
                ['pracApplyEnd',   '실기접수종료', '실기접수 종료'],
                'PRAC_REG');

            // 실기 시험일 (단일/범위 한 셀 지원)
            pushByKeys(out, r, ['pracExamDate', '실기시험일', '실기시험'], null, 'PRAC_EXAM', { allowSameCellRange: true });

            // 실기 발표
            pushByKeys(out, r, ['pracResultDate', '실기합격자발표', '실기발표일'], null, 'PRAC_PASS');
        }
    }

    // (옵션) 중복 제거
    const seen = new Set<string>();
    return out.filter(e => {
        const k = `${e.type}|${e.startDate}|${e.endDate}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
    });
}

export function pushByKeys(
    out: ExamEventDto[],
    row: Record<string, string | null>,
    startKeys: string[],
    endKeys: string[] | null,
    type: ExamEventTypeBE,
    opt?: { allowSameCellRange?: boolean }
) {
    if (opt?.allowSameCellRange) {
        const rng = pickRange(row, startKeys);
        if (rng?.start) {
            out.push({ startDate: rng.start, endDate: rng.end ?? rng.start, type });
            return;
        }
    }
    const start = pickDate(row, startKeys);
    const end   = endKeys ? pickDate(row, endKeys) : start;
    if (!start) return;
    out.push({ startDate: start, endDate: end ?? start, type });
}

export function pickRange(row: Record<string, string | null>, keys: string[]) {
    for (const k of keys) {
        const v = row[k];
        const r = parseRangeFlexible(v ?? undefined);
        if (r) return r;
    }
    return undefined;
}

export function pickDate(row: Record<string, string | null>, keys: string[]): string | undefined {
    for (const k of keys) {
        const v = row[k];
        const d = normDateFlexible(v ?? undefined);
        if (d) return d;
    }
    return undefined;
}

// "YYYY.MM.DD ~ YYYY.MM.DD" / "YYYY-MM-DD ~ MM-DD" / "MM.DD ~ MM.DD"
export function parseRangeFlexible(v?: string) {
    if (!v) return;
    const [L, R] = v.split(/~|–|—|-/).map(x => x.trim());
    const start = normDateFlexible(L);
    if (!start) return;
    if (!R) return { start, end: start };
    const end = normDateFlexible(R, start.slice(0, 4)); // 연도 생략 보정
    return { start, end: end ?? start };
}

// 2025.05.12 / 2025-05-12 / 2025/05/12 / "05.12" / "05-12" / "YYYYMMDD"
export function normDateFlexible(v?: string, fallbackYear?: string): string | undefined {
    if (!v) return;
    const t = v.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;

    const h = t.replace(/[./]/g, '-');
    const m1 = h.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m1) return `${m1[1]}-${m1[2]}-${m1[3]}`;

    const m2 = h.match(/^(\d{2})-(\d{2})$/);
    if (m2) {
        const y = fallbackYear ?? String(new Date().getFullYear());
        return `${y}-${m2[1]}-${m2[2]}`;
    }

    const digits = t.replace(/[^\d]/g, '');
    if (digits.length === 8) return `${digits.slice(0,4)}-${digits.slice(4,6)}-${digits.slice(6,8)}`;
    if (digits.length === 4) {
        const y = fallbackYear ?? String(new Date().getFullYear());
        return `${y}-${digits.slice(0,2)}-${digits.slice(2,4)}`;
    }
    return undefined;
}
