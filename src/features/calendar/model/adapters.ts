// features/calendar/adapters.ts
/** 달력에 칠할 UI 이벤트 타입(타일 클래스에서 그대로 씀)  */
export type UiEventType =
    | 'doc-reg'   // 필기 접수
    | 'doc-exam'  // 필기 시험
    | 'doc-pass'  // 필기 발표
    | 'prac-reg'  // 실기 접수
    | 'prac-exam' // 실기 시험
    | 'prac-pass' // 실기 발표
    ;

export interface UiEvent {
    startdate: string;   // YYYY-MM-DD
    enddate:   string;   // YYYY-MM-DD
    type:      UiEventType;
    certificate: string; // 캘린더 타일에 표시할 자격증명
}

/** 백엔드 표(정기검정일정) 1행 */
export interface RegularRow {
    /** '필기' | '실기' */
    phase?: string | null;
    /** '2025.01.06 ~ 2025.01.09' */
    접수기간?: string | null;
    /** '2025.02.08' 또는 '2025.04.19 ~ 2025.05.02' */
    시험일?: string | null;
    /** '2025.03.12' */
    발표?: string | null;
    /** 옵션 */
    추가접수기간?: string | null;
}

/** 백엔드 이벤트(내부 중간 단계) */
type BEType = 'DOC_REG'|'DOC_EXAM'|'DOC_PASS'|'PRAC_REG'|'PRAC_EXAM'|'PRAC_PASS';
interface BEEvent {
    start: string; // YYYY-MM-DD
    end:   string; // YYYY-MM-DD
    type:  BEType;
}

/** '2025.01.06' → '2025-01-06' (숫자만 추출해서 0패딩 유지) */
const toDate = (s?: string | null): string | null => {
    if (!s) return null;
    const raw = s.replace(/\D/g, ''); // 20250106
    if (raw.length < 8) return null;
    const y = raw.slice(0, 4);
    const m = raw.slice(4, 6);
    const d = raw.slice(6, 8);
    return `${y}-${m}-${d}`; // ✅ 항상 YYYY-MM-DD
};

/** 'a ~ b' 또는 단일 날짜 → { start, end } */
const toRange = (s?: string | null): { start: string; end: string } | null => {
    if (!s) return null;
    const [a, b] = s.split('~').map(v => v?.trim()).filter(Boolean) as (string | undefined)[];
    const start = toDate(a ?? s);
    const end   = toDate(b ?? a ?? s);
    if (!start || !end) return null;
    return { start, end };
};
// adapters.ts 내부
const DATE_LIKE = /\d{4}[./-]?\d{1,2}[./-]?\d{1,2}/;
 // 2025.05.02 / 2025-5-2 등 대충 인식

// 키 후보를 더 늘림
const KEYS_REG  = ["접수", "원서", "신청", "추가접수"];
const KEYS_EXAM = ["시험", "평가", "검정"];
const KEYS_PASS = ["발표", "합격", "결과"];

const pickLoose = (o: Record<string, unknown>, candidates: string[]): string | null => {
    for (const [k, v] of Object.entries(o)) {
        if (candidates.some(c => k.includes(c)) && typeof v === "string" && DATE_LIKE.test(v)) {
            return v;
        }
    }
    return null;
};

export function fromRegularSchedule(rows: RegularRow[] = []): BEEvent[] {
    const out: BEEvent[] = [];

    rows.forEach(row => {
        const obj = row as unknown as Record<string, unknown>;
        const phaseRaw = (Object.keys(obj).find(k => ["phase","구분","종류"].some(c => k.includes(c))) ?? "");
        const isDoc = String(obj[phaseRaw] ?? "").includes("필기");

        const K: Record<"REG"|"EXAM"|"PASS", BEType> = isDoc
            ? { REG: "DOC_REG",  EXAM: "DOC_EXAM",  PASS: "DOC_PASS" }
            : { REG: "PRAC_REG", EXAM: "PRAC_EXAM", PASS: "PRAC_PASS" };

        const reg  = toRange(pickLoose(obj, KEYS_REG));
        const exam = toRange(pickLoose(obj, KEYS_EXAM));
        const pass = toRange(pickLoose(obj, KEYS_PASS));

        if (reg)  out.push({ start: reg.start,  end: reg.end,  type: K.REG  });
        if (exam) out.push({ start: exam.start, end: exam.end, type: K.EXAM });
        if (pass) out.push({ start: pass.start, end: pass.end, type: K.PASS });
    });

    console.groupCollapsed("[ADAPTER] fromRegularSchedule");
    console.log("in rows:", rows.length, "out events:", out.length);
    console.groupEnd();
    return out;
}
/** BE 이벤트[] → UI 이벤트[] (디버깅 로그 포함) */
export function toUiEvents(be: BEEvent[] = [], certName = ''): UiEvent[] {
    const mapType = (t: BEType): UiEventType =>
        t === 'DOC_REG'  ? 'doc-reg'
            : t === 'DOC_EXAM' ? 'doc-exam'
                : t === 'DOC_PASS' ? 'doc-pass'
                    : t === 'PRAC_REG' ? 'prac-reg'
                        : t === 'PRAC_EXAM'? 'prac-exam'
                            : 'prac-pass';

    const ui = be.map(e => ({
        startdate: e.start,
        enddate:   e.end,
        type:      mapType(e.type),
        certificate: certName || '',
    }));

    console.groupCollapsed('[ADAPTER] toUiEvents');
    console.table(ui);
    console.groupEnd();

    return ui;
}
