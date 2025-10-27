// features/calendar/adapters.ts
/** 달력에 칠할 UI 이벤트 타입(타일 클래스에서 그대로 씀)  */

export const ADAPTER_BANNER = '[ADAPTER model/adapters.ts v3]';
console.info(ADAPTER_BANNER);

export type UiEventType =
    | 'doc-reg'   // 필기 접수
    | 'doc-exam'  // 필기 시험
    | 'doc-pass'  // 필기 발표
    | 'prac-reg'  // 실기 접수
    | 'prac-exam' // 실기 시험
    | 'prac-pass' // 실기 발표
    ;

// features/calendar/model/adapters.ts

export interface UiEvent {
    // ✅ 기존 위젯이 쓰는 표준 키 (필수)
    startdate: string;  // YYYY-MM-DD
    enddate: string;

    // ✅ 선택 alias (유틸에서 카멜을 써도 타입 에러 안 나게)
    startDate?: string;
    endDate?: string;

    type: UiEventType;

    // 선택 메타
    certificate?: string;
    title?: string;
    meta?: Record<string, unknown>; // ← any 지양
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

// features/calendar/model/adapters.ts

/** 백엔드 이벤트(내부 중간 단계) */
type BEType = 'DOC_REG'|'DOC_EXAM'|'DOC_PASS'|'PRAC_REG'|'PRAC_EXAM'|'PRAC_PASS';
interface BEEvent { start: string; end: string; type: BEType; }

// 날짜 유틸
const DATE_LIKE = /\d{4}[./-]\d{1,2}[./-]\d{1,2}/;
// ② 추출용(전역 O)
const DATE_G = /(\d{4})[./-](\d{1,2})[./-](\d{1,2})/g;

// 상단 유틸: 값에서 공백/제로폭/괄호·콜론 같은 구분자 제거
const clean = (s: unknown) =>
    String(s ?? '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width
        .replace(/\s+/g, '')
        .replace(/[():\[\]{}]/g, '')
        .trim();

// phase 값을 robust 하게 구함: 'phase' | '구분' | '종류' 중 첫 매치
function getPhaseSide(obj: Record<string, unknown>): 'DOC' | 'PRAC' | 'UNKNOWN' {
    const phaseKey = Object.keys(obj).find(k => /(phase|구분|종류)/.test(k));
    const raw = clean(phaseKey ? obj[phaseKey] : '');

    // 가장 느슨하게: 포함 여부로만 판정 (순서: 실 → 필)
    if (raw.includes('실')) return 'PRAC';
    if (raw.includes('필')) return 'DOC';

    // 혹시 영문이나 대소문자 혼합 케이스가 있다면 여기도 방어
    const lc = raw.toLowerCase();
    if (lc.includes('prac')) return 'PRAC';
    if (lc.includes('doc'))  return 'DOC';

    return 'UNKNOWN';
}

const toRangeLoose = (s?: string | null): { start: string; end: string } | null => {
    if (!s) return null;
    const dates: string[] = [];
    let m: RegExpExecArray | null;
    // 매 실행마다 lastIndex 초기화 보장
    DATE_G.lastIndex = 0;
    while ((m = DATE_G.exec(s)) && dates.length < 2) {
        const y  = m[1];
        const mm = m[2].padStart(2, '0');
        const dd = m[3].padStart(2, '0');
        dates.push(`${y}-${mm}-${dd}`);
    }
    if (dates.length === 1) return { start: dates[0], end: dates[0] };
    if (dates.length >= 2) return { start: dates[0], end: dates[1] };
    return null;
};

const pickLoose = (o: Record<string, unknown>, keywords: string[]): string | null => {
    for (const [k, v] of Object.entries(o)) {
        if (typeof v !== 'string') continue;
        if (!DATE_LIKE.test(v)) continue;        // ← 전역 없는 정규식으로 체크
        if (keywords.some(word => k.includes(word))) return v;
    }
    return null;
};


// 느슨 키 후보
const KEYS_REG  = ["접수", "원서", "신청"];
const KEYS_REG_EXTRA = ["추가접수", "추가 접수"];
const KEYS_EXAM = ["시험", "평가", "검정"];
const KEYS_PASS = ["발표", "합격", "결과"];

const sameRange = (a: {start:string; end:string}, b:{start:string; end:string}) =>
    a.start === b.start && a.end === b.end;

export function fromRegularSchedule(rows: RegularRow[] = []): BEEvent[] {
    const out: BEEvent[] = [];

    rows.forEach((row, i) => {
        const obj = row as unknown as Record<string, unknown>;

        // ▶ robust phase 판별
        const side = getPhaseSide(obj);
        const isDoc = side == 'DOC'; // UNKNOWN이면 일단 DOC로 두되, 필요하면 'PRAC'로 바꿔도 됨

        const K: Record<'REG'|'EXAM'|'PASS', BEType> = isDoc
            ? { REG: 'DOC_REG',  EXAM: 'DOC_EXAM',  PASS: 'DOC_PASS' }
            : { REG: 'PRAC_REG', EXAM: 'PRAC_EXAM', PASS: 'PRAC_PASS' };

        // 정확키 → 느슨키
        const regStr  =
            (obj['접수기간'] as string | null | undefined) ??
            pickLoose(obj, KEYS_REG);
        const regExtraStr =
            (obj['추가접수기간'] as string | null | undefined) ??
            pickLoose(obj, KEYS_REG_EXTRA);
        const examStr =
            (obj['시험일']   as string | null | undefined) ??
            pickLoose(obj, KEYS_EXAM);
        const passStr =
            (obj['발표']     as string | null | undefined) ??
            pickLoose(obj, KEYS_PASS);

        // 디버그(이번엔 확실히 보이도록 console.table)
        console.table([{
            i,
            side,
            phaseField: Object.keys(obj).find(k => /(phase|구분|종류)/.test(k)) ?? '',
            phaseValue: clean(obj[Object.keys(obj).find(k => /(phase|구분|종류)/.test(k)) ?? '']),
            isDoc,
            regStr, examStr, passStr
        }]);

        const reg  = toRangeLoose(regStr);
        const regExtra = toRangeLoose(regExtraStr);
        const exam = toRangeLoose(examStr);
        const pass = toRangeLoose(passStr);

        if (reg)  out.push({ start: reg.start,  end: reg.end,  type: K.REG  });
        if (regExtra) {
            if (!reg || !sameRange(reg, regExtra)) {
                out.push({ start: regExtra.start, end: regExtra.end, type: K.REG });
            }
        }
        if (exam) out.push({ start: exam.start, end: exam.end, type: K.EXAM });
        if (pass) out.push({ start: pass.start, end: pass.end, type: K.PASS });
    });

    console.table(out.map(e => ({ type: e.type, start: e.start, end: e.end })));
    return out;
}


export function toUiEvents(be: BEEvent[] = [], certName = ''): UiEvent[] {
    const mapType = (t: BEType): UiEventType =>
        t === 'DOC_REG'  ? 'doc-reg'
            : t === 'DOC_EXAM' ? 'doc-exam'
                : t === 'DOC_PASS' ? 'doc-pass'
                    : t === 'PRAC_REG' ? 'prac-reg'
                        : t === 'PRAC_EXAM'? 'prac-exam'
                            :                    'prac-pass';

    return be.map(e => ({
        startdate: e.start,
        enddate:   e.end,
        type:      mapType(e.type),
        certificate: certName,
    }));
}
