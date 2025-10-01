import { memo, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { CertData } from "@/entities/certificate/model"
import { certificateDetailStyles } from "../styles"
import { certificateApi } from "@/entities"
import { certificateTags } from "@/entities/certificate"
import { getTagName, getTagColor } from "@/entities/certificate/model/tagMeta";
import { CalendarWidget } from "@/widgets/calendar/ui/CalendarWidget.tsx"

/**CertificateDetail에 전달할 props
 *
 * @property {CertData} certificate - 부모(Certificate.tsx)에게 전달받은 사용자가 선택한 자격증의 정보 객체
 * 전달되지 않은 경우 URL 파라미터의 id를 사용해 내부에서 데이터 로드
 */
interface CertificateDetailProps {
    certificate: CertData
}

/**자격증 상세 페이지 컴포넌트
 *
 * - 사용자가 선택한 자격증의 id를 사용해 해당 자격증의 데이터를 로드한다
 * - 이후 전달받은 데이터를 CertificateDetail이 배치한다
 * - 전달받은 데이터를 사용해 해당 자격증의 관련 태그를 표시할 수 있으며
 *   해당하는 자격증의 시험 일정을 보여주는 캘린더를 배치한다
 * - 하단에 자격증 정보 존재
 *
 * @param {CertificateDetailProps} props - 컴포넌트에 전달되는 props
 * @param {CertData} props.certificate - 자격증 데이터 객체
 *
 * @component*/
export const CertificateDetail = memo(({ certificate: initialCertificate }: CertificateDetailProps) => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [certificate, setCertificate] = useState<CertData | null>(initialCertificate ?? null)

    useEffect(() => {
        if (!id || initialCertificate) return
        certificateApi.getCertData(Number(id)).then(setCertificate)
    }, [id, initialCertificate])

    const processContent = (rawContent: string) => {
        if (!rawContent) return { css: "", html: "자격증 상세 정보가 없습니다." }

        const content = rawContent
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")

        const cssEndIndex = content.lastIndexOf("}")
        let css = ""
        let html = content

        if (cssEndIndex !== -1) {
            css = content.substring(0, cssEndIndex + 1)
            html = content.substring(cssEndIndex + 1).trim()
        }

        html = html.replace(/<([^>]+)>/g, "<h3>$1</h3>")
        html = html.replace(/\s+/g, " ").trim()
        html = html.replace(/- /g, "<br><br>• ")
        html = html.replace(/([.]) ([가-힣A-Z])/g, "$1<br><br>$2")

        return { css, html }
    }

    const { css, html } = processContent(certificate?.contents || "")
    const base = certificate ?? initialCertificate;
    const tagIds = base ? (certificateTags[base.certificate_id] ?? []) : [];


    return (
        <div className={certificateDetailStyles.container}>
            {css && (
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
              .certificate-content {
                font-size: 1.1em;
                font-family: "Malgun Gothic", system-ui, sans-serif;
                color: var(--text-color);
                line-height: 1.8;
              }
              .certificate-content h3 {
                color: var(--primary-color);
                font-size: 1.3em;
                font-weight: bold;
                margin: 1.5em 0 1em 0;
                padding: 10px 15px;
                background-color: var(--certificate-bg);
                border-left: 4px solid var(--primary-color);
                border-radius: 4px;
              }
              .certificate-content p {
                margin-bottom: 1em;
                line-height: 1.8;
              }
              .certificate-content br + br {
                display: block;
                margin: 0.5em 0;
              }
            `,
                    }}
                />
            )}

            <div className={certificateDetailStyles.header}>
                <h1 className={certificateDetailStyles.title}>{certificate?.certificate_name}</h1>
                <div className={certificateDetailStyles.category}>{certificate?.infogb}</div>
                {/* 태그 박스 추가 */}
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
                <CalendarWidget certificateName={certificate?.certificate_name || ""} />
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
    )
})

CertificateDetail.displayName = "CertificateDetail"
