import { useState, useEffect, useRef } from "react";
import type { UiEvent } from '@/features/calendar/model/adapters';
import * as dateUtils from '@/shared/lib/date';
import { Calendar } from '@/shared/ui/calendar/ui/Calendar';
import { CalendarLegend } from '@/shared/ui/calendar/ui/CalendarLegend';
import { getTileClassName, getTileContent } from '@/features/calendar/ui/tile';
import { useCalendarAnimation } from '@/features/calendar/model/useCalendarAnimation';
import { CalendarToggleButton } from '@/features/calendar/ui/CalendarToggleButton';
import { calendarStyles } from "@/widgets/calendar/";

interface CalendarWidgetProps {
    events?: UiEvent[];
    loading?: boolean;
    certName?: string;
}

export function CalendarWidget({ events = [], loading, certName }: CalendarWidgetProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [visibleMonth, setVisibleMonth] = useState(dateUtils.startOfMonth(new Date()));
    const [viewReady, setViewReady] = useState(false);
    const calRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const id = requestAnimationFrame(() => setViewReady(true));
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        if (!isExpanded) {
            const today = new Date();
            if (!dateUtils.sameMonth(visibleMonth, today)) {
                setCurrentDate(today);
                setVisibleMonth(dateUtils.startOfMonth(today));
            }
        }
    }, [isExpanded, visibleMonth]);

    useCalendarAnimation({ calRef, isExpanded, visibleMonth, currentDate, viewReady });

    const tileClassName = getTileClassName(events);
    const tileContent = getTileContent(events, certName);

    const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const monthEvents: UiEvent[] = events.filter(e =>
        e.startdate.slice(0, 7) <= monthKey && monthKey <= e.enddate.slice(0, 7)
    );

    if (loading) {
        return <div className={calendarStyles.loading}>일정을 불러오는 중...</div>;
    }

    return (
        <div className={calendarStyles.calendarWidget}>
            <div style={{fontSize: 12, color: '#6b7280', marginBottom: 8}}>
                {certName ? `자격증: ${certName}` : '자격증'} · 이 달의 이벤트: {monthEvents.length}건
            </div>

            <div ref={calRef} className={`${calendarStyles.calendarWrapper} ${!isExpanded ? calendarStyles.collapsed : ''}`}>
                <Calendar
                    value={currentDate}
                    onChange={v => setCurrentDate(v as Date)}
                    activeStartDate={visibleMonth}
                    onActiveStartDateChange={({ activeStartDate }) => {
                        if (activeStartDate) setVisibleMonth(dateUtils.startOfMonth(activeStartDate));
                    }}
                    isExpanded={isExpanded}
                    tileClassName={tileClassName}
                    tileContent={tileContent}
                />
            </div>

            <CalendarLegend />

            <CalendarToggleButton
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                setCurrentDate={setCurrentDate}
                setVisibleMonth={setVisibleMonth}
            />
        </div>
    );
}