import React from 'react';
import type { ExamInfoDto} from '@/entities/certificate/model/types';


export const ExamInfoBlocks: React.FC<{ data?: ExamInfoDto }> = ({ data }) => {
    if (!data) return null;

    const docFee = data.fee?.doc ?? '';
    const pracFee = data.fee?.prac ?? '';
    const showFee = Boolean(docFee || pracFee);

    return (
        <div className="certificate-content">
            {/* 수수료 */}
            {showFee && (
                <>
                    <h3>수수료</h3>
                    <table className="qnet-table">
                        <thead>
                        <tr><th>필기</th><th>실기</th></tr>
                        </thead>
                        <tbody>
                        <tr><td>{docFee || '-'}</td><td>{pracFee || '-'}</td></tr>
                        </tbody>
                    </table>
                </>
            )}

            {/* 출제경향/범위 */}
            {data.scope_html && (
                <>
                    <h3>출제경향</h3>
                    <div dangerouslySetInnerHTML={{ __html: data.scope_html }} />
                </>
            )}

            {/* 취득방법 / 시험방법 */}
            {data.method_html && (
                <>
                    <h3>취득방법</h3>
                    <div dangerouslySetInnerHTML={{ __html: data.method_html }} />
                </>
            )}

            {/* 응시기준 */}
            {data.criteria_html && (
                <>
                    <h3>응시기준</h3>
                    <div dangerouslySetInnerHTML={{ __html: data.criteria_html }} />
                </>
            )}

            {/* 출제기준 링크 목록 */}
            {data.standard_more && (   // ← (기존) (data.standard_list?.length || data.standard_more) 에서 변경
                <>
                    <h3>출제기준</h3>
                    <ul className="std-list">
                        <li>
                            <a
                                href={data.standard_more.href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="큐넷 출제기준 원문 보기 (새 창)"
                            >
                                {/* 기존 label 대신 깔끔한 문구 */}
                                큐넷 출제기준 원문 보기
                            </a>
                        </li>
                    </ul>
                </>
            )}


            <style>{`
        .certificate-content h3{margin:24px 0 10px;font-size:1.1rem}
        .qnet-table{width:100%;border-collapse:collapse;margin-top:6px}
        .qnet-table th,.qnet-table td{padding:10px 12px;border:1px solid #e6e6ea;text-align:left}
        .qnet-table thead th{background:#fafafb}
        .std-list{margin:6px 0 0 18px}
        .std-list li{list-style:disc; margin:6px 0}
      `}</style>
        </div>
    );
};
