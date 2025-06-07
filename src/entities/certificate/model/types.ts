export interface Certificate {
    certificate_id: number,
    certificate_name: string
}

export interface CertData {
    certificate_id: number,
    ///시행년도
    implYy: number,
    ///시행회차
    implSeq: number,
    ///설명
    description: string,
    ///필기시험 원서접수 시작일자
    docRegStartDt: number,
    ///필기시험 원서접수 종료일자
    docRegEndDt: number,
    ///필기시험 시작일자
    docExamStartDt: number,
    ///필기시험 종료일자
    docExamEndDt: number,
    ///필기시험 합격(예정)자 발표일자
    docPassDt: number,
    ///실기(작업)/면접 시험 원서접수 시작일자
    pracRegStartDt: number,
    ///실기(작업)/면접 시험 원서접수 종료일자
    pracRegEndDt: number,
    ///실기(작업)/면접 시험 시작일자
    pracExamStartDt: number,
    ///실기(작업)/면접 시험 종료일자
    pracExamEndDt: number,
    ///실기(작업)/면접 합격자 발표일자
    pracPassDt: number
}