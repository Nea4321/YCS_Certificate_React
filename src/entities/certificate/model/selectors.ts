import { CertificateData, ExamInfoDto, ExamStats, HtmlBlocks } from './types';
import { Dict, isDict, get, toHtml } from './guards';

/** 시험정보: 수수료/출제기준 링크까지 포함 */
export const pickExamInfo = (c?: CertificateData | null): ExamInfoDto | undefined => {
    if (!c) return;

    const nx = (c as any).exam_info_normalized as ExamInfoDto | undefined;
    const ex = (c as any).exam_info as ExamInfoDto | undefined;
    if (nx || ex) return nx ?? ex;

    const oi = (c as any).other_info;
    if (!isDict(oi)) return;

    const si = get<Dict>(oi, '시험정보');

    // --- 수수료 ---
    let fee: ExamInfoDto['fee'];
    const rawFee = (isDict(si) && isDict(get(si, '수수료'))) ? get<Dict>(si, '수수료')
        : isDict(get(oi, '수수료')) ? get<Dict>(oi, '수수료')
            : undefined;

    if (rawFee) {
        fee = {
            doc: (rawFee['필기'] as string) ?? (rawFee['doc'] as string) ?? null,
            prac: (rawFee['실기'] as string) ?? (rawFee['prac'] as string) ?? null,
        };
    } else if (isDict(si) && isDict(get(si, '표'))) {
        const table = get<Dict>(get(si, '표')!, '응시수수료') as any[] | undefined;
        const rows: string[][] | undefined = table?.[0]?.rows;
        if (Array.isArray(rows) && rows[1]?.length >= 2) {
            fee = { doc: rows[1][0], prac: rows[1][1] };
        }
    }

    // --- 출제기준 링크 ---
    let standard_list: ExamInfoDto['standard_list'];
    const rawList = isDict(si) ? (get<any[]>(si, '출제기준_목록')) : undefined;
    if (Array.isArray(rawList)) {
        standard_list = rawList.map(it => ({
            label: String(it?.label ?? ''),
            href: it?.href ?? null,
            action: it?.action ?? null,
        }));
    }

    let standard_more: ExamInfoDto['standard_more'];
    const rawMore = isDict(si) ? get<Dict>(si, '출제기준_더보기') : undefined;
    if (isDict(rawMore) && typeof rawMore.label === 'string' && typeof rawMore.href === 'string') {
        standard_more = { label: rawMore.label, href: rawMore.href };
    }

    return {
        fee,
        criteria_html: toHtml(isDict(si) ? si['응시기준'] : get(oi, '응시기준')),
        scope_html: toHtml(isDict(si) ? (si['출제경향'] ?? si['출제범위']) : get(oi, '출제경향')),
        method_html: toHtml(isDict(si) ? si['취득방법'] : (get(oi, '시험방법') ?? get(oi, '취득방법'))),
        standard_list,
        standard_more,
    };
};

/** 종목별 검정현황 */
export const pickExamStats = (c?: CertificateData | null): ExamStats | undefined => {
    if (!c) return;
    const oi = (c as any).other_info;
    if (!isDict(oi)) return;

    const val =
        (oi as any)['종목별검정현황'] ??
        (oi as any)['종목별 검정현황'] ??
        (isDict((oi as any).basic_info) && ((oi as any).basic_info['종목별검정현황'] ?? (oi as any).basic_info['종목별 검정현황']));

    return Array.isArray(val) ? (val as ExamStats) : undefined;
};

/** HTML 폴백 */
export const pickBasicHtml = (c?: Partial<HtmlBlocks> | null): string =>
    c?.basic_info_html ?? c?.basic_info ?? '';

export const pickBenefitHtml = (c?: Partial<HtmlBlocks> | null): string =>
    c?.benefit_info_html ?? c?.benefit_info ?? '';
