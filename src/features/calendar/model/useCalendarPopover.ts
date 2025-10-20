import { useCallback, useState } from "react";
import type { UiEvent } from "@/features/calendar/model/adapters";
import * as dateUtils from "@/shared/lib/date";

const isDateInRange = (date: Date, start: string, end: string) => {
    const target = dateUtils.formatDate(date); // YYYY-MM-DD
    return start <= target && target <= end;
};
const getEventsForDate = (date: Date, all: UiEvent[] = []) =>
    all.filter(ev => isDateInRange(date, ev.startdate, ev.enddate));

export function useCalendarPopover(events: UiEvent[] = []) {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedEvents, setSelectedEvents] = useState<UiEvent[]>([]);

    const openFor = useCallback((date: Date) => {
        const list = getEventsForDate(date, events);
        setSelectedDate(date);
        setSelectedEvents(list);
        setOpen(list.length > 0);
    }, [events]);

    const close = useCallback(() => setOpen(false), []);

    return { open, selectedDate, selectedEvents, openFor, close };
}
