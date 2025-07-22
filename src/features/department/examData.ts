
// 캘린더 데이터 (하드코딩) 및 캘린더 이벤트 글씨 색상 설정 학과 전용

// startdate : 시작일, enddate : 마감일, label : 캘린더에 뜰 텍스트, type : 지정 이름, certificate : 자격증 명
export type ExamEvent = {
    startdate: string
    enddate: string
    label: string
    type: string
    certificate: string
}

// 자격증 일정
export const allEvents: ExamEvent[] = [

    // 컴퓨터소프트웨어전공

    { startdate: "2025-07-20", enddate: "2025-07-26", label: "필기접수", type: "doc-reg", certificate: "정보처리기사" },
    { startdate: "2025-08-10", enddate: "2025-08-16", label: "필기시험", type: "doc-exam", certificate: "정보처리기사" },
    { startdate: "2025-08-25", enddate: "2025-08-31", label: "필기합격", type: "doc-pass", certificate: "정보처리기사" },
    { startdate: "2025-09-01", enddate: "2025-09-07", label: "실기접수", type: "prac-reg", certificate: "정보처리기사" },
    { startdate: "2025-09-20", enddate: "2025-09-27", label: "실기시험", type: "prac-exam", certificate: "정보처리기사" },
    { startdate: "2025-10-10", enddate: "2025-10-16", label: "실기합격", type: "prac-pass", certificate: "정보처리기사" },

    { startdate: "2025-07-25", enddate: "2025-07-31", label: "필기접수", type: "doc-reg", certificate: "정보보안기사" },
    { startdate: "2025-08-15", enddate: "2025-08-21", label: "필기시험", type: "doc-exam", certificate: "정보보안기사" },
    { startdate: "2025-08-30", enddate: "2025-09-05", label: "필기합격", type: "doc-pass", certificate: "정보보안기사" },
    { startdate: "2025-09-05", enddate: "2025-09-11", label: "실기접수", type: "prac-reg", certificate: "정보보안기사" },
    { startdate: "2025-09-25", enddate: "2025-10-01", label: "실기시험", type: "prac-exam", certificate: "정보보안기사" },
    { startdate: "2025-10-15", enddate: "2025-10-21", label: "실기합격", type: "prac-pass", certificate: "정보보안기사" },

    // 기계시스템전공

    { startdate: "2025-07-25", enddate: "2025-07-31", label: "필기접수", type: "doc-reg", certificate: "기계정비산업기사" },
    { startdate: "2025-08-15", enddate: "2025-08-21", label: "필기시험", type: "doc-exam", certificate: "기계정비산업기사" },
    { startdate: "2025-08-30", enddate: "2025-09-05", label: "필기합격", type: "doc-pass", certificate: "기계정비산업기사" },
    { startdate: "2025-09-05", enddate: "2025-09-11", label: "실기접수", type: "prac-reg", certificate: "기계정비산업기사" },
    { startdate: "2025-09-25", enddate: "2025-10-01", label: "실기시험", type: "prac-exam", certificate: "기계정비산업기사" },
    { startdate: "2025-10-15", enddate: "2025-10-21", label: "실기합격", type: "prac-pass", certificate: "기계정비산업기사" },

    // 패션디자인전공

    { startdate: "2025-07-25", enddate: "2025-07-31", label: "필기접수", type: "doc-reg", certificate: "의류기술사" },
    { startdate: "2025-08-15", enddate: "2025-08-21", label: "필기시험", type: "doc-exam", certificate: "의류기술사" },
    { startdate: "2025-08-30", enddate: "2025-09-05", label: "필기합격", type: "doc-pass", certificate: "의류기술사" },
    { startdate: "2025-09-05", enddate: "2025-09-11", label: "실기접수", type: "prac-reg", certificate: "의류기술사" },
    { startdate: "2025-09-25", enddate: "2025-10-01", label: "실기시험", type: "prac-exam", certificate: "의류기술사" },
    { startdate: "2025-10-15", enddate: "2025-10-21", label: "실기합격", type: "prac-pass", certificate: "의류기술사" },

    // 식품영양학과

    { startdate: "2025-07-25", enddate: "2025-07-31", label: "필기접수", type: "doc-reg", certificate: "영양사" },
    { startdate: "2025-08-15", enddate: "2025-08-21", label: "필기시험", type: "doc-exam", certificate: "영양사" },
    { startdate: "2025-08-30", enddate: "2025-09-05", label: "필기합격", type: "doc-pass", certificate: "영양사" },
    { startdate: "2025-09-05", enddate: "2025-09-11", label: "실기접수", type: "prac-reg", certificate: "영양사" },
    { startdate: "2025-09-25", enddate: "2025-10-01", label: "실기시험", type: "prac-exam", certificate: "영양사" },
    { startdate: "2025-10-15", enddate: "2025-10-21", label: "실기합격", type: "prac-pass", certificate: "영양사" },
]

// url번호를 사용해 자격증 분류 ex) http://localhost:5173/departments/19에는 기계정비산업기사만 뜨게함
export const deptCertMap: Record<number, string[]> = {
    23: ["정보처리기사", "정보보안기사"],
    19: ["기계정비산업기사"],
    28: ["의류기술사"],
    35: ["영양사"],
}

// 랜덤 색상 맵핑
const departmentColorMap: Record<string, string> = {}

export function getDepartmentColor(department: string): string {
    if (!departmentColorMap[department]) {
        departmentColorMap[department] = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    }
    return departmentColorMap[department]
}
