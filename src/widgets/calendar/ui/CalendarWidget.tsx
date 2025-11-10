// widgets/calendar/ui/CalendarWidget.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import type { UiEvent } from "@/features/calendar/model/adapters";
import * as dateUtils from "@/shared/lib/date";
import { Calendar } from "@/shared/ui/calendar/ui/Calendar";
import { CalendarLegend } from "@/shared/ui/calendar/ui/CalendarLegend";
import { getTileClassName, getTileContent as getBaseTileContent, getTileBandsContent } from "@/features/calendar/ui/tile";
import { useCalendarAnimation } from "@/features/calendar/model/useCalendarAnimation";
import { CalendarToggleButton } from "@/features/calendar/ui/CalendarToggleButton";
import { calendarStyles } from "@/widgets/calendar/";
import { useCollapseToMonth } from "@/features/calendar";
import { CalView } from "@/features/calendar/model/useCollapseToMonth";
import { EventPopover } from "@/features/calendar/ui/EventPopover";
import { useCalendarPopover } from "@/features/calendar/model/useCalendarPopover";

interface CalendarWidgetProps {
    events?: UiEvent[];
    loading?: boolean;
    certName?: string;
    dept_map_id?: number;
    isUserPanel?: boolean;
}

export function CalendarWidget({ events = [], loading, certName,isUserPanel }: CalendarWidgetProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [visibleMonth, setVisibleMonth] = useState(dateUtils.startOfMonth(new Date()));
    const [viewReady, setViewReady] = useState(false);
    const [view, setView] = useState<CalView>("month");
    const calRef = useRef<HTMLDivElement>(null);
    const bandBg = getTileBandsContent(events);
    const { open, selectedDate, selectedEvents, openFor, close } = useCalendarPopover(events);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleViewChange = useCallback(({ view }: { view: CalView }) => {
        if (isExpanded) setView(view);
    }, [isExpanded]);

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

    useCollapseToMonth({
        isExpanded,
        view,
        setView,
        value: currentDate,
        setVisibleMonth,
        startOfMonth: dateUtils.startOfMonth,
        restorePrevOnExpand: false,
    });

    useCalendarAnimation({ calRef, isExpanded, viewReady });

    const tileClassName = getTileClassName(events);

    const baseTileContent = getBaseTileContent(events, certName);

    const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
    const monthEvents = events.filter(
        (e) => e.startdate.slice(0, 7) <= monthKey && monthKey <= e.enddate.slice(0, 7)
    );

    const tileContent = ({ date, view }: { date: Date; view: string }) => (
        <>
            {bandBg({ date, view })}
            {baseTileContent({ date, view })}
        </>
    );

    const goToToday = useCallback(() => {
        const now = new Date();
        setCurrentDate(now);
        setVisibleMonth(dateUtils.startOfMonth(now));
        setView("month");
    }, []);

    if (loading) return <div className={calendarStyles.loading}>일정을 불러오는 중...</div>;

    const today = new Date();
    return (
        <div className={`${calendarStyles.calendarWidget} ${isUserPanel ? calendarStyles.userPanel : ""}`}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
                {certName ? `자격증: ${certName}` : "자격증"} · {currentDate.getMonth() + 1}월의 이벤트: {monthEvents.length}건
            </div>

            <button style={{ fontSize: 24, marginBottom: 8, cursor: "pointer", background: "none", border: "none"}} onClick={goToToday}>
                {today.getFullYear()}년 {today.getMonth() + 1}월 {today.getDate()}일
            </button>

            <div
                ref={calRef}
                className={`${calendarStyles.calendarWrapper} ${!isExpanded ? calendarStyles.collapsed : ""}`}
            >
                <Calendar
                    value={currentDate ?? undefined}
                    onChange={(v) => setCurrentDate(v as Date)}
                    activeStartDate={visibleMonth}
                    onActiveStartDateChange={({ activeStartDate }) => {
                        if (activeStartDate) setVisibleMonth(dateUtils.startOfMonth(activeStartDate));
                    }}
                    view={view}
                    onViewChange={handleViewChange}
                    isExpanded={isExpanded}
                    tileClassName={tileClassName}
                    tileContent={tileContent}
                    onClickDay={(date, e) => {
                        const tile = e?.currentTarget as HTMLElement | null;  // 타일 <button>
                        openFor(date);
                        setAnchorEl(tile);
                    }}
                />
            </div>

            <CalendarLegend />

            <CalendarToggleButton
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                setCurrentDate={setCurrentDate}
                setVisibleMonth={setVisibleMonth}
            />

            <EventPopover
                open={open}
                onClose={close}
                anchorEl={anchorEl}
                containerEl={calRef.current}
                dateText={selectedDate ? dateUtils.formatDate(selectedDate) : ""}
                items={selectedEvents}
            />
        </div>
    );
}
