import { CertificateData, ExamInfoDto, ExamStats, HtmlBlocks } from './types';
import { Dict, isDict, get, toHtml } from './guards';


// selectors.ts 맨 위 근처에 추가
const isString = (v: unknown): v is string => typeof v === 'string';

type RawFee = {
    필기?: unknown; 실기?: unknown;
    doc?: unknown;  prac?: unknown;
};

// 표준 링크 1개 타입을 안전하게 추출
type StandardItem = NonNullable<ExamInfoDto['standard_list']>[number];

// 원소 -> 안전 변환기
const toListItem = (v: unknown): StandardItem => {
    const o: Record<string, unknown> = isDict(v) ? (v as Record<string, unknown>) : {};
    return {
        label: isString(o.label) ? o.label : '',
        href:  isString(o.href)  ? o.href  : null,
        action:isString(o.action)? o.action: null,
    };
};


/** 시험정보: 수수료/출제기준 링크까지 포함 */
export const pickExamInfo = (c?: CertificateData | null): ExamInfoDto | undefined => {
    if (!c) return;

    // 이미 정규화된 값 우선 사용
    const nx = (c as { exam_info_normalized?: ExamInfoDto | undefined }).exam_info_normalized;
    const ex = (c as { exam_info?: ExamInfoDto | undefined }).exam_info;
    if (nx || ex) return nx ?? ex;

    const oi = (c as { other_info?: unknown }).other_info;
    if (!isDict(oi)) return;

    const si = get<Dict | undefined>(oi, '시험정보');

    // --- 수수료 ---
    let fee: ExamInfoDto['fee'];

    // 우선순위: 시험정보.수수료 → other_info.수수료 → 시험정보.표.응시수수료
    const feeObj: RawFee | undefined =
        (isDict(si) && isDict(get(si, '수수료')) ? (get(si, '수수료') as RawFee)
            : isDict(get(oi, '수수료')) ? (get(oi, '수수료') as RawFee)
                : undefined);

    type FeeTable = { rows?: unknown[] };
    const hasRows = (v: unknown): v is { rows: unknown[] } =>
        isDict(v) && Array.isArray((v as Record<string, unknown>).rows);

    if (feeObj) {
        const doc  = isString(feeObj['필기']) ? feeObj['필기']
            : isString(feeObj['doc'])  ? feeObj['doc']  : null;
        const prac = isString(feeObj['실기']) ? feeObj['실기']
            : isString(feeObj['prac']) ? feeObj['prac'] : null;
        fee = { doc, prac };
    } else if (isDict(si) && isDict(get(si, '표'))) {
        // ② 배열 형태면 첫 원소를 꺼낸다
        const tableUnknown = get<unknown>(get(si, '표')!, '응시수수료');
        const table = Array.isArray(tableUnknown) ? (tableUnknown as unknown[]) : undefined;

// ③ 첫 원소가 객체처럼 생겼으면 FeeTable로 본다
        const first: FeeTable | undefined =
            table && isDict(table[0]) ? (table[0] as FeeTable) : undefined;

// ④ rows를 2차원 배열로 좁힌다
        const rows: unknown[][] | undefined = hasRows(first) && Array.isArray(first.rows)
            ? (first.rows as unknown[][])
            : undefined;

        if (Array.isArray(rows) && Array.isArray(rows[1]) && rows[1].length >= 2) {
            const r1 = rows[1] as unknown[];
            fee = {
                doc: isString(r1[0]) ? r1[0] : null,
                prac: isString(r1[1]) ? r1[1] : null,
            };
        }

    }

    // --- 출제기준 링크 목록 ---
    let standard_list: StandardItem[] | undefined;
    const rawList = isDict(si) ? get<unknown>(si, '출제기준_목록') : undefined;
    if (Array.isArray(rawList)) {
        standard_list = rawList.map(toListItem);
    }

    // --- '더보기' 링크 ---
    let standard_more: ExamInfoDto['standard_more'];
    const rawMore = isDict(si) ? get<unknown>(si, '출제기준_더보기') : undefined;
    if (isDict(rawMore) && isString(rawMore.label) && isString(rawMore.href)) {
        standard_more = { label: rawMore.label, href: rawMore.href };
    }

    return {
        fee,
        criteria_html: toHtml(isDict(si) ? si['응시기준'] : get(oi, '응시기준')),
        scope_html:    toHtml(isDict(si) ? (si['출제경향'] ?? si['출제범위']) : get(oi, '출제경향')),
        method_html:   toHtml(isDict(si) ? si['취득방법'] : (get(oi, '시험방법') ?? get(oi, '취득방법'))),
        standard_list,
        standard_more,
    };
};

/** 종목별 검정현황 */
export const pickExamStats = (c?: CertificateData | null): ExamStats | undefined => {
    if (!c) return;
    const oi = (c as { other_info?: unknown }).other_info;
    if (!isDict(oi)) return;

    const basic = isDict((oi as Record<string, unknown>).basic_info)
        ? ((oi as Record<string, unknown>).basic_info as Dict)
        : undefined;

    const maybe =
        (oi as Record<string, unknown>)['종목별검정현황'] ??
        (oi as Record<string, unknown>)['종목별 검정현황'] ??
        (basic ? (basic['종목별검정현황'] ?? basic['종목별 검정현황']) : undefined);

    return Array.isArray(maybe) ? (maybe as ExamStats) : undefined;
};

/** HTML 폴백 */
export const pickBasicHtml   = (c?: Partial<HtmlBlocks> | null): string =>
    c?.basic_info_html   ?? c?.basic_info   ?? '';

export const pickBenefitHtml = (c?: Partial<HtmlBlocks> | null): string =>
    c?.benefit_info_html ?? c?.benefit_info ?? '';
