// export type ExamEvent = {
//     startdate: string
//     enddate: string
//     label: string
//     type: string
//     certificate: string
// }
//
// export const allEvents: ExamEvent[] = [
//
//     // 가스기술사
//
//     { startdate: "2025-07-20", enddate: "2025-07-26", label: "필기접수", type: "doc-reg", certificate: "가스기술사" },
//     { startdate: "2025-08-10", enddate: "2025-08-16", label: "필기시험", type: "doc-exam", certificate: "가스기술사" },
//     { startdate: "2025-08-25", enddate: "2025-08-31", label: "필기합격", type: "doc-pass", certificate: "가스기술사" },
//     { startdate: "2025-09-01", enddate: "2025-09-07", label: "실기접수", type: "prac-reg", certificate: "가스기술사" },
//     { startdate: "2025-09-20", enddate: "2025-09-27", label: "실기시험", type: "prac-exam", certificate: "가스기술사" },
//     { startdate: "2025-10-10", enddate: "2025-10-16", label: "실기합격", type: "prac-pass", certificate: "가스기술사" },
//
//
//     // 건설기계기술사
//
//     { startdate: "2025-07-25", enddate: "2025-07-31", label: "필기접수", type: "doc-reg", certificate: "건설기계기술사" },
//     { startdate: "2025-08-15", enddate: "2025-08-21", label: "필기시험", type: "doc-exam", certificate: "건설기계기술사" },
//     { startdate: "2025-08-30", enddate: "2025-09-05", label: "필기합격", type: "doc-pass", certificate: "건설기계기술사" },
//     { startdate: "2025-09-05", enddate: "2025-09-11", label: "실기접수", type: "prac-reg", certificate: "건설기계기술사" },
//     { startdate: "2025-09-25", enddate: "2025-10-01", label: "실기시험", type: "prac-exam", certificate: "건설기계기술사" },
//     { startdate: "2025-10-15", enddate: "2025-10-21", label: "실기합격", type: "prac-pass", certificate: "건설기계기술사" },
//
//     // 건설안전기술사
//
//     { startdate: "2025-07-25", enddate: "2025-07-31", label: "필기접수", type: "doc-reg", certificate: "건설안전기술사" },
//     { startdate: "2025-08-15", enddate: "2025-08-21", label: "필기시험", type: "doc-exam", certificate: "건설안전기술사" },
//     { startdate: "2025-08-30", enddate: "2025-09-05", label: "필기합격", type: "doc-pass", certificate: "건설안전기술사" },
//     { startdate: "2025-09-05", enddate: "2025-09-11", label: "실기접수", type: "prac-reg", certificate: "건설안전기술사" },
//     { startdate: "2025-09-25", enddate: "2025-10-01", label: "실기시험", type: "prac-exam", certificate: "건설안전기술사" },
//     { startdate: "2025-10-15", enddate: "2025-10-21", label: "실기합격", type: "prac-pass", certificate: "건설안전기술사" },
//
//     // 건축품질시험기술사
//
//     { startdate: "2025-07-25", enddate: "2025-07-31", label: "필기접수", type: "doc-reg", certificate: "건축품질시험기술사" },
//     { startdate: "2025-08-15", enddate: "2025-08-21", label: "필기시험", type: "doc-exam", certificate: "건축품질시험기술사" },
//     { startdate: "2025-08-30", enddate: "2025-09-05", label: "필기합격", type: "doc-pass", certificate: "건축품질시험기술사" },
//     { startdate: "2025-09-05", enddate: "2025-09-11", label: "실기접수", type: "prac-reg", certificate: "건축품질시험기술사" },
//     { startdate: "2025-09-25", enddate: "2025-10-01", label: "실기시험", type: "prac-exam", certificate: "건축품질시험기술사" },
//     { startdate: "2025-10-15", enddate: "2025-10-21", label: "실기합격", type: "prac-pass", certificate: "건축품질시험기술사" },
//
//     // 정보처리기사
//
//     { startdate: "2025-07-20", enddate: "2025-07-26", label: "필기접수", type: "doc-reg", certificate: "정보처리기사" },
//     { startdate: "2025-08-10", enddate: "2025-08-16", label: "필기시험", type: "doc-exam", certificate: "정보처리기사" },
//     { startdate: "2025-08-25", enddate: "2025-08-31", label: "필기합격", type: "doc-pass", certificate: "정보처리기사" },
//     { startdate: "2025-09-01", enddate: "2025-09-07", label: "실기접수", type: "prac-reg", certificate: "정보처리기사" },
//     { startdate: "2025-09-20", enddate: "2025-09-27", label: "실기시험", type: "prac-exam", certificate: "정보처리기사" },
//     { startdate: "2025-10-10", enddate: "2025-10-16", label: "실기합격", type: "prac-pass", certificate: "정보처리기사" },
//
//     // 정보보안기사
//
//     { startdate: "2025-07-25", enddate: "2025-07-31", label: "필기접수", type: "doc-reg", certificate: "정보보안기사" },
//     { startdate: "2025-08-15", enddate: "2025-08-21", label: "필기시험", type: "doc-exam", certificate: "정보보안기사" },
//     { startdate: "2025-08-30", enddate: "2025-09-05", label: "필기합격", type: "doc-pass", certificate: "정보보안기사" },
//     { startdate: "2025-09-08", enddate: "2025-09-11", label: "실기접수", type: "prac-reg", certificate: "정보보안기사" },
//     { startdate: "2025-09-25", enddate: "2025-10-01", label: "실기시험", type: "prac-exam", certificate: "정보보안기사" },
//     { startdate: "2025-10-15", enddate: "2025-10-21", label: "실기합격", type: "prac-pass", certificate: "정보보안기사" },
//
//     // 기계정비산업기사
//
//     { startdate: "2025-07-25", enddate: "2025-07-26", label: "d", type: "doc-reg", certificate: "기계정비산업기사" },
//     { startdate: "2025-08-15", enddate: "2025-08-21", label: "d", type: "doc-exam", certificate: "기계정비산업기사" },
//     { startdate: "2025-08-30", enddate: "2025-09-05", label: "d", type: "doc-pass", certificate: "기계정비산업기사" },
//     { startdate: "2025-09-06", enddate: "2025-09-18", label: "d", type: "prac-reg", certificate: "기계정비산업기사" },
//     { startdate: "2025-09-25", enddate: "2025-10-01", label: "d", type: "prac-exam", certificate: "기계정비산업기사" },
//     { startdate: "2025-10-15", enddate: "2025-10-21", label: "d", type: "prac-pass", certificate: "기계정비산업기사" },
//
//     // 의류기술사
//
//     { startdate: "2025-07-25", enddate: "2025-07-31", label: "필기접수", type: "doc-reg", certificate: "의류기술사" },
//     { startdate: "2025-08-15", enddate: "2025-08-21", label: "필기시험", type: "doc-exam", certificate: "의류기술사" },
//     { startdate: "2025-08-30", enddate: "2025-09-05", label: "필기합격", type: "doc-pass", certificate: "의류기술사" },
//     { startdate: "2025-09-05", enddate: "2025-09-11", label: "실기접수", type: "prac-reg", certificate: "의류기술사" },
//     { startdate: "2025-09-25", enddate: "2025-10-01", label: "실기시험", type: "prac-exam", certificate: "의류기술사" },
//     { startdate: "2025-10-15", enddate: "2025-10-21", label: "실기합격", type: "prac-pass", certificate: "의류기술사" },
//
//     // 영양사
//
//     { startdate: "2025-07-25", enddate: "2025-07-31", label: "필기접수", type: "doc-reg", certificate: "영양사" },
//     { startdate: "2025-08-15", enddate: "2025-08-21", label: "필기시험", type: "doc-exam", certificate: "영양사" },
//     { startdate: "2025-08-30", enddate: "2025-09-05", label: "필기합격", type: "doc-pass", certificate: "영양사" },
//     { startdate: "2025-09-05", enddate: "2025-09-11", label: "실기접수", type: "prac-reg", certificate: "영양사" },
//     { startdate: "2025-09-25", enddate: "2025-10-01", label: "실기시험", type: "prac-exam", certificate: "영양사" },
//     { startdate: "2025-10-15", enddate: "2025-10-21", label: "실기합격", type: "prac-pass", certificate: "영양사" },
//
//
//
//     // 농어업토목기술사
//
//     { startdate: "2025-07-25", enddate: "2025-07-31", label: "필기접수", type: "doc-reg", certificate: "농어업토목기술사" },
//     { startdate: "2025-08-15", enddate: "2025-08-21", label: "필기시험", type: "doc-exam", certificate: "농어업토목기술사" },
//     { startdate: "2025-08-30", enddate: "2025-09-05", label: "필기합격", type: "doc-pass", certificate: "농어업토목기술사" },
//     { startdate: "2025-09-05", enddate: "2025-09-11", label: "실기접수", type: "prac-reg", certificate: "농어업토목기술사" },
//     { startdate: "2025-09-25", enddate: "2025-10-01", label: "실기시험", type: "prac-exam", certificate: "농어업토목기술사" },
//     { startdate: "2025-10-15", enddate: "2025-10-21", label: "실기합격", type: "prac-pass", certificate: "농어업토목기술사" },
//
//     // 건축기계설비기술사
//
//     { startdate: "2025-07-25", enddate: "2025-07-31", label: "필기접수", type: "doc-reg", certificate: "건축기계설비기술사" },
//     { startdate: "2025-08-15", enddate: "2025-08-21", label: "필기시험", type: "doc-exam", certificate: "건축기계설비기술사" },
//     { startdate: "2025-08-30", enddate: "2025-09-05", label: "필기합격", type: "doc-pass", certificate: "건축기계설비기술사" },
//     { startdate: "2025-09-05", enddate: "2025-09-11", label: "실기접수", type: "prac-reg", certificate: "건축기계설비기술사" },
//     { startdate: "2025-09-25", enddate: "2025-10-01", label: "실기시험", type: "prac-exam", certificate: "건축기계설비기술사" },
//     { startdate: "2025-10-15", enddate: "2025-10-21", label: "실기합격", type: "prac-pass", certificate: "건축기계설비기술사" },
//
// ]
//
//
// // 학과 관련 자격증 분류 url로 구분 ex) http://localhost:5173/departments/1
// export const deptCertUrlMap: Record<number, string[]> = {
//     23: ["정보처리기사", "정보보안기사"], // 컴퓨터소프트웨어전공
//     28: ["의류기술사"], // 패션디자인전공
//     35: ["영양사"], // 식품영양학과
//     19: ["기계정비산업기사"], // 기계시스템전공
// }
//
// // 단일 자격증 분류 url로 구분 ex) http://localhost:5173/certificate/1
// export const certUrlMap: Record<number, string> = {
//     1: "가스기술사",
//     2: "건설기계기술사",
//     3: "건설안전기술사",
//     8: "건축품질시험기술사",
//     5: "건축기계설비기술사",
//     19: "농어업토목기술사",
// }
