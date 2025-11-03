/** CBT 쿼리 파라미터 파싱 유틸
 *
 * @param search - location.search
 * @returns { ui, mode, date, start, end, certName }
 */
export function getCbtParams(search: string) {
    const q = new URLSearchParams(search);
    const ui = (q.get("ui") as "practice" | "exam") || "practice";
    const mode = q.get("mode") as "past" | "random" | null;
    const date = q.get("date") || "";
    const start = q.get("start") || "";
    const end = q.get("end") || "";
    const certName = q.get("certName") || "";
    const certificateId = q.get("certificateId") || "";
    return { ui, mode, date, start, end, certName, certificateId };
}
