
// 자격증 Calendar 컴포넌트

import { useState } from "react"
import Calendar from "react-calendar"
import { ExamEvent, allEvents, deptCertMap, getDepartmentColor } from "./examData.ts"
import { departmentDetailStyles } from "../../../widgets/department/styles"

interface CertificateCalendarProps {
    dept_map_id: number
}

export function DepartmentCalendar({ dept_map_id }: CertificateCalendarProps) {

    // 클릭한 날짜를 저장 및 상태 관리
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    // 자격증 이름 배열을 dept_map_id를 찾아서 가져옴
    const certificateNames = deptCertMap[dept_map_id] || []

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

    // 학과와 자격증 이름과 일치한지 필터링
    const getFilteredEvents = (): ExamEvent[] => {
        return allEvents.filter((ev) => certificateNames.includes(ev.certificate))
    }

    // 주어진 날짜에 해당하는 자격증 시험 일정만 나타냄
    // 같은 날짜인 자격증 확인
    const getEventsForDate = (date: Date): ExamEvent[] => {
        return getFilteredEvents().filter((ev) => isDateInRange(date, ev.startdate, ev.enddate))
    }

    // 각 날짜의 이벤트를 표시 ex) 필기시험
    const tileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === "month") {
            const events = getEventsForDate(date)
            return (
                <div>
                    {events.map((ev, idx) => (
                        <div key={idx} style={{ fontSize: "0.7rem", color: getDepartmentColor(ev.certificate) }}>
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
                                    <span style={{ color: getDepartmentColor(ev.certificate) }}>
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
        </>
    )
}
