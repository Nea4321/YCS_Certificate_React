import {useState, useEffect, useRef, useLayoutEffect} from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { calendarStyles } from "@/widgets/calendar/";
import { allEvents, deptCertUrlMap, certUrlMap, type ExamEvent } from "@/features/calendar/examData2";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { flushSync } from "react-dom";

/** CalendarWidget에 전달되는 props
 *
 * @property {string} certificateName - 학과와 관련없는, 단일 자격증에 접근하기 위한 자격증 이름
 * @property {number} dept_map_id - 학과 관련 자격증을 구분하기 위한 학과 매핑 id
 */
interface CalendarProps {
    certificateName?: string;
    dept_map_id?: number;
}

/** 자격증 캘린더 컴포넌트
 * - 사용자가 선택한 학과에 관련된 자격증의 여러 일정 정보가 담긴 캘린더 UI를 배치
 * - 필기접수, 필기시험, 필기합격, 실기접수, 실기시험, 실기합격 6개의 일정이 존재한다
 * - 학과 기준 또는 단일 자격증 기준으로 이벤트를 필터링하여 달력에 표시한다
 * - 캘린더를 접고 펼 수 있는 기능을 제공한다
 *
 * @component
 */
export function CalendarWidget({ certificateName, dept_map_id }: CalendarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);

    const getDepartmentCertificates = (): string[] => {
        if (dept_map_id !== undefined && deptCertUrlMap[dept_map_id]) {
            return deptCertUrlMap[dept_map_id];
        }
        return [];
    };

    const departmentCertificates = getDepartmentCertificates();

    const measuredRef = useRef<{monthKey: string; rowTop: number} | null>(null);
    const [viewReady, setViewReady] = useState(false);

    const sameMonth = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();


    useEffect(() => {
        // mount 직후 한 틱 미뤄서 viewReady 플래그 ON
        // (react-calendar 내부 마크업이 그려진 다음을 보장)
        const id = requestAnimationFrame(() => setViewReady(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const [visibleMonth, setVisibleMonth] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );

    const calRef = useRef<HTMLDivElement>(null);

    const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

    useLayoutEffect(() => {
        if (!viewReady) return;

        const root = calRef.current;
        if (!root) return;

        const days = root.querySelector('.react-calendar__month-view__days') as HTMLElement | null;
        if (!days) return;

        const tiles = Array.from(days.querySelectorAll('.react-calendar__tile')) as HTMLElement[];
        if (!tiles.length) return;

        // activeStartDate가 반영된 달(visibleMonth)이 완전히 그려진 뒤 측정
        const raf = requestAnimationFrame(() => {
            const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
            const sameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

            const today = new Date();
            const baseDate = sameMonth(today, monthStart)
                ? today
                : (sameMonth(currentDate, monthStart) ? currentDate : monthStart);

            const isNeighbor = (el: Element) =>
                el.classList.contains('react-calendar__month-view__days__day--neighboringMonth');

            let targetTile: HTMLElement | null = null;
            for (const tile of tiles) {
                if (isNeighbor(tile)) continue;
                const abbr = tile.querySelector('abbr');
                const dayNum = abbr?.textContent?.trim();
                if (dayNum && Number(dayNum) === baseDate.getDate()) {
                    targetTile = tile;
                    break;
                }
            }
            if (!targetTile) {
                targetTile = tiles.find(t => Number(t.querySelector('abbr')?.textContent?.trim() || -1) === baseDate.getDate()) || tiles[0];
            }

            const rowTop = targetTile.offsetTop - days.offsetTop;
            const rowHeight = targetTile.offsetHeight;
            const rowBottom = days.scrollHeight - (rowTop + rowHeight);

            const monthKey = `${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}`;
            const prev = measuredRef.current;
            if (prev && prev.monthKey === monthKey && prev.rowTop === rowTop && !isExpanded) return;
            measuredRef.current = { monthKey, rowTop };

            if (!isExpanded) {
                const clip = `inset(${Math.max(0, rowTop)}px 0 ${Math.max(0, rowBottom)}px)`;

                if (days.style.clipPath !== clip) {
                    days.style.clipPath = clip;
                    days.style.setProperty('-webkit-clip-path', clip);

                    days.style.transform = `translateY(-${rowTop}px)`;
                    days.style.willChange = 'clip-path, transform';
                    days.style.overflow = 'hidden';
                }
            } else {
                if (days.style.clipPath) {
                    days.style.clipPath = '';
                    days.style.removeProperty('-webkit-clip-path');

                    days.style.transform = '';
                    days.style.willChange = '';
                    days.style.overflow = '';
                }
            }
        });

        return () => cancelAnimationFrame(raf);
    }, [isExpanded, visibleMonth, currentDate, selectedCertificate, viewReady]);


    useEffect(() => {
        if (dept_map_id !== undefined && departmentCertificates.length > 0 && selectedCertificate === null) {
            setSelectedCertificate(departmentCertificates[0]);
        }
    }, [dept_map_id, departmentCertificates, selectedCertificate]);

    const log = (...args: unknown[]) =>
        console.log("%c[Calendar]", "color:#0ea5e9;font-weight:700;", ...args);

    useEffect(() => {
        if (!isExpanded) {
            const today = new Date();
            const monthKey = `${visibleMonth.getFullYear()}-${visibleMonth.getMonth()+1}`;

            console.groupCollapsed(
                "%c[Calendar] collapse → maybe snap to today",
                "color:#6b7280;font-weight:600;"
            );
            log("isExpanded:", isExpanded);
            log("visibleMonth:", monthKey, "currentDate:", currentDate.toDateString());
            log("today:", today.toDateString());

            if (!sameMonth(visibleMonth, today)) {
                log("➡️ snapping to today");
                setCurrentDate(today);
                setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
            } else {
                log("⏭️ already on today's month — no snap");
            }
            console.groupEnd();
        }
    }, [isExpanded, visibleMonth, currentDate]);

    /** 사용자가 클릭한 캘린더 타일 날짜를 'YYYY-MM-DD' 형식으로 변환하여 반환하는 함수
     *
     * @param {Date} date - 변환할 Date 객체
     * @returns 'YYYY-MM-DD'
     */
    const formatDate = (date: Date): string => {
        const y = date.getFullYear();
        const m = ("0" + (date.getMonth() + 1)).slice(-2);
        const d = ("0" + date.getDate()).slice(-2);
        return `${y}-${m}-${d}`;
    };

    /** Date 객체(사용자가 선택한 타일 날짜)가 일정 시작 일자와 종료 일자에 포함되는 날짜인지 확인하는 함수
     *
     * @returns 날짜가 범위 내에 있다면 true, 범위 내에 없다면 false
     */
    const isDateInRange = (date: Date, start: string, end: string): boolean => {
        const target = formatDate(date);
        return start <= target && target <= end;
    };

    /** 표시할 자격증 이벤트를 필터링해서 반환한다
     *
     * - dept_map_id가 존재하는 경우: deptCertUrlMap에서 해당 학과에 매핑된 자격증을 가져와 일치하는 이벤트만을 반환한다
     * - certificateName이 존재하는 경우: 해당 certificateName과 일치하는 이벤트만을 반환
     * - 조건에 맞지 않는다면 빈 배열 반환
     *
     * @returns 필터링된 자격증 이벤트 배열
     */
    const getFilteredEvents = () => {
        if (dept_map_id !== undefined && deptCertUrlMap[dept_map_id]) {
            if (selectedCertificate) {
                return allEvents.filter((ev) => ev.certificate === selectedCertificate);
            }
            return [];
        }
        if (certificateName) {
            const directMatch = allEvents.filter((ev) => ev.certificate === certificateName);
            if (directMatch.length > 0) {
                return directMatch;
            }
            const certId = Number(certificateName);
            if (!isNaN(certId) && certUrlMap[certId]) {
                const certNameFromMap = certUrlMap[certId];
                return allEvents.filter((ev) => ev.certificate === certNameFromMap);
            }
        }
        return [];
    };

    /** 특정 날짜에 해당하는 자격증 시험 일정을 반환한다
     *
     * @param {Date} date - 검사할 Date 객체
     * @returns 해당 날짜에 포함된 ExamEvent 배열 내용
     */
    const getEventsForDate = (date: Date) =>
        getFilteredEvents().filter((ev) => isDateInRange(date, ev.startdate, ev.enddate));

    // 이벤트 달력 시작/끝 위치 체크
    const getExtendedDatePosition = (date: Date, event: ExamEvent) => {
        const dateStr = formatDate(date);
        const { startdate, enddate } = event;
        const currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const firstDayOfMonth = formatDate(currentMonth);
        const lastDayOfMonth = formatDate(nextMonth);
        const isStart = dateStr === startdate;
        const isEnd = dateStr === enddate;
        const isSingle = isStart && isEnd;
        const eventStartsBeforeMonth = startdate < firstDayOfMonth;
        const eventEndsAfterMonth = enddate > lastDayOfMonth;
        if (isSingle) return "single";
        if (isStart && !eventEndsAfterMonth) return "start";
        if (isEnd && !eventStartsBeforeMonth) return "end";
        if (isStart && eventEndsAfterMonth) return "start-continues";
        if (isEnd && eventStartsBeforeMonth) return "continues-end";
        if (eventStartsBeforeMonth && eventEndsAfterMonth) return "continues-through";
        if (eventStartsBeforeMonth && !isEnd) return "continues-middle";
        if (eventEndsAfterMonth && !isStart) return "middle-continues";
        return "middle";
    };

    // 타일 클래스 이름 적용
    const tileClassName = ({ date, view }: { date: Date; view: string }) => {
        if (view === "month") {
            const events = getEventsForDate(date);
            if (events.length > 0) {
                const classes: string[] = [];
                events.forEach((event) => {
                    const position = getExtendedDatePosition(date, event);
                    classes.push(`calendar-tile-${event.type} calendar-tile-${event.type}--${position}`);
                    if (position.startsWith("start")) {
                        classes.push(`calendar-tile--round-left-${event.type}`);
                    }
                    if (position.endsWith("end")) {
                        classes.push(`calendar-tile--round-right-${event.type}`);
                    }
                });
                return classes.join(" ");
            }
        }
        return null;
    };

    /** 캘린더에 일정을 표시하는 함수
     *
     * - 사용자가 선택한 타일에 존재하는 모든 이벤트(일정)를 가져온다
     * - 이벤트가 존재하지 않는다면 null을 반환하고 아무것도 표시하지 않는다
     * - 이벤트가 존재한다면 최대 2개의 이벤트를 표시한다
     *
     * @param {object} param - 날짜와 뷰 정보를 담은 객체
     * @param {Date} param.date - 타일 날짜
     * @param {string} param.view - 달력의 뷰 타입 ('month')
     * @returns 해당 날짜에 일정이 존재한다면 이벤트 컴포넌트
     */
    const tileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === "month") {
            const events = getEventsForDate(date);
            if (events.length > 0) {
                const dateStr = formatDate(date);
                const startingEvents = events.filter((event) => event.startdate === dateStr);
                if (startingEvents.length > 0) {
                    const uniqueCertificates = [...new Set(startingEvents.map((event) => event.certificate))];
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
                    );
                }
            }
        }
        return null;
    };

    // 달력 상단 열/월 표시
    const navigationLabel = ({ date, view }: { date: Date; view: string }) => {
        if (view === "month") {
            return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
        }
        return null;
    };

    const isDepartmentView = dept_map_id !== undefined && departmentCertificates.length > 0;

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

            <div ref={calRef} className={`${calendarStyles.calendarWrapper} ${!isExpanded ? calendarStyles.collapsed : ''}`}>
                <Calendar
                    value={currentDate}
                    onChange={(value) => setCurrentDate(value as Date)}
                    tileClassName={tileClassName}
                    tileContent={tileContent}
                    locale="ko-KR"
                    formatDay={(_locale, date) => date.getDate().toString()}
                    activeStartDate={visibleMonth} // ★ 우리가 보여줄 달을 직접 고정
                    onActiveStartDateChange={({ activeStartDate }) => {
                        if (activeStartDate) {
                            const next = startOfMonth(activeStartDate);
                            console.groupCollapsed("%c[Calendar] onActiveStartDateChange", "color:#6b7280;font-weight:600;");
                            console.log("%c[Calendar]", "color:#0ea5e9;font-weight:700;", "→", next.toDateString());
                            console.groupEnd();
                            setVisibleMonth(next);
                        }
                    }}
                    showNeighboringMonth={true}
                    showNavigation={isExpanded}
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
            <div className={calendarStyles.expandIconWrapper}>
                <button
                    className={calendarStyles.expandIconButton}
                    onClick={() => {
                        setIsExpanded(prev => {
                            const next = !prev;
                            // next === false → "접기"로 바뀌는 순간
                            if (!next) {
                                const today = new Date();

                                    // 먼저 오늘로 이동을 "동기"로 반영
                                    flushSync(() => {
                                        setCurrentDate(today);                    // value도 오늘
                                        setVisibleMonth(startOfMonth(today));     // 보여줄 달도 오늘
                                    });

                            }
                            return next;
                        });
                    }}
                >
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>
            </div>
        </div>
    );
}