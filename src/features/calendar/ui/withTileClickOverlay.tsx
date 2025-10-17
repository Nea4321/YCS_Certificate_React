import * as dateUtils from "@/shared/lib/date";
import {JSX} from "react";

export function withTileClickOverlay(
    baseTileContent: ({ date, view }: { date: Date; view: string }) => JSX.Element | null,
    onDayClick: (date: Date, rect?: DOMRect) => void
) {
    return ({ date, view }: { date: Date; view: string }) => {
        const base = baseTileContent({ date, view });
        if (view !== "month") return base;

        return (
            <button
                type="button"
                onClick={(ev) => {
                    const tile = (ev.currentTarget.closest(".react-calendar__tile") as HTMLElement | null);
                    const rect = tile?.getBoundingClientRect?.();
                    onDayClick(date, rect || undefined);
                }}
                aria-label={`일정 보기: ${dateUtils.formatDate(date)}`}
                style={{ all: "unset", position: "absolute", inset: 0, cursor: "pointer" }}
            >
                {base}
            </button>
        );
    };
}
