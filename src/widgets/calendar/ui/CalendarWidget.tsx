import { useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { calendarStyles } from "@/widgets/calendar/styles"
import { allEvents, deptCertUrlMap, certUrlMap, getColor } from "@/features/calendar/examData2"

/**CalendarWidget에 전달되는 props
 *
 * @property {string} certificateName - 학과와 관련없는, 단일 자격증에 접근하기 위한 자격증 이름
 * @property {number} dept_map_id - 학과 관련 자격증을 구분하기 위한 학과 매핑 id
 */
interface CalendarProps {
    certificateName?: string
    dept_map_id?: number
}

/**자격증 캘린더 컴포넌트
 * - 사용자가 선택한 학과에 관련된 자격증의 여러 일정 정보가 담긴 캘린더 UI를 배치
 * - 필기접수, 필기시험, 필기합격, 실기접수, 실기시험, 실기합격 6개의 일정이 존재한다
 * - 학과 기준 또는 단일 자격증 기준으로 이벤트를 필터링하여 달력에 표시한다
 * - 자격증별로 전체 일정 목록을 라벨/기간/색상으로 묶어서 보여준다
 *
 * @component
 */
export function CalendarWidget({ certificateName, dept_map_id }: CalendarProps) {
    // 클릭한 날짜를 저장 및 상태 관리
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    // 날짜 형식 변환
    /**사용자가 클릭한 캘린더 타일 날짜를 'YYYY-MM-DD' 형식으로 변환하여 반환하는 함수
     *
     * @param {Date} date - 변환할 Date 객체
     *
     * @returns 'YYYY-MM-DD'
     */
    const formatDate = (date: Date): string => {
        const y = date.getFullYear()
        const m = ("0" + (date.getMonth() + 1)).slice(-2)
        const d = ("0" + date.getDate()).slice(-2)
        return `${y}-${m}-${d}`
    }

    // 시작일, 종료일 사이에 포함되는지 확인
    /**Date 객체(사용자가 선택한 타일 날짜)가 일정 시작 일자와 종료 일자에 포함되는 날짜인지 확인하는 함수
     *
     * @returns 날짜가 범위 내에 있다면 true, 범위 내에 없다면 false
     */
    const isDateInRange = (date: Date, start: string, end: string): boolean => {
        const target = formatDate(date)
        return start <= target && target <= end
    }

    // 학과 관련 자격증, 단일 자격증 구분 후 필터링 (수정된 로직)
    /**표시할 자격증 이벤트를 필터링해서 반환한다
     *
     * - dept_map_id가 존재하는 경우: deptCertUrlMap에서 해당 학과에 매핑된 자격증을 가져와
     *   일치하는 이벤트만을 반환한다
     * - certificateName이 존재하는 경우: 해당 certificateName이 정확한 자격증 이름을 지닌다면 해당 이벤트만을 반환
     *   또는 certificateName이 숫자 ID로 구성된 경우 certUrlMap에서 해당하는 ID를 지닌 자격증 이름을 찾아서 해당 이벤트만을 반환
     * - 조건에 맞지 않는다면 빈 배열 반환
     *
     * @returns 필터링된 자격증 이벤트 배열
     */
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
    /**특정 날짜에 해당하는 자격증 시험 일정을 반환한다
     *
     * @param {Date} date - 검사할 Date 객체
     *
     * @returns 해당 날짜에 포함된 ExamEvent 배열 내용
     */
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
    /**캘린더에 일정을 표시하는 함수
     *
     * - 사용자가 선택한 타일에 존재하는 모든 이벤트(일정)를 가져온다
     * - 이벤트가 존재하지 않는다면 null을 반환하고 아무것도 표시하지 않는다
     * - 이벤트가 존재한다면 최대 3개의 이벤트를 점으로 표시하며,
     *   점의 색상으로 일정을 구분한다
     *
     * @param date - 타일 날짜
     * @param {string} view - 달력의 뷰 타입 ('month')
     *
     * @returns 해당 날짜에 일정이 존재한다면 이벤트 점 표시
     */
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
    /**선택한 타일의 날짜를 YYYY년 MM월 DD일로 포맷팅 하는 함수*/
    const formatSelectedDate = (date: Date): string => {
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
        })
    }

    // 일정을 회차별로 그룹화
    /**자격증별로 이벤트를 그룹화해서 반환
     * - 현재 자격증의 모든 일정을 받아와 ExamEvent 배열 events에 저장
     * - 자격증 이름을 키로 설정하고 grouped 배열에 존재하지 않는 자격증은 빈 배열로 생성
     * - 이후 현재 순환중인 일정을 해당 자격증 배열인 grouped에 push
     *
     * @returns grouped
     */
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
