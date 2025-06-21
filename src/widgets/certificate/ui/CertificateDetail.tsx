import { memo } from "react"
import type { CertData } from "@/entities/certificate/model"
import { certificateDetailStyles } from "../styles"

interface CertificateDetailProps {
    certificate: CertData
}

export const CertificateDetail = memo(({ certificate }: CertificateDetailProps) => {
    // CSS와 HTML 콘텐츠를 분리하고 처리하는 함수
    const processContent = (rawContent: string) => {
        if (!rawContent) return { css: "", html: "자격증 상세 정보가 없습니다." }

        // HTML 엔티티 디코딩
        const content = rawContent
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")

        // CSS 부분과 HTML 부분 분리
        const cssEndIndex = content.lastIndexOf("}")

        let css = ""
        let html = content

        if (cssEndIndex !== -1) {
            css = content.substring(0, cssEndIndex + 1)
            html = content.substring(cssEndIndex + 1).trim()
        }

        // HTML 태그로 감싸기 (제목 부분 처리)
        html = html.replace(/<([^>]+)>/g, "<h3>$1</h3>")

        // 줄바꿈을 <br>로 변환하되, 연속된 공백 처리
        html = html.replace(/\s+/g, " ").trim()

        // 문단 구분 (- 로 시작하는 부분을 리스트로)
        html = html.replace(/- /g, "<br><br>• ")

        // 긴 텍스트를 문단으로 나누기
        html = html.replace(/([.]) ([가-힣A-Z])/g, "$1<br><br>$2")

        return { css, html }
    }

    const { css, html } = processContent(certificate.contents || "")

    return (
        <div className={certificateDetailStyles.container}>
            {/* CSS 스타일을 동적으로 추가 */}
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
            </div>
        </div>
    )
})

CertificateDetail.displayName = "CertificateDetail"
