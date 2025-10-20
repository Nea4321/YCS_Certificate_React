import type { UiEvent } from '@/features/calendar/model/adapters';
import * as dateUtils from '@/shared/lib/date';
import { calendarStyles } from "@/widgets/calendar";
import {JSX} from "react";

const COLOR_MAP: Record<UiEvent["type"], string> = {
    "doc-reg":  "rgba(122,162,247,.35)", // 필기접수
    "doc-exam": "rgba(253,186,116,.35)", // 필기시험
    "doc-pass": "rgba(110,231,183,.35)", // 필기합격
    "prac-reg": "rgba(196,181,253,.35)", // 실기접수
    "prac-exam":"rgba(248,113,113,.43)", // 실기시험
    "prac-pass":"rgba(134,239,172,.35)", // 실기합격
};

export const getTileBandsContent =
    (allEvents: UiEvent[]) =>
        ({ date, view }: { date: Date; view: string }) => {

            if (view !== "month") return null;
            const events = getEventsForDate(date, allEvents);
            if (events.length === 0) return null;

            const types = Array.from(new Set(events.map(e => e.type)));
            if (types.length < 2) return null;
            const colors = types.map(t => COLOR_MAP[t]);

            let background: string;
            if (colors.length === 1) {
                background = colors[0];
            } else {
                const step = 100 / colors.length;
                const stops = colors
                    .map((c, i) => `${c} ${Math.floor(i * step)}% ${Math.ceil((i + 1) * step)}%`)
                    .join(", ");
                background = `linear-gradient(180deg, ${stops})`;
            }

            return <div className={calendarStyles.tileBandBg} style={{ background }} aria-hidden />;
        };

const isDateInRange = (date: Date, start: string, end: string): boolean => {
    const target = dateUtils.formatDate(date);
    return start <= target && target <= end;
};

const getEventsForDate = (date: Date, allEvents: UiEvent[]): UiEvent[] => {
    return (allEvents ?? []).filter(ev => isDateInRange(date, ev.startdate, ev.enddate));
};

export const getTileClassName = (allEvents: UiEvent[]) =>
    ({ date, view }: { date: Date; view: string }): string | null => {
        if (view !== 'month') return null;
        const dayEvents = getEventsForDate(date, allEvents);
        if (dayEvents.length === 0) return null;

        const classes: string[] = [];
        const uniqTypes = Array.from(new Set(dayEvents.map(e => e.type)));
        if (uniqTypes.length > 1) classes.push('calendar-tile--banded'); // ← 추가!

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