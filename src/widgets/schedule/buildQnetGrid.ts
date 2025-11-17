// widgets/schedule/buildQnetGrid.ts
// buildQnetGrid.ts
import type { RawItem } from '@/entities/certificate/model/types';

type GridHeader = { id: string; title: string };
type GridRow    = Record<string, string>;

const P_COLS = ["REG", "EXAM", "RESULT"] as const; // phase-특화 3종
const P_LABEL: Record<(typeof P_COLS)[number], string> = {
    REG: "원서접수(휴일제외)",
    EXAM: "시험",
    RESULT: "합격자 발표",
};

// 공용 3종(phase 미구분)
const SHARED_COLS = ["DOCS", "OBJECTION", "ANSWER"] as const;
const SHARED_LABEL: Record<(typeof SHARED_COLS)[number], string> = {
    DOCS: "서류제출기간",
    OBJECTION: "의견제시기간",
    ANSWER: "최종정답 발표기간",   // ← 여기만 바꾸기
};

function push(row: GridRow, id: string, v?: string | null) {
    if (!v) return;
    row[id] = row[id] ? `${row[id]}\n${v}` : v;
}

export function buildQnetGrid(items: RawItem[]): { headers: GridHeader[]; rows: GridRow[] } {
    // 1) phase 후보(실제로 쓸 값이 있는 phase만 남김)
    const phasesAll = Array.from(new Set(items.map(i => i.phase).filter(Boolean)));
    const phasesUsed: string[] = [];

    for (const p of phasesAll) {
        const hasAny =
            items.some(i => i.phase === p && (i.접수기간 || i.추가접수기간 || i.시험일 || i.발표));
        if (hasAny) phasesUsed.push(p);
    }

    // 2) 공용 컬럼 존재 여부
    const hasShared: Record<(typeof SHARED_COLS)[number], boolean> = {
        DOCS: items.some(i => i.서류제출기간),
        OBJECTION: items.some(i => i.의견제시기간),
        ANSWER: items.some(i => i["정답발표"]),
    };

    // 3) 헤더 구성
    const headers: GridHeader[] = [{ id: "round", title: "구분(회차)" }];

    // phase-특화 3종 (필/실/면접/1차/2차…)
    for (const p of phasesUsed) {
        for (const c of P_COLS) {
            headers.push({ id: `${p}:${c}`, title: `${p} ${P_LABEL[c]}` });
        }
    }
    // 공용 3종 (phase 미구분, 실제 데이터 있을 때만 추가)
    for (const c of SHARED_COLS) {
        if (hasShared[c]) headers.push({ id: `SHARED:${c}`, title: SHARED_LABEL[c] });
    }

    // 4) 행 만들기(회차 기준)
    const byRound = new Map<string, GridRow>();

    for (const it of items) {
        const round = it.회차 ?? "-";
        const row = byRound.get(round) ?? { round };

        // phase-특화
        push(row, `${it.phase}:REG`, it.접수기간 || undefined);
        if (it.추가접수기간) push(row, `${it.phase}:REG`, `추가접수: ${it.추가접수기간}`);
        push(row, `${it.phase}:EXAM`, it.시험일 || undefined);
        push(row, `${it.phase}:RESULT`, it.발표 || undefined);

        // 공용(단일 컬럼)
        push(row, `SHARED:DOCS`, it.서류제출기간 || undefined);
        push(row, `SHARED:OBJECTION`, it.의견제시기간 || undefined);
        push(row, `SHARED:ANSWER`, it["정답발표"] || undefined);

        byRound.set(round, row);
    }

    // 5) 완성된 데이터에서 "값이 전혀 없는" 컬럼은 헤더에서 제거
    const usedIds = new Set<string>(["round"]);
    for (const r of byRound.values()) {
        Object.keys(r).forEach(k => r[k] && usedIds.add(k));
    }
    const finalHeaders = headers.filter(h => usedIds.has(h.id));

    // 6) 회차 정렬
    const num = (s?: string) => (s ?? "").replace(/[^\d]/g, "");
    const rows = Array.from(byRound.values()).sort(
        (a, b) => Number(num(a.round)) - Number(num(b.round))
    );

    // 7) 안전: 제거된 컬럼은 행에서도 접근 안 되도록
    const finalIds = new Set(finalHeaders.map(h => h.id));
    for (const r of rows) {
        for (const k of Object.keys(r)) {
            if (!finalIds.has(k)) {
                Reflect.deleteProperty(r, k);   // ← any 없이 안전 삭제
            }
        }
    }

    return { headers: finalHeaders, rows };
}