// features/calendar/model/useCollapseToMonth.ts
import { useEffect, useRef } from "react";

export type CalView = "month" | "year" | "decade" | "century";

export function useCollapseToMonth(opts: {
    isExpanded: boolean;
    view: CalView;
    setView: (v: CalView) => void;
    value: Date | null;
    setVisibleMonth: (d: Date) => void;
    startOfMonth: (d: Date) => Date;
    restorePrevOnExpand?: boolean;
}) {
    const {
        isExpanded,
        view,
        setView,
        value,
        setVisibleMonth,
        startOfMonth,
        restorePrevOnExpand = false,
    } = opts;
    const prevViewRef = useRef<CalView>("month");
    const lastAnchorRef = useRef<Date | null>(null);

    useEffect(() => {
        if (!isExpanded) {
            if (view !== "month") prevViewRef.current = view;

            const anchor = value ?? new Date();
            lastAnchorRef.current = anchor;
            if (view !== "month") setView("month");
            setVisibleMonth(startOfMonth(anchor));
        } else {
            if (restorePrevOnExpand) {
                setView(prevViewRef.current);
            } else {
                setView("month");
                const anchor = lastAnchorRef.current ?? new Date();
                setVisibleMonth(startOfMonth(anchor));
            }
        }
    }, [isExpanded]);
}
