import { memo, useEffect, useMemo, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import type { CertificateData } from '@/entities/certificate/model/types';
import { certificateDetailStyles } from '../styles';
import { certificateApi } from '@/entities/certificate/api/certificate-api';
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store/store";
import { CalendarWidget } from '@/widgets/calendar/ui/CalendarWidget';
import { loadCertTagMap, certificateTags, certificateNames } from '@/entities/certificate';
import type { UiEvent } from '@/features/calendar/model/adapters';
import { fromRegularSchedule, toUiEvents, ADAPTER_BANNER }
    from '@/features/calendar/model/adapters';
import { QnetScheduleTable } from '@/widgets/schedule/ui/QnetScheduleTable';
import type { RawItem } from '@/widgets/schedule/buildQnetGrid';
import { Tabs } from '@/shared/components/Tabs';
import { ExamInfoBlocks } from '@/widgets/schedule/ui/ExamInfoBlocks';
import { BasicInfoPanel, ExamStatsPanel } from '@/widgets/basic-info';
import { pickExamInfo, pickExamStats, pickBasicHtml, pickBenefitHtml } from '@/entities/certificate/model/selectors';
import { PreferencePanel } from '@/widgets/preference/ui/PreferencePanel';
import {FavoriteButton} from "@/features/favorite";
import { ChevronDown, ChevronUp } from 'lucide-react';
import CBTAnim from '@/pages/cbt/styles/CBTExamPage.module.css';
import { adaptPreference } from '@/widgets/preference/ui/adaptPreference';

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

type UnknownRec = Record<string, unknown>;

/** base에서 preference/other_info가 있으면 그쪽을 우선 선택 */
const pickPreferenceSource = (v: unknown): unknown => {
    if (v && typeof v === 'object') {
        const o = v as UnknownRec;
        const pref = o['preference'];
        const other = o['other_info'];
        if (pref && typeof pref === 'object') return pref as UnknownRec;
        if (other && typeof other === 'object') return other as UnknownRec;
    }
    return v;
};


export const CertificateDetail = memo(function CertificateDetail({
                                                                     certificate: initialCertificate,
                                                                     calendarEvents,
                                                                     calendarLoading,
                                                                 }: CertificateDetailProps) {
    const navigate = useNavigate();
    const { id } = useParams();

    const [tagVersion, setTagVersion] = useState(0);
    const certId = Number(id);
    const [open, setOpen] = useState(false); // 기본: 접힘. 펼쳐서 시작하려면 true
    useEffect(() => {
        if (!certId) return;
        if (!Array.isArray(certificateTags[certId]) || certificateTags[certId].length === 0) {
            const ac = new AbortController();
            (async () => {
                try {
                    const list = await certificateApi.getCertificate(ac.signal);
                    loadCertTagMap(list);
                    setTagVersion(v => v + 1);
                } catch { /* ignore */ }
            })();
            return () => ac.abort();
        }
    }, [certId]);

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

    const tagList = useSelector((s: RootState) => s.tag.list);
    const tagMetaMap = useMemo(
        () => new Map(tagList.map(t => [t.tag_id, { name: t.tag_Name, color: t.tag_color }])),
        [tagList]
    );

    const base = certificate ?? initialCertificate ?? null;

    useEffect(() => {
        if (!base?.certificate_id) return;

        // 이 자격증의 태그 맵이 비어 있으면 채운다
        if ((certificateTags[base.certificate_id] ?? []).length === 0) {
            const ctrl = new AbortController();
            let mounted = true;

            (async () => {
                try {
                    const list = await certificateApi.getCertificate(ctrl.signal);
                    loadCertTagMap(list);
                    if (mounted) setTagVersion(v => v + 1);
                } catch (e) {
                    console.log(e)

                }
            })();

            return () => {
                mounted = false;
                ctrl.abort();
            };
        }
    }, [base?.certificate_id]);

    const tagIds = useMemo(
        () => certificateTags[certId] ?? [],
        [certId, tagVersion]
    );

    const certName = base?.certificate_name ?? certificateNames[certId] ?? "";

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

    const benefitRef = useRef<HTMLDivElement | null>(null);

    // 빈 행(실제 글자 없는 tr) 제거
    useEffect(() => {
        const root = benefitRef.current;
        if (!root) return;

        queueMicrotask(() => {
            const tables = root.querySelectorAll<HTMLTableElement>('table:not([data-kind="qpref"])');
            tables.forEach((table) => {
                table.querySelectorAll<HTMLTableRowElement>('tbody tr').forEach((tr) => {
                    const cells = Array.from(tr.cells) as HTMLTableCellElement[];
                    const keep = cells.some((td) => {
                        const t = (td.textContent ?? '').replace(/[\u00A0\s]/g, '');
                        return t.length > 0;
                    });
                    if (!keep) tr.remove();
                });
            });
        });
    }, [benefitHtml]); // ← 우리 표는 benefitHtml로 렌더되지 않으므로 영향 없음

    // (우대현황 탭 JSX 바깥, return 위 어딘가)
    const prefData = useMemo<unknown>(() => pickPreferenceSource(base as unknown), [base]);
    const prefRows = useMemo(() => adaptPreference(prefData), [prefData]);

// (필요하면 URL에 ?debugPref 붙였을 때만 찍게)
    if (new URLSearchParams(location.search).has('debugPref')) {
        console.table(prefRows.slice(0, 5));
    }



    // 1) 플래그 정리
    // 1) 플래그 정리
    const hasSchedule =
        (scheduleRaw?.length ?? 0) > 0 ||
        (Array.isArray(base?.schedule) && base!.schedule.length > 0);

    const hasBasic =
        Boolean(base?.basic_info || base?.basic_info_html || (basicHtml && basicHtml.length > 0));

    const hasBenefit  = prefRows.length > 0 || Boolean(benefitHtml && benefitHtml.length > 0);

    const showTabs = hasSchedule || hasBasic || hasBenefit;

    useEffect(() => {
        if (Array.isArray(base?.schedule)) {
            setScheduleRaw(base!.schedule as RawItem[]);
        }
    }, [base?.schedule]);



    return (
        <div className={certificateDetailStyles.container}>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
      /* 기본은 폰트만 */
      .certificate-content{font-size:1.1em}
      .certificate-content h3{font-size:1.3em;font-weight:bold;margin:1.5em 0 1em}

      /* 줄간격은 basic-info에만 */
      #basic-info.certificate-content{line-height:1.8}
    `,
                }}
            />
            {/* 헤더 */}
            <div className={certificateDetailStyles.header}>
                <div className={certificateDetailStyles.titleBox}>
                <h1 className={certificateDetailStyles.title}>{certName}</h1>
                <FavoriteButton exist={certName} id={id} type={"certificate"}/>
                </div>
                <div className={certificateDetailStyles.tagBox}>
                    {tagIds.map((tid) => {
                        const meta = tagMetaMap.get(tid);
                        if (!meta) return null;
                        return (
                            <span
                                key={tid}
                                className={certificateDetailStyles.tag}
                                style={{ backgroundColor: meta.color ?? "#64748B" }}
                                onClick={() => navigate(`/search?keyword=${encodeURIComponent("#" + meta.name)}`)}
                            >
        #{meta.name}
      </span>
                        );
                    })}
                </div>
            </div>

            {/* ▼ 기본정보(개요/수행직무/진로및전망) */}
            {base?.basic_info && (
                <section className={certificateDetailStyles.basicInfoSection}>
                    {/* 바깥: 카드(그림자/라운드/배경) */}
                    <div className={certificateDetailStyles.basicInfoCard}>
                        {/* 안쪽: 내용(접힘/펼침, 그라데이션) */}
                        <div
                            id="basic-info"
                            className={[
                                certificateDetailStyles.cardInner,
                                !open ? certificateDetailStyles.collapsed : '',
                                !open ? certificateDetailStyles.clamp2 : '',
                                !open ? certificateDetailStyles.noFade : '',
                                'certificate-content',
                            ].join(' ')}
                        >
                            <BasicInfoPanel data={base} />
                        </div>

                        {/* 펼치기/접기 버튼은 카드 안쪽 하단에 */}
                        <div className={certificateDetailStyles.expandBar}>
                            <button
                                className={CBTAnim.expandIconButton}
                                onClick={() => setOpen(v => !v)}
                                aria-expanded={open}
                                aria-controls="basic-info"
                                type="button"
                                title={open ? '접기' : '펼치기'}
                            >
                                {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                        </div>
                    </div>
                </section>
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
                                <div id="benefit-root" ref={benefitRef} className={`${certificateDetailStyles.benefitSection} certificate-content`}>
                                    <h2>우대현황</h2>
                                    {prefRows.length > 0
                                        ? <PreferencePanel data={prefData}/>
                                        : <div style={{color:'#6b7280',fontSize:14,padding:'10px 2px'}}>
                                                우대현황(법령) 데이터가 없습니다.
                                               </div>}
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
