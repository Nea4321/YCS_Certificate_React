import { memo } from "react"
import type { CertData } from "@/entities/certificate/model"
import { certificateDetailStyles } from "../styles"
import { departmentDetailStyles } from "@/widgets"
import { CertificateCalendar } from "@/features/certificate/CertificateCalendar/CertificateCalendar.tsx"

interface CertificateDetailProps {
    certificate: CertData
}

export const CertificateDetail = memo(({ certificate }: CertificateDetailProps) => {
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

    const { css, html } = processContent(certificate.contents || "")

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
                <h1 className={certificateDetailStyles.title}>{certificate.certificate_name}</h1>
                <div className={certificateDetailStyles.category}>{certificate.infogb}</div>
            </div>

            <div className={certificateDetailStyles.content}>
                <section className={certificateDetailStyles.contentsSection}>
                    <h2>자격증 정보</h2>
                    <div
                        className={`${certificateDetailStyles.contents} certificate-content`}
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </section>

                <section className={departmentDetailStyles.calendarSection}>
                    <h2>자격증 시험 일정</h2>
                    {/* certificate_name를 통해서 해당 학과 자격증 구분 */}
                    <CertificateCalendar certificateName={certificate.certificate_name} />
                </section>
            </div>
        </div>
    )
})

CertificateDetail.displayName = "CertificateDetail"
