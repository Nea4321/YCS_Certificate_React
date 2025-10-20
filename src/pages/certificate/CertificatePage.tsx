// pages/certificate/CertificatePage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { certificateStyles } from './styles';

import { certificateApi } from '@/entities/certificate/api/certificate-api';
import { schedulesToEvents as buildUiEvents } from '@/entities/certificate/lib/schedulesToEvents';
import type { UiEvent } from '@/features/calendar/model/adapters';
import type { CertificateData } from '@/entities/certificate/model/types';
import { CertificateDetail } from '@/widgets/certificate';

export interface CertificateProps {
    certificate: CertificateData | null;
    calendarEvents: UiEvent[];
    calendarLoading: boolean;
}

export function Certificate({
                                certificate,
                                calendarEvents,
                                calendarLoading,
                            }: CertificateProps) {
    return (
        <CertificateDetail
            certificate={certificate}
            calendarEvents={calendarEvents}
            calendarLoading={calendarLoading}
        />
    );
}

export const CertificatePage = () => {
    const { id } = useParams<{ id: string }>();

    const [certificate, setCertificate] = useState<CertificateData | null>(null);
    const [calendarEvents, setCalendarEvents] = useState<UiEvent[]>([]);
    const [calendarLoading, setCalendarLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        const ac = new AbortController();
        let alive = true;

        (async () => {
            setCalendarLoading(true);
            try {
                // 상세 + 일정 동시 로드
                const [cert, schedules] = await Promise.all([
                    certificateApi.getCertData(Number(id), ac.signal),
                    certificateApi.getSchedule([Number(id)], ac.signal),
                ]);

                // rows -> UiEvent[]
                const rows = (schedules?.[0]?.schedule ?? []) as any[];
                const ui = buildUiEvents(rows, cert?.certificate_name);

                if (alive) {
                    setCertificate(cert);
                    setCalendarEvents(ui);              // ✅ 접수/추가접수/시험/발표 모두 포함
                }
            } catch (e) {
                if (alive) {
                    setCertificate(null);
                    setCalendarEvents([]);
                    console.warn('[CAL] load failed:', e);
                }
            } finally {
                if (alive) setCalendarLoading(false);
            }
        })();

        return () => {
            alive = false;
            ac.abort();
        };
    }, [id]);

    return (
        <div className={certificateStyles.container}>
            <Certificate
                certificate={certificate}
                calendarEvents={calendarEvents}
                calendarLoading={calendarLoading}
            />
        </div>
    );
};

export default CertificatePage;
