import { useState } from "react"
import Calendar from "react-calendar"
import { getCertificateColor, ExamEvent, allEvents } from "./examData1.ts"
import { certificateDetailStyles } from "@/widgets/certificate/styles"

interface CertificateCalendarProps {
    certificateName: string
}

export function CertificateCalendar({ certificateName }: CertificateCalendarProps) {

    // 클릭한 날짜를 저장 및 상태 관리
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    // 날짜 형식 변환
    const formatDate = (date: Date): string => {
        const y = date.getFullYear()
        const m = ("0" + (date.getMonth() + 1)).slice(-2)
        const d = ("0" + date.getDate()).slice(-2)
        return `${y}-${m}-${d}`
    }

    // 선택 날짜에 해당하는 이벤트만 필터링
    // DepartmentCalendar와 다르게 자격증 한 개 정보만 들어오기 때문에 범위
    const getEventsForCertificate = (): ExamEvent[] =>
        allEvents.filter((ev) => ev.certificate === certificateName)

    // 주어진 날짜에 해당하는 자격증 시험 일정만 나타냄
    const getEventsForDate = (date: Date): ExamEvent[] => {
        const target = formatDate(date)
        return getEventsForCertificate().filter((ev) => ev.startdate <= target && target <= ev.enddate)
    }

    // 각 날짜의 이벤트를 표시 ex) 필기시험
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
        <>
            <Calendar className={certificateDetailStyles.calendar} onClickDay={setSelectedDate} tileContent={tileContent} />
            {selectedDate && (
                <div className={certificateDetailStyles.eventContainer}>
                    <strong className={certificateDetailStyles.eventTitle}>{formatDate(selectedDate)} 일정</strong>
                    <ul className={certificateDetailStyles.eventList}>
                        {getEventsForDate(selectedDate).length > 0 ? (
                            getEventsForDate(selectedDate).map((ev, idx) => (
                                <li key={idx} style={{ color: getCertificateColor(ev.certificate) }}>
                                    {ev.label} ({ev.certificate})
                                </li>
                            ))
                        ) : (
                            <li>해당 날짜에 자격증 일정이 없습니다.</li>
                        )}
                    </ul>
                </div>
            )}
        </>
    )
}
