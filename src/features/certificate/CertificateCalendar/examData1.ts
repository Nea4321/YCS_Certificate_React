
// 캘린더 데이터 (하드코딩) 및 캘린더 이벤트 글씨 색상 설정 자격증 전용

// startdate : 시작일, enddate : 마감일, label : 캘린더에 뜰 텍스트, type : 지정 이름, certificate : 자격증명
export type ExamEvent = {
    startdate: string
    enddate: string
    label: string
    type: string
    certificate: string
}

// 자격증 일정
export const allEvents: ExamEvent[] = [

    // 가스기술사

    { startdate: "2025-07-20", enddate: "2025-07-26", label: "필기접수", type: "doc-reg", certificate: "가스기술사" },
    { startdate: "2025-08-10", enddate: "2025-08-16", label: "필기시험", type: "doc-exam", certificate: "가스기술사" },
    { startdate: "2025-08-25", enddate: "2025-08-31", label: "필기합격", type: "doc-pass", certificate: "가스기술사" },
    { startdate: "2025-09-01", enddate: "2025-09-07", label: "실기접수", type: "prac-reg", certificate: "가스기술사" },
    { startdate: "2025-09-20", enddate: "2025-09-27", label: "실기시험", type: "prac-exam", certificate: "가스기술사" },
    { startdate: "2025-10-10", enddate: "2025-10-16", label: "실기합격", type: "prac-pass", certificate: "가스기술사" },

    { startdate: "2025-07-25", enddate: "2025-07-31", label: "필기접수", type: "doc-reg", certificate: "정보보안기사" },
    { startdate: "2025-08-15", enddate: "2025-08-21", label: "필기시험", type: "doc-exam", certificate: "정보보안기사" },
    { startdate: "2025-08-30", enddate: "2025-09-05", label: "필기합격", type: "doc-pass", certificate: "정보보안기사" },
    { startdate: "2025-09-05", enddate: "2025-09-11", label: "실기접수", type: "prac-reg", certificate: "정보보안기사" },
    { startdate: "2025-09-25", enddate: "2025-10-01", label: "실기시험", type: "prac-exam", certificate: "정보보안기사" },
    { startdate: "2025-10-15", enddate: "2025-10-21", label: "실기합격", type: "prac-pass", certificate: "정보보안기사" },

    // 건설기계기술사

    { startdate: "2025-07-25", enddate: "2025-07-31", label: "필기접수", type: "doc-reg", certificate: "건설기계기술사" },
    { startdate: "2025-08-15", enddate: "2025-08-21", label: "필기시험", type: "doc-exam", certificate: "건설기계기술사" },
    { startdate: "2025-08-30", enddate: "2025-09-05", label: "필기합격", type: "doc-pass", certificate: "건설기계기술사" },
    { startdate: "2025-09-05", enddate: "2025-09-11", label: "실기접수", type: "prac-reg", certificate: "건설기계기술사" },
    { startdate: "2025-09-25", enddate: "2025-10-01", label: "실기시험", type: "prac-exam", certificate: "건설기계기술사" },
    { startdate: "2025-10-15", enddate: "2025-10-21", label: "실기합격", type: "prac-pass", certificate: "건설기계기술사" },

    // 건설안전기술사

    { startdate: "2025-07-25", enddate: "2025-07-31", label: "필기접수", type: "doc-reg", certificate: "건설안전기술사" },
    { startdate: "2025-08-15", enddate: "2025-08-21", label: "필기시험", type: "doc-exam", certificate: "건설안전기술사" },
    { startdate: "2025-08-30", enddate: "2025-09-05", label: "필기합격", type: "doc-pass", certificate: "건설안전기술사" },
    { startdate: "2025-09-05", enddate: "2025-09-11", label: "실기접수", type: "prac-reg", certificate: "건설안전기술사" },
    { startdate: "2025-09-25", enddate: "2025-10-01", label: "실기시험", type: "prac-exam", certificate: "건설안전기술사" },
    { startdate: "2025-10-15", enddate: "2025-10-21", label: "실기합격", type: "prac-pass", certificate: "건설안전기술사" },

    // 건축품질시험기술사

    { startdate: "2025-07-25", enddate: "2025-07-31", label: "필기접수", type: "doc-reg", certificate: "건축품질시험기술사" },
    { startdate: "2025-08-15", enddate: "2025-08-21", label: "필기시험", type: "doc-exam", certificate: "건축품질시험기술사" },
    { startdate: "2025-08-30", enddate: "2025-09-05", label: "필기합격", type: "doc-pass", certificate: "건축품질시험기술사" },
    { startdate: "2025-09-05", enddate: "2025-09-11", label: "실기접수", type: "prac-reg", certificate: "건축품질시험기술사" },
    { startdate: "2025-09-25", enddate: "2025-10-01", label: "실기시험", type: "prac-exam", certificate: "건축품질시험기술사" },
    { startdate: "2025-10-15", enddate: "2025-10-21", label: "실기합격", type: "prac-pass", certificate: "건축품질시험기술사" },
]

// url번호를 사용해 자격증 분류 ex) http://localhost:5173/certificate/1에는 가스기술사 캘린더 출력
export const deptCertMap: Record<number, string[]> = {
    1: ["가스기술사"],
    2: ["건설기계기술사"],
    3: ["건설안전기술사"],
    8: ["건축품질시험기술사"],
}

const certificateColorMap: Record<string, string> = {}

export function getCertificateColor(certificate: string): string {
    if (!certificateColorMap[certificate]) {
        certificateColorMap[certificate] = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    }
    return certificateColorMap[certificate]
}
