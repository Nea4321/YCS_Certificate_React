// pages/certificate/ui/Certificate.tsx
import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDataFetching } from "@/shared";
import { CertificateDetail } from "@/widgets/certificate";
import { certificateStyles } from "../styles";
import { certificateApi } from "@/entities/certificate/api/certificate-api";

import { schedulesToEvents as buildUiEvents } from "@/entities/certificate/lib/schedulesToEvents";
import type { UiEvent } from "@/features/calendar/model/adapters";
import type { RawItem } from "@/widgets/schedule/buildQnetGrid";

export default function Certificate() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const certId = Number(id);

    // id 유효성 체크
    useEffect(() => {
        if (!id || Number.isNaN(certId)) navigate("/", { replace: true });
    }, [id, certId, navigate]);

    // 일정 불러오기
    const { data, loading, error, refetch } = useDataFetching<{ events: UiEvent[] }>({
        fetchFn: async () => {
            const schedules = await certificateApi.getSchedule([certId]);
            const rows = (schedules?.[0]?.schedule ?? []) as RawItem[];
            return { events: buildUiEvents(rows) };
        },
    });

    const uiEvents = useMemo(() => data?.events ?? [], [data]);

    // 로딩
    if (loading) {
        return (
            <div className={certificateStyles.loading}>
                <div className={certificateStyles.loadingSpinner} />
                <p>자격증 정보를 불러오는 중입니다…</p>
            </div>
        );
    }

    // 에러
    if (error) {
        return (
            <div className={certificateStyles.error}>
                <p>오류: {String(error)}</p>
                <button className={certificateStyles.retryButton} onClick={() => void refetch()}>
                    다시 시도
                </button>
            </div>
        );
    }

    // 데이터 없음 (이벤트가 비어있을 때)
    if (!uiEvents || uiEvents.length === 0) {
        return (
            <div className={certificateStyles.notFound}>
                <h2>자격증 정보를 찾을 수 없습니다</h2>
                <p>요청하신 자격증 정보가 존재하지 않습니다.</p>
                <button className={certificateStyles.backButton} onClick={() => navigate("/")}>
                    자격증 목록으로 돌아가기
                </button>
            </div>
        );
    }

    // 정상 렌더
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
