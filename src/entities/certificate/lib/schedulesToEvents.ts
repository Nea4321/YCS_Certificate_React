// ✅ 공용 타입만 사용
import type { RawItem, ExamPhase } from '@/entities/certificate/model/types';
import type { UiEvent, UiEventType } from '@/features/calendar/model/adapters';
const toISO = (s: string) => s.trim().replace(/\./g, '-');

const parseRange = (s?: string | null): { start?: string; end?: string } => {
    if (!s) return {};
    const t = s.replace(/\s+/g, '');
    const m = t.match(/^(\d{4}\.\d{2}\.\d{2})(?:~(\d{4}\.\d{2}\.\d{2}))?$/);
    if (!m) return {};
    const start = toISO(m[1]);
    const end = m[2] ? toISO(m[2]) : start;
    return { start, end };
};

const normalizePhase = (p: ExamPhase): '필기' | '실기' | null =>
    p === '필기' ? '필기' : p === '실기' ? '실기' : null;

const typeOf = (phase: '필기'|'실기', kind: 'reg'|'exam'|'pass'): UiEventType =>
    phase === '필기'
        ? (kind === 'reg' ? 'doc-reg' : kind === 'exam' ? 'doc-exam' : 'doc-pass')
        : (kind === 'reg' ? 'prac-reg' : kind === 'exam' ? 'prac-exam' : 'prac-pass');

// ✅ 공용 RawItem 사용
export function schedulesToEvents(items: RawItem[], certName?: string): UiEvent[] {
    const out: UiEvent[] = [];

    for (const it of items) {
        const phase = normalizePhase(it.phase);
        if (!phase) continue; // 면접/1차/2차 등은 현재 이벤트 변환 스킵

        const pushRange = (kind: 'reg'|'exam', title: string, range?: string | null, extra = false) => {
            if (!range) return;
            const { start, end } = parseRange(range);
            if (!start || !end) return;
            out.push({
                startdate: start, enddate: end,
                startDate: start, endDate: end,     // 호환 필드
                type: typeOf(phase, kind),
                title,
                meta: { round: it.회차 ?? undefined, extra: extra || undefined, certName } as Record<string, unknown>,
            });
        };

        // 접수/추가접수/시험/발표
        pushRange('reg',  `${phase}원서접수`, it.접수기간);
        pushRange('reg',  `${phase}추가접수`, it.추가접수기간, true);
        pushRange('exam', `${phase}시험`,     it.시험일);

        if (it.발표) {
            const d = toISO(it.발표);
            out.push({
                startdate: d, enddate: d, startDate: d, endDate: d,
                type: typeOf(phase, 'pass'),
                title: `${phase}합격(예정자)발표`,
                meta: { round: it.회차 ?? undefined, certName } as Record<string, unknown>,
            });
        }
    }
    return out;
}
