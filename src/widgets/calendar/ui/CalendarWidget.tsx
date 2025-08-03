import { useState } from "react"
import Calendar from "react-calendar"
import { allEvents, deptCertUrlMap, certUrlMap, getColor } from "@/features/calendar/examData2.ts"
import styles from "@/widgets/certificate/styles/certificate-detail.module.css"

interface CalendarProps {
    certificateName?: string
    dept_map_id?: number
}

export function CalendarWidget({ certificateName, dept_map_id }: CalendarProps) {

    // 클릭한 날짜를 저장 및 상태 관리
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    // 날짜 형식 변환
    const formatDate = (date: Date): string => {
        const y = date.getFullYear()
        const m = ("0" + (date.getMonth() + 1)).slice(-2)
        const d = ("0" + date.getDate()).slice(-2)
        return `${y}-${m}-${d}`
    }

    // 시작일, 종료일 사이에 포함되는지 확인
    const isDateInRange = (date: Date, start: string, end: string): boolean => {
        const target = formatDate(date)
        return start <= target && target <= end
    }

    // 학과 관려 자격증, 단일 자격증 구분 후 필터링
    const getFilteredEvents = () => {

        if (certificateName && typeof certificateName === "string") {
            return allEvents.filter(ev => ev.certificate === certificateName)
        }

        // 학과 관련 자격증 기준으로 구분
        if (dept_map_id !== undefined && deptCertUrlMap[dept_map_id]) {
            const certNames = deptCertUrlMap[dept_map_id]
            return allEvents.filter(ev => certNames.includes(ev.certificate))
        }

        // 단일 자격증 기준으로 구분
        const certId = Number(certificateName)
        if (!isNaN(certId) && certUrlMap[certId]) {
            const certNameFromMap = certUrlMap[certId]
            return allEvents.filter(ev => ev.certificate === certNameFromMap)
        }

        return []
    }

    // 주어진 날짜에 해당하는 자격증 시험 일정만 나타냄
    // 같은 날짜인 자격증 확인
    const getEventsForDate = (date: Date) =>
        getFilteredEvents().filter(ev => isDateInRange(date, ev.startdate, ev.enddate))

    // 각 날짜의 이벤트를 표시 ex) 필기시험
    const tileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === "month") {
            const events = getEventsForDate(date)
            return (
                <div>
                    {events.map((ev, idx) => (
                        <div key={idx} style={{ fontSize: "0.7rem", color: getColor(ev.certificate) }}>
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
            <Calendar className={styles.calendar} onClickDay={setSelectedDate} tileContent={tileContent} />
            {selectedDate && (
                <div className={styles.eventContainer}>
                    <strong className={styles.eventTitle}>{formatDate(selectedDate)} 일정</strong>
                    <ul className={styles.eventList}>
                        {getEventsForDate(selectedDate).length > 0 ? (
                            getEventsForDate(selectedDate).map((ev, idx) => (
                                <li key={idx} style={{ color: getColor(ev.certificate) }}>
                                    {ev.label} ({ev.certificate})
                                </li>
                            ))
                        ) : (
                            <li className={styles.noEvent}>해당 날짜에 자격증 일정이 없습니다.</li>
                        )}
                    </ul>
                </div>
            )}
        </>
    )
}
