// widgets/calendar/ui/CalendarWidget.tsx
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { calendarStyles } from '@/widgets/calendar';
import type { UiEvent } from '@/features/calendar/adapters';

interface CalendarProps {
    events?: UiEvent[];
    loading?: boolean;
    certName?: string;
    dept_map_id?: number
}


export function CalendarWidget({ events, loading, certName }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    if (loading) {
        return <div className={calendarStyles.loading}>일정을 불러오는 중...</div>;
    }

    // ✅ 월 키 & 월별 이벤트 수 (디버깅에 사용)
    const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const monthEvents: UiEvent[] = (events ?? []).filter(e =>
        e.startdate.slice(0, 7) <= monthKey && monthKey <= e.enddate.slice(0, 7)
    );

    // ───── 날짜/필터 유틸 ─────
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

    // ───── 클래스/타일 콘텐츠 ─────
    const getExtendedDatePosition = (date: Date, event: UiEvent) => {
        const dateStr = formatDate(date);
        const { startdate, enddate } = event;

        const currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const firstDayOfMonth = formatDate(currentMonth);
        const lastDayOfMonth  = formatDate(nextMonth);

        const isStart = dateStr === startdate;
        const isEnd   = dateStr === enddate;
        const isSingle = isStart && isEnd;

        const eventStartsBeforeMonth = startdate < firstDayOfMonth;
        const eventEndsAfterMonth    = enddate   > lastDayOfMonth;

        if (isSingle) return 'single';
        if (isStart && !eventEndsAfterMonth) return 'start';
        if (isEnd   && !eventStartsBeforeMonth) return 'end';
        if (isStart && eventEndsAfterMonth) return 'start-continues';
        if (isEnd   && eventStartsBeforeMonth) return 'continues-end';
        if (eventStartsBeforeMonth && eventEndsAfterMonth) return 'continues-through';
        if (eventStartsBeforeMonth && !isEnd) return 'continues-middle';
        if (eventEndsAfterMonth && !isStart) return 'middle-continues';
        return 'middle';
    };

    const tileClassName = ({ date, view }: { date: Date; view: string }) => {
        if (view !== 'month') return null;
        const dayEvents = getEventsForDate(date);
        if (dayEvents.length === 0) return null;

        const classes: string[] = [];
        dayEvents.forEach(ev => {
            const pos = getExtendedDatePosition(date, ev);
            classes.push(`calendar-tile-${ev.type} calendar-tile-${ev.type}--${pos}`);
            if (pos.startsWith('start')) classes.push(`calendar-tile--round-left-${ev.type}`);
            if (pos.endsWith('end'))    classes.push(`calendar-tile--round-right-${ev.type}`);
        });
        return classes.join(' ');
    };

    const tileContent = ({ date, view }: { date: Date; view: string }) => {
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

    const navigationLabel = ({ date, view }: { date: Date; view: string }) =>
        view === 'month' ? `${date.getFullYear()}년 ${date.getMonth() + 1}월` : null;

    // ✅ 디버깅 콘솔
    console.groupCollapsed('[CAL] view', monthKey);
    console.log('certName:', certName);
    console.log('events(total):', events?.length ?? 0);
    console.log('events(this month):', monthEvents.length);
    console.table(monthEvents.slice(0, 10));
    console.groupEnd();

    return (
        <div className={calendarStyles.calendarWidget}>
            {/* 미니 디버그 라벨 */}
            <div style={{fontSize:12, color:'#6b7280', marginBottom:8}}>
                {certName ? `자격증: ${certName}` : '자격증'} · 이 달의 이벤트: {monthEvents.length}건
            </div>

            <div className={calendarStyles.calendarSection}>
                <Calendar
                    value={currentDate}
                    onChange={v => setCurrentDate(v as Date)}
                    tileClassName={tileClassName}
                    tileContent={tileContent}
                    locale="ko-KR"
                    formatDay={(_loc, d) => d.getDate().toString()}
                    showNeighboringMonth
                    next2Label={null}
                    prev2Label={null}
                    nextLabel="다음 >"
                    prevLabel="< 이전"
                    navigationLabel={navigationLabel}
                />
            </div>

            {/* ✅ 범례 (필요 없으면 삭제해도 됨) */}
            <section className={calendarStyles.legendSection}>
                <h3 className={calendarStyles.legendTitle}>일정 구분</h3>
                <div className={calendarStyles.legendGrid}>
                    <div className={calendarStyles.legendItem}>
                        <span className={`${calendarStyles.legendColor} ${calendarStyles.legendColorDocReg}`} />
                        필기접수
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <span className={`${calendarStyles.legendColor} ${calendarStyles.legendColorDocExam}`} />
                        필기시험
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <span className={`${calendarStyles.legendColor} ${calendarStyles.legendColorDocPass}`} />
                        필기합격
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <span className={`${calendarStyles.legendColor} ${calendarStyles.legendColorPracReg}`} />
                        실기접수
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <span className={`${calendarStyles.legendColor} ${calendarStyles.legendColorPracExam}`} />
                        실기시험
                    </div>
                    <div className={calendarStyles.legendItem}>
                        <span className={`${calendarStyles.legendColor} ${calendarStyles.legendColorPracPass}`} />
                        실기합격
                    </div>
                </div>
            </section>
        </div>
    );
}
