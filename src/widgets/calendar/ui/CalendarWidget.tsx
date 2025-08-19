import { useState, useEffect } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { calendarStyles } from "@/widgets/calendar/"
import { allEvents, deptCertUrlMap, certUrlMap, type ExamEvent } from "@/features/calendar/examData2"

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
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null)

    const getDepartmentCertificates = (): string[] => {
        if (dept_map_id !== undefined && deptCertUrlMap[dept_map_id]) {
            return deptCertUrlMap[dept_map_id]
        }
        return []
    }

    const departmentCertificates = getDepartmentCertificates()

    useEffect(() => {
        if (dept_map_id !== undefined && departmentCertificates.length > 0 && selectedCertificate === null) {
            setSelectedCertificate(departmentCertificates[0])
        }
    }, [dept_map_id, departmentCertificates, selectedCertificate])

    // Date 객체를 YYYY-MM-DD로 변환하는 것
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
            if (selectedCertificate) {
                return allEvents.filter((ev) => ev.certificate === selectedCertificate)
            }
            return []
        }

        // 2. certificateName이 있는 경우
        if (certificateName) {
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

    // 이벤트 달력 시작/끝 위치 체크
    const getExtendedDatePosition = (date: Date, event: ExamEvent) => {
        const dateStr = formatDate(date)
        const { startdate, enddate } = event

        const currentMonth = new Date(date.getFullYear(), date.getMonth(), 1)
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        const firstDayOfMonth = formatDate(currentMonth)
        const lastDayOfMonth = formatDate(nextMonth)

        const isStart = dateStr === startdate
        const isEnd = dateStr === enddate
        const isSingle = isStart && isEnd

        const eventStartsBeforeMonth = startdate < firstDayOfMonth
        const eventEndsAfterMonth = enddate > lastDayOfMonth

        if (isSingle) return "single"

        if (isStart && !eventEndsAfterMonth) return "start"
        if (isEnd && !eventStartsBeforeMonth) return "end"
        if (isStart && eventEndsAfterMonth) return "start-continues"
        if (isEnd && eventStartsBeforeMonth) return "continues-end"
        if (eventStartsBeforeMonth && eventEndsAfterMonth) return "continues-through"
        if (eventStartsBeforeMonth && !isEnd) return "continues-middle"
        if (eventEndsAfterMonth && !isStart) return "middle-continues"
        return "middle"
    }

    // 타일 클래스 이름 적용
    const tileClassName = ({ date, view }: { date: Date; view: string }) => {
        if (view === "month") {
            const events = getEventsForDate(date)
            if (events.length > 0) {
                const classes: string[] = []

                events.forEach((event) => {
                    const position = getExtendedDatePosition(date, event)
                    classes.push(`calendar-tile-${event.type} calendar-tile-${event.type}--${position}`)

                    if (position.startsWith("start")) {
                        classes.push(`calendar-tile--round-left-${event.type}`)
                    }
                    if (position.endsWith("end")) {
                        classes.push(`calendar-tile--round-right-${event.type}`)
                    }
                })

                return classes.join(" ")
            }
        }
        return null
    }

    // 각 타일 이벤트 표시
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
            if (events.length > 0) {
                const dateStr = formatDate(date)
                const startingEvents = events.filter((event) => event.startdate === dateStr)

                if (startingEvents.length > 0) {
                    const uniqueCertificates = [...new Set(startingEvents.map((event) => event.certificate))]
                    return (
                        <div className={calendarStyles.tileContent}>
                            <div className={calendarStyles.certificateList}>
                                {uniqueCertificates.slice(0, 2).map((certificate, index) => (
                                    <div key={index} className={calendarStyles.certificateName}>
                                        {certificate}
                                    </div>
                                ))}
                            </div>
                            {uniqueCertificates.length > 2 && (
                                <div className={calendarStyles.moreEvents}>+{uniqueCertificates.length - 2}</div>
                            )}
                        </div>
                    )
                }
            }
        }
        return null
    }

    // 달력 상단 열/월 표시
    const navigationLabel = ({ date, view }: { date: Date; view: string }) => {
        if (view === "month") {
            return `${date.getFullYear()}년 ${date.getMonth() + 1}월`
        }
        return null
    }

    const isDepartmentView = dept_map_id !== undefined && departmentCertificates.length > 0

    return (
        <div className={calendarStyles.calendarWidget}>
            {isDepartmentView && (
                <div className={calendarStyles.certificateSelector}>
                    <h3 className={calendarStyles.selectorTitle}>자격증 선택</h3>
                    <div className={calendarStyles.certificateButtons}>
                        {departmentCertificates.map((cert) => (
                            <button
                                key={cert}
                                className={`${calendarStyles.certificateButton} ${
                                    selectedCertificate === cert ? calendarStyles.certificateButtonActive : ""
                                }`}
                                onClick={() => setSelectedCertificate(cert)}
                            >
                                {cert}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className={calendarStyles.calendarSection}>
                <Calendar
                    value={currentDate}
                    onChange={(value) => setCurrentDate(value as Date)}
                    tileClassName={tileClassName}
                    tileContent={tileContent}
                    locale="ko-KR"
                    formatDay={(_locale, date) => date.getDate().toString()}
                    showNeighboringMonth={true}
                    next2Label={null}
                    prev2Label={null}
                    nextLabel="다음 >"
                    prevLabel="< 이전"
                    navigationLabel={navigationLabel}
                />
            </div>
            <div className={calendarStyles.legendSection}>
                <h3 className={calendarStyles.legendTitle}>일정 구분</h3>
                <div className={calendarStyles.legendGrid}>
                    <div className={calendarStyles.legendItem}>
                        <div className={`${calendarStyles.legendColor} ${calendarStyles.legendColorDocReg}`} />
                        <span>필기접수</span>
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <div className={`${calendarStyles.legendColor} ${calendarStyles.legendColorDocExam}`} />
                        <span>필기시험</span>
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <div className={`${calendarStyles.legendColor} ${calendarStyles.legendColorDocPass}`} />
                        <span>필기합격</span>
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <div className={`${calendarStyles.legendColor} ${calendarStyles.legendColorPracReg}`} />
                        <span>실기접수</span>
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <div className={`${calendarStyles.legendColor} ${calendarStyles.legendColorPracExam}`} />
                        <span>실기시험</span>
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <div className={`${calendarStyles.legendColor} ${calendarStyles.legendColorPracPass}`} />
                        <span>실기합격</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
