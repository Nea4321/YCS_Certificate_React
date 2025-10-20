import { useState, useEffect } from 'react';
import type { DeptMapData } from "@/entities/department/model";
import { fromRegularSchedule, RegularRow, toUiEvents, UiEvent } from "@/features/calendar";
import { certificateApi, Schedule } from "@/entities";

type CertInfo = DeptMapData['cert'];

export function useDepartmentSchedules(certs: CertInfo) {
    const [calendarEvents, setCalendarEvents] = useState<UiEvent[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchSchedules = async () => {
            if (!certs || certs.length === 0) {
                setIsLoading(false);
                setCalendarEvents([]);
                return;
            }
            try {
                setIsLoading(true);
                setError(null);
                setCalendarEvents([]);

                const certificateIds = certs.map(c => c.certificate_id);
                const scheduleData: Schedule[] = await certificateApi.getSchedule(certificateIds, signal);

                const allUiEvents = scheduleData.flatMap(item => {
                    if (Array.isArray(item.schedule)) {
                        const beEvents = fromRegularSchedule(item.schedule as RegularRow[]);
                        return toUiEvents(beEvents, item.certificate_name);
                    }
                    return [];
                });
                setCalendarEvents(allUiEvents);

            } catch (err) {
                if (err instanceof Error && err.name !== 'CanceledError') {
                    setError("일정을 불러오는 데 실패했습니다.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        void fetchSchedules();

        return () => controller.abort();
    }, [certs]);

    return { events: calendarEvents, isLoading, error };
}