import { memo, useState } from "react"
import type { DeptMapData } from "@/entities/department/model"
import { departmentDetailStyles } from "../styles"
import { Link } from "react-router-dom"
import Calendar from "react-calendar"

interface DepartmentDetailProps {
    department: DeptMapData
}

type ExamEvent = {
    startdate: string
    enddate: string
    label: string
    type: string
    certificate: string
}

// 학과별 자격증 데이터
const allEvents: ExamEvent[] = [

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

// 학과마다 자격증 분류정보
const deptCertMap: Record<number, string[]> = {
    23: ["정보처리기사", "정보보안기사"],
    19: ["기계정비산업기사"],
    28: ["의류기술사"],
    35: ["영양사"],
}

// 일정 색상 매핑
const colorMap: Record<string, string> = {}

function getCertificateColor(certificate: string): string {
    if (!colorMap[certificate]) {
        const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
        colorMap[certificate] = randomColor
    }
    return colorMap[certificate]
}

export const DepartmentDetail = memo(({ department }: DepartmentDetailProps) => {

    // 클릭한 날짜를 저장 및 상태 관리
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const certificateNames = deptCertMap[department.dept_map_id] || []

    // 날짜 형식 변환
    const formatDate = (date: Date): string => {
        const y = date.getFullYear()
        const m = ("0" + (date.getMonth() + 1)).slice(-2)
        const d = ("0" + date.getDate()).slice(-2)
        return `${y}-${m}-${d}`
    }

    // 시작일, 종료일 사이에 포함되는지 확인
    const isDateInRange = (date: Date, start: string, end: string) => {
        const target = formatDate(date)
        return start <= target && target <= end
    }

    // 학과와 자격증 이름과 일치한지 필터링
    const getFilteredEvents = () => {
        return allEvents.filter((ev) => certificateNames.includes(ev.certificate))
    }

    // 주어진 날짜에 해당하는 자격증 시험 일정만 나타냄
    const getEventsForDate = (date: Date) => {
        return getFilteredEvents().filter((ev) => isDateInRange(date, ev.startdate, ev.enddate))
    }

    // 각 날짜의 이벤트를 표시
    const tileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === "month") {
            const events = getEventsForDate(date)
            return (
                <div>
                    {events.map((ev, idx) => (
                        <div key={idx} style={{ fontSize: "0.7rem", color: getCertificateColor(ev.certificate) }}>
                            {ev.label}
                        </div>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <div className={departmentDetailStyles.container}>
            <div className={departmentDetailStyles.header}>
                <h1 className={departmentDetailStyles.title}>{department.dept_map_name}</h1>
            </div>

            <div className={departmentDetailStyles.content}>
                <section className={departmentDetailStyles.certificatesSection}>
                    <h2>관련 자격증</h2>
                    {certificateNames.length > 0 ? (
                        <div className={departmentDetailStyles.certificateGrid}>
                            {certificateNames.map((certName, idx) => (
                                <Link
                                    to={`/certificate/${certName}`}
                                    key={idx}
                                    className={departmentDetailStyles.certificateCard}
                                >
                                    <h3 className={departmentDetailStyles.certificateName}>{certName}</h3>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className={departmentDetailStyles.noCertificates}>관련 자격증 정보가 없습니다.</div>
                    )}
                </section>

                <section className={departmentDetailStyles.descriptionSection}>
                    <h2>학과 소개</h2>
                    <div className={departmentDetailStyles.description}>{department.description || "학과 소개 정보가 없습니다."}</div>
                </section>

                <section className={departmentDetailStyles.calendarSection}>
                    <h2>자격증 시험 일정</h2>
                    <Calendar className={departmentDetailStyles.calendar} onClickDay={setSelectedDate} tileContent={tileContent}/>
                    {selectedDate && (
                        <div className={departmentDetailStyles.eventContainer}>
                            <strong className={departmentDetailStyles.eventTitle}>
                                {formatDate(selectedDate)} 일정
                            </strong>
                            <ul className={departmentDetailStyles.eventList}>
                                {getEventsForDate(selectedDate).length > 0 ? (
                                    getEventsForDate(selectedDate).map((ev, idx) => (
                                        <li key={idx} className={departmentDetailStyles.eventItem}>
                                            <span style={{ color: getCertificateColor(ev.certificate) }}>
                                                {ev.label} ({ev.certificate})
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <li className={departmentDetailStyles.noEvent}>해당 날짜에 자격증 일정이 없습니다.</li>
                                )}
                            </ul>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
})

DepartmentDetail.displayName = "DepartmentDetail"
