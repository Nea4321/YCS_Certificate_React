import type { RawItem, ExamPhase } from '@/entities/certificate/model/types';

type Row = Record<string, string | null | undefined>;
const get = (r: Row, k: string) => (r?.[k] ?? null) as string | null;

// 우리 엔진이 쓰는 phase 후보 (필요 시 더 추가/수정)
const PHASES: ExamPhase[] = ['필기', '실기', '면접', '1차', '2차'] as const;

export function toRawItems(rows?: Row[]): RawItem[] {
    if (!rows) return [];
    const out: RawItem[] = [];

    for (const r of rows) {
        // 이미 RawItem 형태면 그대로 통과 (백엔드가 RawItem을 직전 단계에서 넣어주는 경우 대비)
        if ('phase' in r) {
            out.push(r as unknown as RawItem);
            continue;
        }

        // 회차/구분 컬럼 다양한 명칭 대응
        const round = get(r, '구분(회차)') ?? get(r, '구분') ?? get(r, '회차') ?? get(r, 'round');

        // 공용(phase 미구분)
        const sharedDocs      = get(r, '서류제출기간');
        const sharedObj       = get(r, '의견제시기간');
        const sharedAnswer    = get(r, '최종정답 발표기간');

        for (const p of PHASES) {
            const reg  = get(r, `${p} 원서접수(휴일제외)`) ?? get(r, `${p} 원서접수`);
            const add  = get(r, `${p} 추가접수`);
            const exam = get(r, `${p} 시험`);
            const pass = get(r, `${p} 합격자 발표`);

            if (!reg && !add && !exam && !pass) continue;

            out.push({
                phase: p,
                회차: round,
                접수기간: reg,
                추가접수기간: add,
                시험일: exam,
                발표: pass,
                서류제출기간: sharedDocs,
                의견제시기간: sharedObj,
                '정답발표': sharedAnswer,
            });
        }
    }
    return out;
}
