import type { UiEvent } from '@/features/calendar/model/adapters';
import * as dateUtils from '@/shared/lib/date';
import { calendarStyles } from "@/widgets/calendar";
import {JSX} from "react";

const isDateInRange = (date: Date, start: string, end: string): boolean => {
    const target = dateUtils.formatDate(date);
    return start <= target && target <= end;
};

const getEventsForDate = (date: Date, allEvents: UiEvent[]): UiEvent[] => {
    return (allEvents ?? []).filter(ev => isDateInRange(date, ev.startdate, ev.enddate));
};

export const getTileClassName = (allEvents: UiEvent[]) => ({ date, view }: { date: Date; view: string }): string | null => {
    if (view !== 'month') return null;
    const dayEvents = getEventsForDate(date, allEvents);
    if (dayEvents.length === 0) return null;

    const classes: string[] = [];
    dayEvents.forEach(ev => {
        classes.push(`calendar-tile-${ev.type}`);
        const prevIn = isDateInRange(dateUtils.addDays(date, -1), ev.startdate, ev.enddate);
        const nextIn = isDateInRange(dateUtils.addDays(date, +1), ev.startdate, ev.enddate);
        if (!prevIn) classes.push(`calendar-tile--round-left-${ev.type}`);
        if (!nextIn) classes.push(`calendar-tile--round-right-${ev.type}`);
    });
    return classes.join(' ');
};

export const getTileContent = (allEvents: UiEvent[], certName?: string) => ({ date, view }: { date: Date; view: string }): JSX.Element | null => {
    if (view !== 'month') return null;
    const dayEvents = getEventsForDate(date, allEvents);
    if (dayEvents.length === 0) return null;

    const dateStr = dateUtils.formatDate(date);
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