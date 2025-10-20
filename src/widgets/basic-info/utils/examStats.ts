// types.ts 혹은 widgets/basic-info/utils/examStats.ts

export type ExamStatsRow = Record<string, string | number>;
export interface YearStats {
    year: string;
    doc: { applied?: string; passed?: string; rate?: string };
    prac: { applied?: string; passed?: string; rate?: string };
}
export type NormalizedExamStats = YearStats[];

// 여러 이름 케이스를 포괄적으로 매핑
const get = (row: ExamStatsRow, keys: string[]) => {
    for (const k of keys) {
        if (k in row) return String(row[k] ?? '');
    }
    return '';
};

export function normalizeExamStats(rows: ExamStatsRow[]): NormalizedExamStats {
    return rows.map((r) => {
        const year = get(r, ['연도','년도','year']);

        // 필기
        const docApplied = get(r, ['필기응시','필기 응시','필기_응시','응시(필기)','필기']);
        const docPassed  = get(r, ['필기합격','필기 합격','필기_합격','합격(필기)']);
        const docRate    = get(r, ['필기합격률','필기 합격률','필기_합격률','합격률(필기)','필기합격(%)','필기합격률(%)']);

        // 실기
        const pracApplied = get(r, ['실기응시','실기 응시','실기_응시','응시(실기)','실기']);
        const pracPassed  = get(r, ['실기합격','실기 합격','실기_합격','합격(실기)']);
        const pracRate    = get(r, ['실기합격률','실기 합격률','실기_합격률','합격률(실기)','실기합격(%)','실기합격률(%)']);

        // 만약 너희 데이터가 "응시/합격/합격률"만 있고, 필기/실기 두 블록으로 분리돼 저장된 경우까지 방어
        // (예: {응시, 합격, 합격률, 응시_2, 합격_2, 합격률_2} 같은 형태면 여기에 추가 매핑하면 됨)

        return {
            year,
            doc:  { applied: docApplied,  passed: docPassed,  rate: docRate  },
            prac: { applied: pracApplied, passed: pracPassed, rate: pracRate },
        };
    }).filter(x => x.year); // 연도 없는 합계/빈 행 제거
}
