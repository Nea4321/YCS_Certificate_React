// widgets/schedule/buildQnetGrid.ts

export type RawItem = {
    phase: '필기' | '실기';
    회차?: string | null;
    접수기간?: string | null;
    추가접수기간?: string | null;   // ⬅️ 여기서 온다
    시험일?: string | null;
    발표?: string | null;
};

export type QnetGridRow = {
    round: string;

    // 필기
    docReg?: string | null;        // 원서접수
    docRegExtra?: string | null;   // ⬅️ 추가접수기간
    docExam?: string | null;
    docPass?: string | null;

    // 실기
    pracReg?: string | null;       // 원서접수
    pracRegExtra?: string | null;  // ⬅️ 추가접수기간
    pracExam?: string | null;
    pracPass?: string | null;
};

export function buildQnetGrid(items: RawItem[]): QnetGridRow[] {
    const byRound = new Map<string, QnetGridRow>();

    for (const it of items) {
        const round = it.회차 ?? '-';
        if (!byRound.has(round)) byRound.set(round, { round });
        const row = byRound.get(round)!;

        if (it.phase === '필기') {
            row.docReg      = row.docReg      ?? it.접수기간 ?? null;
            row.docRegExtra = row.docRegExtra ?? it.추가접수기간 ?? null;
            row.docExam     = row.docExam     ?? it.시험일 ?? null;
            row.docPass     = row.docPass     ?? it.발표 ?? null;
        } else {
            row.pracReg      = row.pracReg      ?? it.접수기간 ?? null;
            row.pracRegExtra = row.pracRegExtra ?? it.추가접수기간 ?? null;
            row.pracExam     = row.pracExam     ?? it.시험일 ?? null;
            row.pracPass     = row.pracPass     ?? it.발표 ?? null;
        }
    }

    const norm = (s: string) => (s || '').replace(/[^\d]/g, '');
    return Array.from(byRound.values())
        .sort((a, b) => Number(norm(a.round)) - Number(norm(b.round)));
}
