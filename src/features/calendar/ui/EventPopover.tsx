import {useEffect, useRef} from "react";
import type { UiEvent } from "@/features/calendar/model/adapters";

export interface AnchorRect { top: number; left: number; width: number; height: number }

interface EventPopoverProps {
    open: boolean;
    onClose: () => void;
    anchor: AnchorRect | null;
    dateText: string;
    items: UiEvent[];
}

const TYPE_LABEL: Record<UiEvent["type"], string> = {
    "doc-reg":  "필기접수",
    "doc-exam": "필기시험",
    "doc-pass": "필기합격",
    "prac-reg": "실기접수",
    "prac-exam":"실기시험",
    "prac-pass":"실기합격",
};

export function EventPopover({ open, onClose, anchor, dateText, items }: EventPopoverProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open || !anchor) return null;

    const ATTACH_X = -100;
    const ATTACH_Y = -20;
    const POPOVER_W = 320;

    let top  = Math.round(anchor.top  + ATTACH_Y);
    let left = Math.round(anchor.left + anchor.width - POPOVER_W + ATTACH_X);

    const PADDING = 4;
    if (left < PADDING) left = PADDING;
    if (top  < PADDING) top  = Math.round(anchor.top + anchor.height + Math.abs(ATTACH_Y));

    const sorted = [...items].sort((a, b) => {
        if (a.startdate !== b.startdate) return a.startdate < b.startdate ? -1 : 1;
        if (a.enddate   !== b.enddate)   return a.enddate   < b.enddate   ? -1 : 1;
        return 0;
    });

    return (
        <div
            ref={overlayRef}
            style={{ position: "fixed", inset: 0, zIndex: 1000 }}
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
            aria-hidden
        >
            <div
                role="dialog" aria-modal="true" aria-label="선택한 날짜의 일정"
                style={{
                    position: "fixed",
                    top, left, width: POPOVER_W, maxHeight: "60vh",
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,.12)",
                    overflow: "auto"
                }}
            >
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                    padding:"10px 12px", borderBottom:"1px solid #f3f4f6" }}>
                    <div>
                        <div style={{ fontSize:12, color:"#6b7280" }}>{dateText}</div>
                        <div style={{ fontSize:16, fontWeight:700 }}>일정 {sorted.length}건</div>
                    </div>
                    <button onClick={onClose}
                            style={{ fontSize:12, border:"1px solid #e5e7eb", padding:"4px 8px", borderRadius:8 }}>
                        닫기
                    </button>
                </div>

                {sorted.length === 0 ? (
                    <div style={{ padding:16, color:"#6b7280" }}>해당 날짜에 일정이 없습니다.</div>
                ) : (
                    <ul style={{ display:"grid", gap:8, padding:12 }}>
                        {sorted.map((ev, i) => (
                            <li key={i} style={{ border:"1px solid #e5e7eb", borderRadius:10, padding:10 }}>
                                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                                    <strong style={{ fontSize:14 }}>{ev.certificate?.trim() || "관련 자격증"}</strong>
                                    <span style={{ fontSize:11, padding:"2px 6px", borderRadius:999, border:"1px solid #e5e7eb" }}>
                    {TYPE_LABEL[ev.type]}
                  </span>
                                </div>
                                <div style={{ fontSize:12, color:"#374151" }}>
                                    {ev.startdate} ~ {ev.enddate}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}