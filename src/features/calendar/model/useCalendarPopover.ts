import { useCallback, useState } from "react";
import type { UiEvent } from "@/features/calendar/model/adapters";
import * as dateUtils from "@/shared/lib/date";

export interface AnchorRect { top: number; left: number; width: number; height: number }

const isDateInRange = (date: Date, start: string, end: string) => {
    const target = dateUtils.formatDate(date);
    return start <= target && target <= end;
};
const getEventsForDate = (date: Date, all: UiEvent[] = []) =>
    all.filter(ev => isDateInRange(date, ev.startdate, ev.enddate));

export function useCalendarPopover(events: UiEvent[] = []) {
    const [open, setOpen] = useState(false);
    const [anchor, setAnchor] = useState<AnchorRect | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedEvents, setSelectedEvents] = useState<UiEvent[]>([]);

    const openFor = useCallback((date: Date, rect?: DOMRect) => {
        const list = getEventsForDate(date, events);
        setSelectedDate(date);
        setSelectedEvents(list);

        if (rect) {
            setAnchor({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
        } else {
            setAnchor({ top: window.innerHeight / 2, left: window.innerWidth / 2, width: 1, height: 1 });
        }
        setOpen(list.length > 0);
    }, [events]);

    const close = useCallback(() => setOpen(false), []);

    return {
        open, anchor, selectedDate, selectedEvents, openFor, close,
    };
}
