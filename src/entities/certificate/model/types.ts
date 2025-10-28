/** ───────── 기본 엔티티 ───────── */
export interface Certificate {
    certificate_id: number;
    certificate_name: string;
    jmcd: string;
    organization_id: number;
    tag: number[];
}

export interface Organization { organization_id: number; organization_name: string; }
export interface Tag { tag_id: number; tag_name: string; color: string; }

export interface Schedule {
    certificate_id: number;
    certificate_name: string;
    schedule: Record<string, string | null>[];
}

/** 자격증 상세(캐시) */
export interface CertificateData {
    certificate_id: number;
    certificate_name: string;
    basic_info: string;                 // 원문 HTML
    schedule: Record<string, string | null>[];
    other_info: unknown;                // 백엔드가 object|string 등 다양 → guards로 좁힘
    organization_id: number;

    // 선택 필드(정규화/HTML)
    exam_info_normalized?: ExamInfoDto;
    exam_info?: ExamInfoDto;
    basic_info_html?: string;
    benefit_info_html?: string;
    benefit_info?: string;
    basic_info_plain?: string;
}

export interface NationalSchedule {
    name: string;
    content: string;
}

/** ───────── 스케줄 DTO ───────── */
export type ExamEventTypeBE =
    | 'DOC_REG' | 'DOC_EXAM' | 'DOC_PASS'
    | 'PRAC_REG' | 'PRAC_EXAM' | 'PRAC_PASS';

export interface ExamEventDto { startDate: string; endDate: string; type: ExamEventTypeBE; }
export interface ScheduleEventsDto { events: ExamEventDto[]; }

export interface RegularScheduleRow {
    round?: string | number;
    applyStart?: string;
    applyEnd?: string;
    examDate?: string;
    resultDate?: string;
    note?: string;
    [k: string]: unknown;
}
export type SpecialScheduleRow = RegularScheduleRow;

/** ───────── 시험정보 DTO ───────── */
export interface StandardLink {
    label: string;
    href?: string | null;
    action?: string | Record<string, unknown> | null; // ⬅️ string 허용
}

export interface ExamInfoFee { doc?: string|null; prac?: string|null }

export interface ExamInfoDto {
    fee?: ExamInfoFee;
    criteria_html?: string;
    scope_html?: string;
    method_html?: string;
    standard_list?: StandardLink[];
    standard_more?: { label: string; href: string };
    sections?: Array<{ title?: string; html?: string }>;
    [k: string]: unknown;
}

/** ───────── 기본/우대 HTML 선택 ───────── */
export interface HtmlBlocks {
    basic_info_html?: string;
    basic_info?: string;
    benefit_info_html?: string;
    benefit_info?: string;
}

/** ───────── 종목별 검정현황 ───────── */
export type ExamStatsRow = Record<string, string | number>;
export type ExamStats = ExamStatsRow[];
