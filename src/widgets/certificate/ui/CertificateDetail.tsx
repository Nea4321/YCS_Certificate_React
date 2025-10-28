import { memo, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

import type { CertificateData } from '@/entities/certificate/model/types';
import { certificateDetailStyles } from '../styles';
import { certificateApi } from '@/entities/certificate/api/certificate-api';
import { getTagName, getTagColor } from '@/entities/certificate/model/tagMeta';
import { CalendarWidget } from '@/widgets/calendar/ui/CalendarWidget';
import { certificateTags } from '@/entities/certificate';
import type { UiEvent } from '@/features/calendar/model/adapters';
import { fromRegularSchedule, toUiEvents, ADAPTER_BANNER }
    from '@/features/calendar/model/adapters';
import { QnetScheduleTable } from '@/widgets/schedule/ui/QnetScheduleTable';
import type { RawItem } from '@/widgets/schedule/buildQnetGrid';
import { Tabs } from '@/shared/components/Tabs';
import { ExamInfoBlocks } from '@/widgets/schedule/ui/ExamInfoBlocks';
import {BasicInfoPanel, ExamStatsPanel } from '@/widgets/basic-info';
import { pickExamInfo, pickExamStats, pickBasicHtml, pickBenefitHtml } from '@/entities/certificate/model/selectors';
import {PreferencePanel} from '@/widgets';

// ──────────────────────────────────────────────────────────────────────────────
// 2) 본 컴포넌트
// ──────────────────────────────────────────────────────────────────────────────

interface CertificateDetailProps {
    certificate?: CertificateData | null;
    calendarEvents: UiEvent[];
    calendarLoading?: boolean;
    scheduleRows?: RawItem[];
}

const TAB_EXAM = 'exam';

const toHtmlString = (v: unknown): string => {
    if (typeof v === 'string') return v;
    if (v == null) return '';
    if (Array.isArray(v)) return v.join('');

    if (typeof v === 'object') {
        const obj = v as Record<string, unknown>;
        const htmlLike =
            (typeof obj.html === 'string' && obj.html) ||
            (typeof obj.content === 'string' && obj.content) ||
            (typeof obj.value === 'string' && obj.value) ||
            '';
        return String(htmlLike);
    }
    return String(v);
};

const isEmptyHtml = (v?: unknown) => {
    const html = toHtmlString(v);
    return !html || !html.replace(/<[^>]*>/g, '').trim();
};

export const CertificateDetail = memo(function CertificateDetail({
                                                                     certificate: initialCertificate,
                                                                     calendarEvents,
                                                                     calendarLoading,
                                                                 }: CertificateDetailProps) {
    const navigate = useNavigate();
    const {id} = useParams();

    const [certificate, setCertificate] = useState<CertificateData | null>(
        initialCertificate ?? null
    );
    const [scheduleRaw, setScheduleRaw] = useState<RawItem[]>([]);

    // 탭 상태
    const [sp, setSp] = useSearchParams();
    useEffect(() => {
        if (!sp.get('tab')) setSp({tab: TAB_EXAM}, {replace: true});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const active = sp.get('tab') ?? TAB_EXAM;
    const changeTab = (k: string) => setSp({ tab: k }, { replace: true });

    // 상세(캐시) 로드
    useEffect(() => {
        if (!id || initialCertificate) return;
        certificateApi.getCertData(Number(id)).then((res: CertificateData) => {
            setCertificate(res);
            if (Array.isArray(res.schedule)) {
                setScheduleRaw(res.schedule as unknown as RawItem[]);
            }
        });
    }, [id, initialCertificate]);

    const base = certificate ?? initialCertificate ?? null;
    const tagIds = base ? (certificateTags[base.certificate_id] ?? []) : [];
    const certName = base?.certificate_name ?? '';

    // HTML/블록
    const examInfo   = pickExamInfo(base);
    const basicHtml0 = pickBasicHtml(base);
    const benefit0   = pickBenefitHtml(base);
    const examStats  = pickExamStats(base);

    // 안전 문자열
    const basicHtml   = toHtmlString(basicHtml0);
    const benefitHtml = toHtmlString(benefit0);


    console.log('[CERT] prop.calendarEvents length =', calendarEvents?.length);

    const DEBUG = new URLSearchParams(window.location.search).has('debugCal');

    const forceAdapter = DEBUG || new URLSearchParams(location.search).has('forceAdapter');

    const calendarEventsResolved = useMemo(() => {
        const rows: RawItem[] = (base?.schedule as RawItem[] | undefined) ?? [];

        if (!forceAdapter && calendarEvents?.length) {
            // 여기 내가 수정했음 박세호
            return calendarEvents.map(e => ({
                ...e,
                certificate: e.certificate && e.certificate.trim()
                    ? e.certificate
                    : certName
            }));
        }

        console.log('[CERT] building via adapter:', ADAPTER_BANNER, 'rows=', rows.length);
        const be = fromRegularSchedule(rows);
        console.table(be.map(e => ({type: e.type, start: e.start, end: e.end})));
        return toUiEvents(be, base?.certificate_name || '');
    }, [calendarEvents, base, forceAdapter]);


    // 1) 플래그 정리
    const hasSchedule = (scheduleRaw?.length ?? 0) > 0;
    const hasBasic    = !isEmptyHtml(basicHtml);
    const hasBenefit  = !isEmptyHtml(benefitHtml);

    // 탭은 내용이 하나라도 있을 때
    const showTabs = hasSchedule || hasBasic || hasBenefit;


    return (
        <div className={certificateDetailStyles.container}>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
          .certificate-content{font-size:1.1em;line-height:1.8}
          .certificate-content h3{font-size:1.3em;font-weight:bold;margin:1.5em 0 1em}
        `,
                }}
            />
            {/* 헤더 */}
            <div className={certificateDetailStyles.header}>
                <h1 className={certificateDetailStyles.title}>{certName}</h1>

                <div className={certificateDetailStyles.tagBox}>
                    {tagIds.map((tid) => {
                        const name = getTagName(tid);
                        if (!name) return null;
                        const color = getTagColor(tid) ?? '#64748B';
                        return (
                            <span
                                key={tid}
                                className={certificateDetailStyles.tag}
                                style={{ backgroundColor: color }}
                                onClick={() => navigate(`/search?keyword=${encodeURIComponent('#' + name)}`)}
                            >
              #{name}
            </span>
                        );
                    })}
                </div>
            </div>

            {/* ▼ 여기부터: 기본정보(개요/수행직무/진로및전망) */}
            {base?.basic_info && (
                <div className={`${certificateDetailStyles.basicInfo} certificate-content`}>
                    {base && <BasicInfoPanel data={base} />}
                </div>
            )}

            {/* 달력 먼저 */}
            <section className={certificateDetailStyles.calendarSection} style={{ marginTop: 32 }}>
                <h2>자격증 시험일정</h2>
                <CalendarWidget
                    events={calendarEventsResolved}
                    loading={calendarLoading}
                    certName={certName || undefined}
                />
            </section>

            <>
                {/* 그 다음 탭 */}
                {showTabs && (
                    <section style={{ marginTop: 24 }}>
                        <Tabs
                            tabs={[
                                { key: 'exam',    label: '시험정보' },
                                { key: 'basic',   label: '검정통계' },
                                { key: 'benefit', label: '우대현황' },
                            ]}
                            active={active}
                            onChange={changeTab}
                        >
                            {active === 'exam' && (
                                <div>
                                    <h3 style={{ marginTop: 4 }}>시험일정</h3>
                                    <QnetScheduleTable data={scheduleRaw} />
                                    <h3 style={{ marginTop: 24 }}>시험정보</h3>
                                    <ExamInfoBlocks data={base ? examInfo : undefined} />
                                </div>
                            )}

                            {active === 'basic' && (
                                <div className="certificate-content">
                                    {base && <ExamStatsPanel data={examStats} />}
                                    <div dangerouslySetInnerHTML={{ __html: base ? (basicHtml || '') : '' }} />
                                </div>
                            )}

                            {active === 'benefit' && (
                                <div className="certificate-content">
                                    <h2>우대현황</h2>
                                    {base && <PreferencePanel data={base} />}
                                    <div dangerouslySetInnerHTML={{ __html: base ? (benefitHtml || '') : '' }} />
                                </div>
                            )}
                        </Tabs>
                    </section>
                )}
            </>

            <footer
                style={{
                    marginTop: 32,
                    paddingTop: 16,
                    borderTop: '1px solid #eee',
                    color: '#666',
                    fontSize: 12,
                    lineHeight: 1.5,
                }}
            >
                본 서비스는 졸업 프로젝트용 데모입니다. 원문 저작권과 데이터 권리는 각 기관(예: Q-Net)에 있습니다.
                문제가 될 시 <a href="mailto:you@school.ac.kr">you@school.ac.kr</a> 로 연락 주시면 즉시 비공개/삭제 조치하겠습니다.
                (출처: 한국산업인력공단(Q-Net) 등)
            </footer>
        </div>
    );
});

CertificateDetail.displayName = 'CertificateDetail';
