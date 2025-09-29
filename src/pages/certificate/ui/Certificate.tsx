// pages/certificate/ui/Certificate.tsx
import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDataFetching } from '../../../shared';

import { certificateApi } from '../../../entities/certificate/api/certificate-api';
// ⬇️ 새로 추가/수정된 타입들만 가져오기
import type {
    ScheduleEventsDto,
    ExamEventDto,
    ExamEventTypeBE,
} from '../../../entities/certificate/model/types';

import type { UiEvent, UiEventType } from '../../../features/calendar/adapters';
import { CertificateDetail } from '../../../widgets/certificate';
import { certificateStyles } from '../styles';

// BE 타입 -> UI 타입 매핑
const mapType = (t: ExamEventTypeBE): UiEventType =>
    t === 'DOC_REG'   ? 'doc-reg'
        : t === 'DOC_EXAM'  ? 'doc-exam'
            : t === 'DOC_PASS'  ? 'doc-pass'
                : t === 'PRAC_REG'  ? 'prac-reg'
                    : t === 'PRAC_EXAM' ? 'prac-exam'
                        : 'prac-pass';

export default function Certificate() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const certId = Number(id);

    useEffect(() => {
        if (!id || Number.isNaN(certId)) navigate('/', { replace: true });
    }, [id, certId, navigate]);

    // ⬇️ 제네릭을 ScheduleEventsDto로 명확히
    const { data, loading, error, refetch } = useDataFetching<ScheduleEventsDto>({
        fetchFn: () => certificateApi.getSchedule(certId),
    });

    // BE events[] -> UI events
    const uiEvents: UiEvent[] = useMemo(() => {
        // ⬇️ 타입 단언으로 배열 보장 + 콜백 파라미터 타입 명시
        const events = (data?.events ?? []) as ExamEventDto[];
        return events.map((ev: ExamEventDto) => ({
            startdate:   ev.startDate,
            enddate:     ev.endDate,
            type:        mapType(ev.type),
            certificate: '',
        }));
    }, [data]);

    if (loading) {
        return <div className={certificateStyles.loading}>불러오는 중…</div>;
    }
    if (error) {
        return (
            <div className={certificateStyles.error}>
                오류: {String(error)}{' '}
                <button className={certificateStyles.retryButton} onClick={() => void refetch()}>
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div className={certificateStyles.certificateContainer}>
            <div className={certificateStyles.pageHeader}>
                <button onClick={() => navigate(-1)} className={certificateStyles.backButton}>
                    ← 뒤로가기
                </button>
            </div>

            <CertificateDetail calendarEvents={uiEvents} calendarLoading={false} />
        </div>
    );
}
