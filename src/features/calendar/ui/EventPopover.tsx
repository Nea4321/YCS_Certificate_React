import {useEffect, useLayoutEffect, useRef, useState} from "react";
import type { UiEvent } from "@/features/calendar/model/adapters";

interface EventPopoverProps {
    open: boolean;
    onClose: () => void;
    anchorEl: HTMLElement | null;
    containerEl: HTMLElement | null;
    dateText: string;
    items: UiEvent[];
}

const TYPE_LABEL: Record<UiEvent["type"], string> = {
    "doc-reg":"필기접수","doc-exam":"필기시험","doc-pass":"필기합격",
    "prac-reg":"실기접수","prac-exam":"실기시험","prac-pass":"실기합격",
};

export function EventPopover({ open, onClose, anchorEl, containerEl, dateText, items }: EventPopoverProps) {
    const backdropRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState<{top:number; left:number}>({ top: 0, left: 0 });

    const compute = () => {
        if (!anchorEl || !containerEl) return;
        const tile = anchorEl.getBoundingClientRect();
        const box  = containerEl.getBoundingClientRect();

        const ATTACH_X = 4;
        const ATTACH_Y = -2;
        const top  = (tile.top  - box.top)  + containerEl.scrollTop  + ATTACH_Y;
        const left = (tile.right - box.left)+ containerEl.scrollLeft + ATTACH_X;

        const POPOVER_W = 320;
        const maxLeft   = containerEl.scrollLeft + containerEl.clientWidth - POPOVER_W - 8;
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

    const sorted = [...items].sort((a,b)=>{
        if (a.startdate !== b.startdate) return a.startdate < b.startdate ? -1 : 1;
        if (a.enddate   !== b.enddate)   return a.enddate   < b.enddate   ? -1 : 1;
        return 0;
    });

    return (
        <div
            ref={backdropRef}
            onClick={(e)=>{ if(e.target===backdropRef.current) onClose(); }}
            style={{ position:"absolute", inset:0, zIndex:20 }}
        >
            <div
                role="dialog" aria-modal="true"
                style={{
                    position:"absolute",
                    top: pos.top, left: pos.left,
                    width: 320, maxHeight:"60vh",
                    background:"#fff", border:"1px solid #e5e7eb", borderRadius:12,
                    boxShadow:"0 8px 24px rgba(0,0,0,.12)", overflow:"auto"
                }}
            >
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                    padding:"10px 12px",borderBottom:"1px solid #f3f4f6"}}>
                    <div>
                        <div style={{fontSize:12,color:"#6b7280"}}>{dateText}</div>
                        <div style={{fontSize:16,fontWeight:700}}>일정 {sorted.length}건</div>
                    </div>
                    <button onClick={onClose}
                            style={{fontSize:12,border:"1px solid #e5e7eb",padding:"4px 8px",borderRadius:8}}>닫기</button>
                </div>

                <ul style={{display:"grid",gap:8,padding:12}}>
                    {sorted.map((ev,i)=>(
                        <li key={i} style={{border:"1px solid #e5e7eb",borderRadius:10,padding:10}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                                <strong style={{fontSize:14}}>{ev.certificate?.trim() || "관련 자격증"}</strong>
                                <span style={{fontSize:11,padding:"2px 6px",borderRadius:99,border:"1px solid #e5e7eb"}}>
                  {TYPE_LABEL[ev.type]}
                </span>
                            </div>
                            <div style={{fontSize:12,color:"#374151"}}>{ev.startdate} ~ {ev.enddate}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}