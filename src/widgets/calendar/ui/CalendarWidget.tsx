import { useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { calendarStyles } from "@/widgets/calendar/styles"
import { allEvents, deptCertUrlMap, certUrlMap, getColor } from "@/features/calendar/examData2"

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

    // 학과 관련 자격증, 단일 자격증 구분 후 필터링 (수정된 로직)
    const getFilteredEvents = () => {
        // 1. 학과 관련 자격증 기준으로 구분 (dept_map_id가 있는 경우)
        if (dept_map_id !== undefined && deptCertUrlMap[dept_map_id]) {
            const certNames = deptCertUrlMap[dept_map_id]
            return allEvents.filter((ev) => certNames.includes(ev.certificate))
        }

        // 2. certificateName이 있는 경우
        if (certificateName) {
            // 2-1. certificateName이 직접적인 자격증 이름인 경우
            const directMatch = allEvents.filter((ev) => ev.certificate === certificateName)
            if (directMatch.length > 0) {
                return directMatch
            }

            // 2-2. certificateName이 숫자 ID인 경우
            const certId = Number(certificateName)
            if (!isNaN(certId) && certUrlMap[certId]) {
                const certNameFromMap = certUrlMap[certId]
                return allEvents.filter((ev) => ev.certificate === certNameFromMap)
            }
        }

        // 3. 조건에 맞는 자격증이 없으면 빈 배열 반환 (모든 이벤트 대신)
        return []
    }

    // 주어진 날짜에 해당하는 자격증 시험 일정만 나타냄
    const getEventsForDate = (date: Date) =>
        getFilteredEvents().filter((ev) => isDateInRange(date, ev.startdate, ev.enddate))

    // 타입별 색상 매핑 (고정 색상)
    const getTypeColor = (type: string): string => {
        const typeColors: Record<string, string> = {
            "doc-reg": "#93c5fd", // 파란색 (필기접수)
            "doc-exam": "#fbbf24", // 노란색 (필기시험)
            "doc-pass": "#34d399", // 초록색 (필기합격)
            "prac-reg": "#a78bfa", // 보라색 (실기접수)
            "prac-exam": "#f87171", // 빨간색 (실기시험)
            "prac-pass": "#009900", // 진한 초록색 (실기합격)
        }
        return typeColors[type] || "#e5e7eb"
    }

    // 자격증별 색상 (동적 색상) - 기존 getColor 함수 활용
    const getCertificateColor = (certificate: string): string => {
        return getColor(certificate)
    }

    // 색상 모드 설정 (타입별 고정 색상 vs 자격증별 동적 색상)
    const useTypeColors = true // true: 타입별 색상, false: 자격증별 색상

    // 색상 선택 함수
    const getEventColor = (event: { type: string; certificate: string }): string => {
        return useTypeColors ? getTypeColor(event.type) : getCertificateColor(event.certificate)
    }

    // 각 날짜의 이벤트를 표시
    const tileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === "month") {
            const events = getEventsForDate(date)
            if (events.length === 0) return null

            return (
                <div className={calendarStyles.tileEvents}>
                    {events.slice(0, 3).map((ev, idx) => (
                        <div
                            key={idx}
                            className={calendarStyles.eventDot}
                            data-type={ev.type}
                            style={{ backgroundColor: getEventColor(ev) }}
                            title={`${ev.label} (${ev.certificate})`}
                        />
                    ))}
                    {events.length > 3 && <div className={calendarStyles.moreEvents}>+{events.length - 3}</div>}
                </div>
            )
        }
        return null
    }

    // 날짜 포맷팅 (한국어)
    const formatSelectedDate = (date: Date): string => {
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
        })
    }

    // 일정을 회차별로 그룹화
    const groupEventsByRound = () => {
        const events = getFilteredEvents()
        const grouped: Record<string, typeof events> = {}
        events.forEach((event) => {
            const key = `${event.certificate}`
            if (!grouped[key]) {
                grouped[key] = []
            }
            grouped[key].push(event)
        })
        return grouped
    }

    return (
        <div className={calendarStyles.calendarWidget}>
            {/* 캘린더 */}
            <div className={calendarStyles.calendarSection}>
                <Calendar
                    onClickDay={setSelectedDate}
                    tileContent={tileContent}
                    locale="ko-KR"
                    formatDay={(_locale, date) => date.getDate().toString()}
                    showNeighboringMonth={true}
                    next2Label={null}
                    prev2Label={null}
                />
            </div>

            {/* 일정 구분 범례 */}
            <div className={calendarStyles.legendSection}>
                <h3 className={calendarStyles.legendTitle}>일정 구분</h3>
                <div className={calendarStyles.legendGrid}>
                    <div className={calendarStyles.legendItem}>
                        <div className={calendarStyles.legendColor} style={{ backgroundColor: "#93c5fd" }} />
                        <span>필기접수</span>
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <div className={calendarStyles.legendColor} style={{ backgroundColor: "#fbbf24" }} />
                        <span>필기시험</span>
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <div className={calendarStyles.legendColor} style={{ backgroundColor: "#34d399" }} />
                        <span>필기합격</span>
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <div className={calendarStyles.legendColor} style={{ backgroundColor: "#a78bfa" }} />
                        <span>실기접수</span>
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <div className={calendarStyles.legendColor} style={{ backgroundColor: "#f87171" }} />
                        <span>실기시험</span>
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <div className={calendarStyles.legendColor} style={{ backgroundColor: "#009900" }} />
                        <span>실기합격</span>
                    </div>
                </div>
            </div>

            {/* 선택된 날짜 정보 */}
            {selectedDate && (
                <div className={calendarStyles.eventContainer}>
                    <div className={calendarStyles.eventTitle}>{formatSelectedDate(selectedDate)}</div>
                    <div className={calendarStyles.eventContent}>
                        {getEventsForDate(selectedDate).length > 0 ? (
                            <ul className={calendarStyles.eventListContainer}>
                                {getEventsForDate(selectedDate).map((ev, idx) => (
                                    <li key={idx} className={calendarStyles.eventItemSelected}>
                                        <div className={calendarStyles.selectedEventColor} style={{ backgroundColor: getEventColor(ev) }} />
                                        <div>
                                            <div className={calendarStyles.selectedEventLabel}>{ev.label}</div>
                                            <div className={calendarStyles.selectedEventCert}>{ev.certificate}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={calendarStyles.noEvent}>해당 날짜에 일정이 없습니다.</p>
                        )}
                    </div>
                </div>
            )}

            {/* 시험 일정 목록 */}
            <div className={calendarStyles.scheduleSection}>
                <h3 className={calendarStyles.scheduleTitle}>시험 일정</h3>
                <div className={calendarStyles.scheduleList}>
                    {Object.entries(groupEventsByRound()).map(([certificate, events]) => (
                        <div key={certificate} className={calendarStyles.certificateGroup}>
                            <h4 className={calendarStyles.certificateTitle}>{certificate}</h4>
                            <div className={calendarStyles.eventList}>
                                {events.map((event, idx) => (
                                    <div key={idx} className={calendarStyles.eventItem}>
                                        <div className={calendarStyles.eventColor} style={{ backgroundColor: getEventColor(event) }} />
                                        <div className={calendarStyles.eventDetails}>
                                            <span className={calendarStyles.eventLabel}>{event.label}</span>
                                            <span className={calendarStyles.eventDate}>{event.startdate} ~ {event.enddate}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
