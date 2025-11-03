import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { UiEvent } from "@/features/calendar/model/adapters";
import { calendarStyles } from "@/widgets/calendar";

interface EventPopoverProps {
    open: boolean;
    onClose: () => void;
    anchorEl: HTMLElement | null;
    containerEl: HTMLElement | null;
    dateText: string;
    items: UiEvent[];
}

const TYPE_LABEL: Record<UiEvent["type"], string> = {
    "doc-reg": "필기접수",
    "doc-exam": "필기시험",
    "doc-pass": "필기합격",
    "prac-reg": "실기접수",
    "prac-exam": "실기시험",
    "prac-pass": "실기합격",
};

export function EventPopover({
                                 open,
                                 onClose,
                                 anchorEl,
                                 containerEl,
                                 dateText,
                                 items,
                             }: EventPopoverProps) {
    const backdropRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    const compute = () => {
        if (!anchorEl || !containerEl) return;
        const tile = anchorEl.getBoundingClientRect();
        const box = containerEl.getBoundingClientRect();

        const ATTACH_X = 4;
        const ATTACH_Y = -2;
        const top = (tile.top - box.top) + containerEl.scrollTop + ATTACH_Y;
        const left = (tile.right - box.left) + containerEl.scrollLeft + ATTACH_X;

        const POPOVER_W = 420;
        const maxLeft = containerEl.scrollLeft + containerEl.clientWidth - POPOVER_W - 8;
        setPos({ top: Math.max(0, top), left: Math.min(left, maxLeft) });
    };

    useLayoutEffect(() => { if (open) compute(); }, [open, anchorEl, containerEl]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        const onScroll = () => compute();
        window.addEventListener("keydown", onKey);
        window.addEventListener("resize", compute);
        containerEl?.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("resize", compute);
            containerEl?.removeEventListener("scroll", onScroll);
        };
    }, [open, containerEl, onClose]);

    if (!open || !anchorEl || !containerEl) return null;

    const sorted = [...items].sort((a, b) => {
        if (a.startdate !== b.startdate) return a.startdate < b.startdate ? -1 : 1;
        if (a.enddate !== b.enddate) return a.enddate < b.enddate ? -1 : 1;
        return 0;
    });

    return (
        <div
            ref={backdropRef}
            className={calendarStyles.popoverBackdrop}
            onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
        >
            <div
                role="dialog"
                aria-modal="true"
                className={calendarStyles.popover}
                style={{ top: pos.top, left: pos.left }} // 위치만 동적
            >
                <div className={calendarStyles.popoverHead}>
                    <div>
                        <div className={calendarStyles.popoverDate}>{dateText}</div>
                        <div className={calendarStyles.popoverTitle}>일정 {sorted.length}건</div>
                    </div>
                    <button className={calendarStyles.popoverClose} onClick={onClose}>
                        닫기
                    </button>
                </div>

                <ul className={calendarStyles.popoverList}>
                    {sorted.map((ev, i) => (
                        <li key={i} className={calendarStyles.popoverItem}>
                            <div className={calendarStyles.popoverItemRow}>
                                <strong className={calendarStyles.popoverItemName}>
                                    {ev.certificate?.trim() || "관련 자격증"}
                                </strong>
                                <span className={calendarStyles.popoverItemChip}>
                  {TYPE_LABEL[ev.type]}
                </span>
                            </div>
                            <div className={calendarStyles.popoverItemPeriod}>
                                {ev.startdate} ~ {ev.enddate}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
