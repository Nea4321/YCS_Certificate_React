import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from "react-router-dom"
import { useDataFetching } from "@/shared"
import { CertificateDetail } from "@/widgets/certificate"
import { certificateStyles } from "../styles"
import { certificateApi } from '@/entities/certificate/api/certificate-api';
import { schedulesToEvents } from '@/entities/certificate/lib'; // ← 요거 추가

// ⬇️ 새로 추가/수정된 타입들만 가져오기
import type {
    Schedule,              // ← 추가
    ScheduleEventsDto,
    ExamEventDto,
    ExamEventTypeBE,
} from '@/entities/certificate/model/types';
import type { UiEvent, UiEventType } from '@/features/calendar/model/adapters.ts';

const mapType = (t: ExamEventTypeBE): UiEventType =>
    t === 'DOC_REG'   ? 'doc-reg'
        : t === 'DOC_EXAM'  ? 'doc-exam'
            : t === 'DOC_PASS'  ? 'doc-pass'
                : t === 'PRAC_REG'  ? 'prac-reg'
                    : t === 'PRAC_EXAM' ? 'prac-exam'
                        : 'prac-pass';

/**
 * 자격증 상세 정보 페이지 접근 컴포넌트
 * 쿼리스트링의 id 값을 읽어 해당하는 자격증의 정보를 조회하고,
 * 로딩,에러,데이터없음,정상 상태에 따른 UI를 렌더링 한다
 *
 * - id가 없으면 홈('/')으로 리다이렉트
 * - 정상적으로 접근했다면 선택한 자격증의 상세페이지로 리다이렉트
 * @component
 *
 * @example
 * <Route path="/certificate/:id" element={<CertificatePage />} />
 */
export default function Certificate() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const certId = Number(id);

    useEffect(() => {
        if (!id || Number.isNaN(certId)) navigate('/', { replace: true });
    }, [id, certId, navigate]);

    // ✅ fetchFn: number -> number[] 로 넘기고, Schedule[] -> ScheduleEventsDto 로 변환
    const { data, loading, error, refetch } = useDataFetching<ScheduleEventsDto>({
        fetchFn: () =>
            certificateApi.getSchedule([certId]).then((rows: Schedule[]) => ({
                events: schedulesToEvents(rows),
            })),
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