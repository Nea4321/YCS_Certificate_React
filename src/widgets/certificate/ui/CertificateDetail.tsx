import { memo, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

import type { CertificateData } from '@/entities/certificate/model/types';
import { certificateDetailStyles } from '../styles';
import { certificateApi } from '@/entities/certificate/api/certificate-api';
import { getTagName, getTagColor } from '@/entities/certificate/model/tagMeta';
import { CalendarWidget } from '@/widgets/calendar/ui/CalendarWidget';
import { certificateTags } from '@/entities/certificate';
import type { UiEvent, UiEventType } from '@/features/calendar/model/adapters';
import { fromRegularSchedule, toUiEvents, ADAPTER_BANNER }
    from '@/features/calendar/model/adapters';
import { QnetScheduleTable } from '@/widgets/schedule/ui/QnetScheduleTable';
import type { RawItem } from '@/widgets/schedule/buildQnetGrid';
import { Tabs } from '@/shared/components/Tabs';
import { ExamInfoBlocks } from '@/widgets/schedule/ui/ExamInfoBlocks';
import { BasicInfoPanel, ExamStatsPanel } from '@/widgets/basic-info';
import { pickExamInfo, pickExamStats, pickBasicHtml, pickBenefitHtml } from '@/entities/certificate/model/selectors';
import { PreferencePanel } from '@/widgets';

// ──────────────────────────────────────────────────────────────────────────────
// 1) 유틸 & 디버그용 컴포넌트
// ──────────────────────────────────────────────────────────────────────────────

const LEGAL_TYPES: readonly UiEventType[] = [
    'doc-reg', 'doc-exam', 'doc-pass',
    'prac-reg', 'prac-exam', 'prac-pass',
] as const;

function isUiEventType(v: string): v is UiEventType {
    return (LEGAL_TYPES as readonly string[]).includes(v);
}

function daysBetween(a: string, b: string): number {
    return (+new Date(b) - +new Date(a)) / 86400000;
}


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
const TAB_BASIC = 'basic';
const TAB_BENEFIT = 'benefit';

export const CertificateDetail = memo(function CertificateDetail({
                                                                     certificate: initialCertificate,
                                                                     calendarEvents,
                                                                     calendarLoading,
                                                                 }: CertificateDetailProps) {
    const navigate = useNavigate();
    const { id } = useParams();

    const [certificate, setCertificate] = useState<CertificateData | null>(
        initialCertificate ?? null
    );
    const [scheduleRaw, setScheduleRaw] = useState<RawItem[]>([]);

    // 탭 상태
    const [sp, setSp] = useSearchParams();
    useEffect(() => {
        if (!sp.get('tab')) setSp({ tab: TAB_EXAM }, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const active = sp.get('tab') ?? TAB_EXAM;
    const changeTab = (k: string) => setSp({ tab: k });

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
    const examInfo = pickExamInfo(base);
    const basicHtml = pickBasicHtml(base);
    const benefitHtml = pickBenefitHtml(base);
    const examStats = pickExamStats(base);

    console.log('[CERT] prop.calendarEvents length =', calendarEvents?.length);

    const DEBUG = new URLSearchParams(window.location.search).has('debugCal');

    const forceAdapter = DEBUG || new URLSearchParams(location.search).has('forceAdapter');

    const calendarEventsResolved = useMemo(() => {
        const rows = (base?.schedule ?? []) as any[];

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
        console.table(be.map(e => ({ type: e.type, start: e.start, end: e.end })));
        return toUiEvents(be, base?.certificate_name || '');
    }, [calendarEvents, base, forceAdapter]);


    if (DEBUG) {
        console.table(
            (base?.schedule ?? []).map((r: any, i: number) => ({
                i,
                phaseLike: ["phase","구분","종류"].map(k => r[k]).find(Boolean),
                reg: Object.entries(r).find(([k,v]) => /접수|원서|신청|추가접수/.test(k) && /\d/.test(String(v)))?.[1],
                exam: Object.entries(r).find(([k,v]) => /시험|평가|검정/.test(k) && /\d/.test(String(v)))?.[1],
                pass: Object.entries(r).find(([k,v]) => /발표|합격|결과/.test(k) && /\d/.test(String(v)))?.[1],
            }))
        );
    }


    // ─── 디버그: 타입 검증 & 콘솔 로그
    if (DEBUG) {
        console.group('[CERT] Calendar Debug');
        console.log('certificate:', base?.certificate_name, '(id:', base?.certificate_id, ')');
        console.log('raw schedule rows:', (base?.schedule ?? []).length);
        console.log('resolved events:', calendarEventsResolved.length);

        const bad = calendarEventsResolved.filter(e => !isUiEventType(e.type));
        if (bad.length) {
            console.warn('[BAD TYPES]', bad.map(b => b.type));
        }

        const counters = calendarEventsResolved.reduce<Record<UiEventType, number>>((acc, e) => {
            if (isUiEventType(e.type)) acc[e.type] = (acc[e.type] ?? 0) + 1;
            return acc;
        }, {} as Record<UiEventType, number>);
        console.table(counters);

        // 과도한 기간(> 45일) 경고
        calendarEventsResolved.forEach(e => {
            const d = daysBetween(e.startdate, e.enddate);
            if (d > 45) console.warn('[LONG RANGE]', e.type, e.startdate, e.enddate, d);
        });

        console.table(
            calendarEventsResolved.map(e => ({
                type: e.type,
                start: e.startdate,
                end: e.enddate,
                days: daysBetween(e.startdate, e.enddate),
            }))
        );
        console.groupEnd();
    }

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

            {/* 섹션1: 달력 */}
            <section className={certificateDetailStyles.calendarSection} style={{ marginTop: 32 }}>
                <h2>시험일정</h2>
                <CalendarWidget
                    events={calendarEventsResolved}
                    loading={calendarLoading}
                    certName={certName || undefined}
                />
            </section>

            {/* 섹션2: 탭 */}
            <section style={{ marginTop: 24 }}>
                <Tabs
                    tabs={[
                        { key: TAB_EXAM, label: '시험정보' },
                        { key: TAB_BASIC, label: '기본정보' },
                        { key: TAB_BENEFIT, label: '우대현황' },
                    ]}
                    active={active}
                    onChange={changeTab}
                >
                    {active === TAB_EXAM && (
                        <div>
                            <h3 style={{ marginTop: 4 }}>시험일정</h3>
                            <QnetScheduleTable data={scheduleRaw} />
                            <h3 style={{ marginTop: 24 }}>시험정보</h3>
                            <ExamInfoBlocks data={examInfo} />
                        </div>
                    )}

                    {active === TAB_BASIC && (
                        <div className="certificate-content">
                            <h2>기본정보</h2>
                            <BasicInfoPanel data={base} />
                            <ExamStatsPanel data={examStats} />
                            <div dangerouslySetInnerHTML={{ __html: basicHtml || '' }} />
                        </div>
                    )}

                    {active === TAB_BENEFIT && (
                        <div className="certificate-content">
                            <h2>우대현황</h2>
                            <PreferencePanel data={base} />
                            <div dangerouslySetInnerHTML={{ __html: benefitHtml || '' }} />
                        </div>
                    )}
                </Tabs>
            </section>

            {/* 👇 여기부터 추가 */}
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
