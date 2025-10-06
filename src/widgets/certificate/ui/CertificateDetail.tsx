// widgets/certificate/ui/CertificateDetail.tsx
import { memo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { CertData } from '@/entities/certificate/model';
import { certificateDetailStyles } from '../styles';
import { certificateApi } from '@/entities/certificate/api/certificate-api';
import {getTagName, getTagColor } from "@/entities/certificate/model/tagMeta";
import { CalendarWidget } from '@/widgets/calendar/ui/CalendarWidget';
import { certificateTags } from "@/entities/certificate"
import type { UiEvent } from '@/features/calendar/model/adapters.ts';

interface CertificateDetailProps {
    certificate?: CertData | null;
    calendarEvents: UiEvent[];
    calendarLoading?: boolean;
}

export const CertificateDetail = memo(
    ({ certificate: initialCertificate, calendarEvents, calendarLoading }: CertificateDetailProps) => {
        const navigate = useNavigate();
        const { id } = useParams();
        const [certificate, setCertificate] = useState<CertData | null>(initialCertificate ?? null);

        useEffect(() => {
            if (!id || initialCertificate) return;
            certificateApi.getCertData(Number(id)).then(setCertificate);
        }, [id, initialCertificate]);



        // ✅ 태그 계산 (로컬 변수명 'tagList'로 충돌 방지)
        //const cid = initialCertificate?.certificate_id ?? certificate?.certificate_id ?? null;
        //const tagList: string[] = getTagsForCert(cid);

        const base = certificate ?? initialCertificate;
        const tagIds = base ? (certificateTags[base.certificate_id] ?? []) : [];

        const certName = certificate?.certificate_name ?? '';
        const category = certificate?.infogb ?? '';

        return (
            <div className={certificateDetailStyles.container}>
                { (
                    <style
                        dangerouslySetInnerHTML={{
                            __html: `
              .certificate-content{font-size:1.1em;line-height:1.8}
              .certificate-content h3{font-size:1.3em;font-weight:bold;margin:1.5em 0 1em}
            `,
                        }}
                    />
                )}

                <div className={certificateDetailStyles.header}>
                    <h1 className={certificateDetailStyles.title}>{certName}</h1>
                    <div className={certificateDetailStyles.category}>{category}</div>
                    <div className={certificateDetailStyles.tagBox}>
                        {tagIds.map((id) => {
                            const name = getTagName(id);
                            if (!name) return null;// 메타에 없으면 스킵(안전)
                            const color = getTagColor(id) ?? "#64748B";// fallback
                            return (
                                <span
                                    key={id}
                                    className={certificateDetailStyles.tag}
                                    style={{ backgroundColor: color }}
                                    onClick={() =>
                                        navigate(`/search?keyword=${encodeURIComponent("#" + name)}`)
                                    }>
                                #{name}</span>
                            );
                        })}
                    </div>
                </div>

                <section className={certificateDetailStyles.calendarSection}>
                    <h2>자격증 시험 일정</h2>
                    <CalendarWidget events={calendarEvents} loading={calendarLoading} certName={certName || undefined} />
                </section>

                <div className={certificateDetailStyles.content}>
                    <section className={certificateDetailStyles.contentsSection}>
                        <h2>자격증 정보</h2>
                        <div
                            className={`${certificateDetailStyles.contents} certificate-content`}
                        />
                    </section>
                </div>
            </div>
        );
    }
);

CertificateDetail.displayName = 'CertificateDetail';