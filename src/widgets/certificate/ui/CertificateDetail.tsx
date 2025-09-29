// widgets/certificate/ui/CertificateDetail.tsx
import { memo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { CertData } from '@/entities/certificate/model';
import { certificateDetailStyles } from '../styles';
import { departmentDetailStyles } from '@/widgets';
import { certificateApi } from '@/entities/certificate/api/certificate-api';
import { getTagsForCert, tagColors } from '@/entities/certificate/model'; // ✅ 이 한 줄로 끝
import { CalendarWidget } from '@/widgets/calendar/ui/CalendarWidget';
import type { UiEvent } from '@/features/calendar/adapters';

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

        const processContent = (rawContent: string) => {
            if (!rawContent) return { css: '', html: '자격증 상세 정보가 없습니다.' };
            const content = rawContent
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'");
            const cssEndIndex = content.lastIndexOf('}');
            let css = '';
            let html = content;
            if (cssEndIndex !== -1) {
                css = content.substring(0, cssEndIndex + 1);
                html = content.substring(cssEndIndex + 1).trim();
            }
            html = html.replace(/<([^>]+)>/g, '<h3>$1</h3>');
            html = html.replace(/\s+/g, ' ').trim();
            html = html.replace(/- /g, '<br><br>• ');
            html = html.replace(/([.]) ([가-힣A-Z])/g, '$1<br><br>$2');
            return { css, html };
        };

        const raw = initialCertificate?.contents ?? certificate?.contents ?? '';
        const { css, html } = processContent(String(raw));

        // ✅ 태그 계산 (로컬 변수명 'tagList'로 충돌 방지)
        const cid = initialCertificate?.certificate_id ?? certificate?.certificate_id ?? null;
        const tagList: string[] = getTagsForCert(cid);

        const certName = certificate?.certificate_name ?? '';
        const category = certificate?.infogb ?? '';

        return (
            <div className={certificateDetailStyles.container}>
                {css && (
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
                        {tagList.map((tag: string) => (
                            <span
                                key={tag}
                                className={certificateDetailStyles.tag}
                                style={{ backgroundColor: tagColors[tag as keyof typeof tagColors] ?? '#eee' }}
                                onClick={() => navigate(`/search?keyword=${encodeURIComponent('#' + tag)}`)}
                            >
                #{tag}
              </span>
                        ))}
                    </div>
                </div>

                <section className={departmentDetailStyles.calendarSection}>
                    <h2>자격증 시험 일정</h2>
                    <CalendarWidget events={calendarEvents} loading={calendarLoading} certName={certName || undefined} />
                </section>

                <div className={certificateDetailStyles.content}>
                    <section className={certificateDetailStyles.contentsSection}>
                        <h2>자격증 정보</h2>
                        <div
                            className={`${certificateDetailStyles.contents} certificate-content`}
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    </section>
                </div>
            </div>
        );
    }
);

CertificateDetail.displayName = 'CertificateDetail';
