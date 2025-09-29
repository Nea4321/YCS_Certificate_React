export interface Certificate {
    certificate_id: number,
    certificate_name: string,
    jmcd: string,
    category?: string
}

// entities/certificate/model/types.ts
export type ExamEventTypeBE =
    | 'DOC_REG' | 'DOC_EXAM' | 'DOC_PASS'
    | 'PRAC_REG' | 'PRAC_EXAM' | 'PRAC_PASS';

export interface ExamEventDto {
    startDate: string;   // 'YYYY-MM-DD'
    endDate: string;     // 'YYYY-MM-DD'
    type: ExamEventTypeBE;
}
// 통합 뷰
export interface CertificatePublicViewDto {
    meta?: { id: number; name?: string };
    schedule?: ScheduleDto;
    examInfo?: ExamInfoDto;
    basicInfo?: BasicInfoDto;
    preference?: PreferenceDto;
}

export interface ScheduleEventsDto {
    events: ExamEventDto[];
}

// ── Schedule
export interface ScheduleDto {
    regular?: RegularScheduleRow[];   // 정기검정일정
    special?: SpecialScheduleRow[];   // 상시/특별 등 (있다면)
    updatedAt?: string;
    [k: string]: unknown;
}

export interface RegularScheduleRow {
    round?: string | number;  // 제○회
    applyStart?: string;      // 원서접수 시작
    applyEnd?: string;        // 원서접수 종료
    examDate?: string;        // 시험일
    resultDate?: string;      // 합격자발표
    note?: string;            // 비고
    [k: string]: unknown;
}
export type SpecialScheduleRow = RegularScheduleRow;

// ── ExamInfo/BasicInfo/Preference (필드는 점진 확장)
export interface ExamInfoDto { sections?: unknown[]; fee?: unknown; [k: string]: unknown }
export interface BasicInfoDto { overview?: string; history?: unknown; [k: string]: unknown }
export interface PreferenceDto { items?: unknown[]; [k: string]: unknown }

// entities/certificate/model/types.ts
export interface CertData {
    certificate_id?: number;
    certificate_name?: string;
    infogb?: string;
    contents?: string;      // 문자열로 내려오니 string이 편함
    [k: string]: unknown;
}

