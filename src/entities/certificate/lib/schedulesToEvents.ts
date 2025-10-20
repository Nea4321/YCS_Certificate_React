// entities/certificate/lib/schedulesToEvents.ts
import type { UiEvent, UiEventType } from '@/features/calendar/model/adapters';

type RawItem = {
    phase: '필기' | '실기';
    회차?: string | null;
    시험일?: string | null;
    접수기간?: string | null;
    발표?: string | null;
    추가접수기간?: string | null;
};

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

const typeOf = (phase: '필기'|'실기', kind: 'reg'|'exam'|'pass'): UiEventType =>
    phase === '필기'
        ? (kind === 'reg' ? 'doc-reg' : kind === 'exam' ? 'doc-exam' : 'doc-pass')
        : (kind === 'reg' ? 'prac-reg' : kind === 'exam' ? 'prac-exam' : 'prac-pass');

export function schedulesToEvents(items: RawItem[], certName?: string): UiEvent[] {
    const out: UiEvent[] = [];

    for (const it of items) {
        const phase = it.phase === '실기' ? '실기' : '필기';

        // title(필수) → range(옵션) 순서로 재배치
        const pushRange = (
            kind: 'reg'|'exam',
            title: string,
            range?: string | null,
            extra = false
        ) => {
            if (!range) return;
            const { start, end } = parseRange(range);
            if (!start || !end) return;
            out.push({
                // 위젯 표준 키
                startdate: start,
                enddate: end,
                // alias (선택)
                startDate: start,
                endDate: end,
                type: typeOf(phase, kind),
                title,
                meta: { round: it.회차 ?? undefined, extra: extra || undefined, certName } as Record<string, unknown>,
            });
        };


        // 접수 / 추가접수 / 시험 / 발표
        pushRange('reg',  `${phase}원서접수`, it.접수기간);
        pushRange('reg',  `${phase}추가접수`, it.추가접수기간, true);
        pushRange('exam', `${phase}시험`,     it.시험일);

        if (it.발표) {
            const d = toISO(it.발표);
            out.push({
                startdate: d,
                enddate: d,
                startDate: d,
                endDate: d,
                type: typeOf(phase, 'pass'),
                title: `${phase}합격(예정자)발표`,
                meta: { round: it.회차 ?? undefined, certName } as Record<string, unknown>,
            });
        }
    }
    return out;
}
