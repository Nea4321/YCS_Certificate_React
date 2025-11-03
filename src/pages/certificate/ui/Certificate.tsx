// pages/certificate/ui/Certificate.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDataFetching } from "@/shared";
import { CertificateDetail } from "@/widgets/certificate";
import { certificateStyles } from "../styles";
import { certificateApi } from "@/entities/certificate/api/certificate-api";

import { schedulesToEvents as buildUiEvents } from "@/entities/certificate/lib/schedulesToEvents";
import type { UiEvent } from "@/features/calendar/model/adapters";
import type { RawItem } from "@/widgets/schedule/buildQnetGrid";
import type { CertificateData } from "@/entities/certificate/model/types";
import axios from "axios";

export default function Certificate() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const certId = Number(id);

    const [running, setRunning] = useState(false); // ← 엔진 동작중 표시

    useEffect(() => {
        if (!id || Number.isNaN(certId)) navigate("/", { replace: true });
    }, [id, certId, navigate]);

    // ① 일정
    const {
        data: scheduleData,
        loading: scheduleLoading,
        error: scheduleError,
        refetch: refetchSchedule,
    } = useDataFetching<{ events: UiEvent[] }>({
        fetchFn: async () => {
            const schedules = await certificateApi.getSchedule([certId]);
            const rows = (schedules?.[0]?.schedule ?? []) as RawItem[];
            return { events: buildUiEvents(rows) };
        },
    });
    const uiEvents = useMemo(() => scheduleData?.events ?? [], [scheduleData]);

    // ② 상세
    const {
        data: certData,
        loading: certLoading,
        error: certError,
        refetch: refetchCertificate,
    } = useDataFetching<CertificateData | null>({
        fetchFn: async () => certificateApi.getCertData(certId),
        initialData: null,
    });

    // ✅ 엔진 트리거 + 폴링
    const handleRunEngine = async () => {
        if (!id) return;
        try {
            setRunning(true);
            await certificateApi.runPublic(certId); // 1) 엔진 트리거
            // 2) DB 저장될 때까지 폴링 (최대 60초)
            const deadline = Date.now() + 60_000;
            while (Date.now() < deadline) {
                const data = await certificateApi.getCertData(certId);
                if (data) {
                    await refetchCertificate();
                    await refetchSchedule();
                    setRunning(false);
                    return;
                }
                await new Promise(r => setTimeout(r, 2000));
            }
            setRunning(false);
            alert("엔진 실행은 성공했지만 데이터가 아직 저장되지 않았어요. 잠시 후 새로고침해보세요.");
        } catch (e: unknown) {
            console.error(e);
            const msg =
                axios.isAxiosError(e)
                    ? (e.response?.data?.message || e.message)
                    : String(e);
            alert(`엔진 실행 중 오류가 발생했습니다.\n\n${msg}`);
        } finally {
            setRunning(false);
        }
    };

    const loading = scheduleLoading || certLoading;
    const scheduleDone = !scheduleLoading;
    const certDone = !certLoading;

    const TopBar = (
        <div className={certificateStyles.pageHeader}>
            <button onClick={() => navigate(-1)} className={certificateStyles.backButton}>
                ← 뒤로가기
            </button>
        </div>
    );

    // 로딩
    if (loading) {
        return (
            <div className={certificateStyles.certificateContainer}>
                {TopBar}
                <div className={certificateStyles.loading}>
                    <div className={certificateStyles.loadingSpinner} />
                    <p>자격증 정보를 불러오는 중입니다…</p>
                </div>
            </div>
        );
    }

    // 에러(둘 다 실패일 때만 치명적)
    if (scheduleError && certError) {
        return (
            <div className={certificateStyles.certificateContainer}>
                {TopBar}
                <div className={certificateStyles.error}>
                    <p>오류가 발생했습니다.</p>
                    <pre>{String(scheduleError ?? certError)}</pre>
                    <div className={certificateStyles.buttonsRow}>
                        <button className={certificateStyles.retryButton} onClick={() => void refetchSchedule()}>
                            일정 다시 시도
                        </button>
                        <button className={certificateStyles.backButton} onClick={() => void refetchCertificate()}>
                            자격증 불러오기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ NotFound는 "두 요청이 끝난 뒤"에만 표시
    const noEvents = !uiEvents || uiEvents.length === 0;
    const noCert = !certData;
    if (scheduleDone && certDone && noEvents && noCert) {
        return (
            <div className={certificateStyles.certificateContainer}>
                {TopBar}
                <div className={certificateStyles.notFound}>
                    <h2>자격증 정보를 찾을 수 없습니다</h2>
                    <p>요청하신 자격증 정보가 존재하지 않습니다.</p>
                    <button
                        className={certificateStyles.backButton}
                        onClick={handleRunEngine}
                        disabled={running}
                    >
                        {running ? "가져오는 중…" : "자격증 불러오기"}
                    </button>
                </div>
            </div>
        );
    }

    // 정상 렌더
    return (
        <div className={certificateStyles.certificateContainer}>
            {TopBar}
            <CertificateDetail
                certificate={certData ?? null}
                calendarEvents={uiEvents}
                calendarLoading={false}
            />
        </div>
    );
}