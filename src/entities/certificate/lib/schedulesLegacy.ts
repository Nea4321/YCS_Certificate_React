// schedulesLegacy.ts
import type { UiEvent } from "@/features/calendar/model/adapters";
import {
    fromRegularSchedule,   // ← 테이블에서 쓰던 느슨한 파서
    toUiEvents,             // ← BE 이벤트 → UI 이벤트 매핑
} from "@/features/calendar/model/adapters";

export function cachedScheduleToUiEvents(
    rows: ReadonlyArray<Record<string, string | null | undefined>>
): UiEvent[] {
    if (!Array.isArray(rows) || rows.length === 0) return [];

    // “새/옛 스키마” 구분은 대충이라도 키에 날짜 관련 단어가 있으면 새 스키마로 보냄
    const looksNew = (r: Record<string, unknown>) =>
        Object.keys(r).some(k =>
            ["phase","구분","종류","접수","원서","신청","추가접수","시험","평가","검정","발표","합격","결과"]
                .some(s => k.includes(s))
        );

    const newRows = rows.filter(looksNew) as any[]; // RegularRow 호환
    const events  = toUiEvents(fromRegularSchedule(newRows));

    // 필요 시 DEBUG
    if (new URLSearchParams(location.search).has("debugCal")) {
        console.group("[CAL] cachedScheduleToUiEvents");
        console.log("rows:", rows.length, "→ events:", events.length);
        console.table(events.map(e => ({
            type: e.type, start: e.startdate, end: e.enddate,
            days: (+new Date(e.enddate) - +new Date(e.startdate)) / 86400000,
        })));
        console.groupEnd();
    }

    return events;
}
