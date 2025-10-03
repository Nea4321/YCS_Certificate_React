import {useState, useEffect, useRef, useLayoutEffect} from "react";
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { calendarStyles } from "@/widgets/calendar/"
import type { UiEvent } from '@/features/calendar/adapters';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { flushSync } from "react-dom";

/**CalendarWidget에 전달되는 props
 *
 * @property {string} certName - 학과와 관련없는, 단일 자격증에 접근하기 위한 자격증 이름
 * @property {number} dept_map_id - 학과 관련 자격증을 구분하기 위한 학과 매핑 id
 */
interface CalendarProps {
    events?: UiEvent[];
    loading?: boolean;
    certName?: string;
    dept_map_id?: number
}

/** 자격증 캘린더 컴포넌트
 * - 사용자가 선택한 학과에 관련된 자격증의 여러 일정 정보가 담긴 캘린더 UI를 배치
 * - 필기접수, 필기시험, 필기합격, 실기접수, 실기시험, 실기합격 6개의 일정이 존재한다
 * - 학과 기준 또는 단일 자격증 기준으로 이벤트를 필터링하여 달력에 표시한다
 * - 캘린더를 접고 펼 수 있는 기능을 제공한다
 *
 * @component
 */

export function CalendarWidget({ events, loading, certName }: CalendarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [viewReady, setViewReady] = useState(false);
    const sameMonth = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
    const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

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

    useEffect(() => {
        if (!isExpanded) {
            const today = new Date();
            if (!sameMonth(visibleMonth, today)) {
                setCurrentDate(today);
                setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
            }
            console.groupEnd();
        }
    }, [isExpanded, visibleMonth, currentDate]);

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
            const isNeighbor = (el: Element) =>
                el.classList.contains('react-calendar__month-view__days__day--neighboringMonth');

            const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
            const sameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
            const today = new Date();
            const baseDate = sameMonth(today, monthStart)
                ? today
                : (sameMonth(currentDate, monthStart) ? currentDate : monthStart);

// (1) 기준 타일 찾기
            let targetTile: HTMLElement | null = null;
            for (const t of tiles) {
                if (isNeighbor(t)) continue;
                const abbr = t.querySelector('abbr');
                const dayNum = abbr?.textContent?.trim();
                if (dayNum && Number(dayNum) === baseDate.getDate()) {
                    targetTile = t;
                    break;
                }
            }
            if (!targetTile) targetTile = tiles.find(t => !isNeighbor(t)) ?? tiles[0];

// (2) 행 인덱스/행 높이/총 행수 계산 (transform과 무관)
            const tileIndex = tiles.indexOf(targetTile);
            const rowIdx = Math.max(0, Math.floor(tileIndex / 7));

// 이 높이는 한 번만 읽으면 됨 (행 전체가 같은 높이)
            const sampleTile = tiles.find(t => !isNeighbor(t)) ?? tiles[0];
            const rowHeight = Math.round(sampleTile.getBoundingClientRect().height);

// 일부 달은 5주/6주가 다르므로 실제 행 수 계산
            const totalRows = Math.ceil(tiles.length / 7);

// (3) 고정 수식으로 rowTop/rowBottom 결정
            const rowTop = rowIdx * rowHeight;
            const rowBottom = totalRows * rowHeight - (rowTop + rowHeight);

// (4) 스타일 적용
            if (!isExpanded) {
                const clip = `inset(${rowTop}px 0 ${Math.max(0, rowBottom)}px)`;

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
    }, [isExpanded, visibleMonth, currentDate, viewReady]);


    if (loading) {
        return <div className={calendarStyles.loading}>일정을 불러오는 중...</div>;
    }

    // ✅ 월 키 & 월별 이벤트 수 (디버깅에 사용)
    const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const monthEvents: UiEvent[] = (events ?? []).filter(e =>
        e.startdate.slice(0, 7) <= monthKey && monthKey <= e.enddate.slice(0, 7)
    );

    // ───── 날짜/필터 유틸 ─────
    /** 사용자가 클릭한 캘린더 타일 날짜를 'YYYY-MM-DD' 형식으로 변환하여 반환하는 함수
     *
     * @param {Date} date - 변환할 Date 객체
     * @returns 'YYYY-MM-DD'
     */
    const formatDate = (date: Date): string => {
        const y = date.getFullYear();
        const m = ('0' + (date.getMonth() + 1)).slice(-2);
        const d = ('0' + date.getDate()).slice(-2);
        return `${y}-${m}-${d}`;
    };

    const isDateInRange = (date: Date, start: string, end: string): boolean => {
        const target = formatDate(date);
        return start <= target && target <= end;
    };

    const getEventsForDate = (date: Date): UiEvent[] =>
        (events ?? []).filter(ev => isDateInRange(date, ev.startdate, ev.enddate));



    /** 특정 날짜에 해당하는 자격증 시험 일정을 반환한다
     *
     * @param {Date} date - 검사할 Date 객체
     * @returns 해당 날짜에 포함된 ExamEvent 배열 내용
     */
        // 타일 클래스 이름 적용
    const tileClassName = ({ date, view }: { date: Date; view: string }) => {
            if (view !== 'month') return null;
            const dayEvents = getEventsForDate(date);
            if (dayEvents.length === 0) return null;

            const classes: string[] = [];
            dayEvents.forEach(ev => {
                classes.push(`calendar-tile-${ev.type}`);

                const prevIn = isDateInRange(addDays(date, -1), ev.startdate, ev.enddate);
                const nextIn = isDateInRange(addDays(date, +1), ev.startdate, ev.enddate);

                if (!prevIn) classes.push(`calendar-tile--round-left-${ev.type}`);
                if (!nextIn) classes.push(`calendar-tile--round-right-${ev.type}`);
            });
            return classes.join(' ');
        };

    const tileContent = ({date, view}: { date: Date; view: string }) => {
        if (view !== 'month') return null;
        const dayEvents = getEventsForDate(date);
        if (dayEvents.length === 0) return null;

        const dateStr = formatDate(date);
        const starting = dayEvents.filter(e => e.startdate === dateStr);
        if (starting.length === 0) return null;

        const uniqueCerts = [...new Set(starting
            .map(e => (e.certificate && e.certificate.trim()) || certName || '')
            .filter(Boolean))];
        if (uniqueCerts.length === 0) return null;

        return (
            <div className={calendarStyles.tileContent}>
                <div className={calendarStyles.certificateList}>
                    {uniqueCerts.slice(0, 2).map((c, i) => (
                        <div key={i} className={calendarStyles.certificateName}>{c}</div>
                    ))}
                </div>
                {uniqueCerts.length > 2 && (
                    <div className={calendarStyles.moreEvents}>+{uniqueCerts.length - 2}</div>
                )}
            </div>
        );
    };

    const navigationLabel = ({date, view}: { date: Date; view: string }) =>
        view === 'month' ? `${date.getFullYear()}년 ${date.getMonth() + 1}월` : null;

    return (
        <div className={calendarStyles.calendarWidget}>
            {/* 미니 디버그 라벨 */}
            <div style={{fontSize: 12, color: '#6b7280', marginBottom: 8}}>
                {certName ? `자격증: ${certName}` : '자격증'} · 이 달의 이벤트: {monthEvents.length}건
            </div>

            <div ref={calRef}
                 className={`${calendarStyles.calendarWrapper} ${!isExpanded ? calendarStyles.collapsed : ''}`}>
                <Calendar
                    value={currentDate}
                    onChange={v => setCurrentDate(v as Date)}
                    tileClassName={tileClassName}
                    tileContent={tileContent}
                    locale="ko-KR"
                    activeStartDate={visibleMonth}
                    onActiveStartDateChange={({activeStartDate}) => {
                        if (activeStartDate) {
                            const next = startOfMonth(activeStartDate);
                            setVisibleMonth(next);
                        }
                    }}
                    showNavigation={isExpanded}
                    formatDay={(_loc, d) => d.getDate().toString()}
                    showNeighboringMonth
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
                        <span className={`${calendarStyles.legendColor} ${calendarStyles.legendColorDocReg}`}/>
                        필기접수
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <span className={`${calendarStyles.legendColor} ${calendarStyles.legendColorDocExam}`}/>
                        필기시험
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <span className={`${calendarStyles.legendColor} ${calendarStyles.legendColorDocPass}`}/>
                        필기합격
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <span className={`${calendarStyles.legendColor} ${calendarStyles.legendColorPracReg}`}/>
                        실기접수
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <span className={`${calendarStyles.legendColor} ${calendarStyles.legendColorPracExam}`}/>
                        실기시험
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <div className={`${calendarStyles.legendColor} ${calendarStyles.legendColorPracPass}`}/>
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
                    {isExpanded ? <ChevronUp size={24}/> : <ChevronDown size={24}/>}
                </button>
            </div>
        </div>
    );
}
