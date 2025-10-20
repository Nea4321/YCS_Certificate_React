// widgets/preference/PreferencePanel.tsx
import { adaptPreference } from "./adaptPreference";

export function PreferencePanel({ data }: { data: unknown }) {
    const rows = adaptPreference(data);
    if (!rows.length) return null;

    return (
        <div className="qpref-wrap">
            <style>{CSS}</style>
            <div className="qpref-scroll">
                <table className="qpref">
                    <colgroup>
                        <col style={{ width: 280 }} />
                        <col style={{ width: 420 }} />
                        <col />
                    </colgroup>
                    <thead>
                    <tr>
                        <th>우대법령</th>
                        <th>조문내역(하이퍼링크)</th>
                        <th>활용내용</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((r, i) => (
                        <tr key={i}>
                            <td className="txt">{r.law || "-"}</td>
                            <td className="txt break">
                                {r.href ? (
                                    <a
                                        href={r.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="plink"         // ← 텍스트처럼 보이는 링크
                                        title={r.href}
                                    >
                                        {r.articleText || r.href}
                                    </a>
                                ) : (
                                    r.articleText || "-"
                                )}
                            </td>
                            <td className="txt">{r.usage || "-"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const CSS = `
.qpref-wrap{ margin-top:16px; }
.qpref-scroll{ overflow:auto; border:1px solid #e5e7eb; border-radius:8px; }
.qpref{ width:100%; min-width:760px; border-collapse:collapse; table-layout:fixed; font-size:14px; }
.qpref thead th{ background:#f6f8fb; color:#111827; border-bottom:1px solid #e5e7eb; padding:12px 14px; text-align:center;  font-weight:700; }
.qpref td, .qpref th{ border-bottom:1px solid #eef0f3; padding:10px 14px; vertical-align:top; }
.qpref tbody tr:nth-child(even) td{ background:#fcfcfd; }
.qpref td.txt{ white-space:pre-wrap; }
.qpref td.break{ word-break:break-word; }

/* 텍스트처럼 보이는 하이퍼링크 */
.qpref a.plink{
  color: inherit;                /* 주변 텍스트 색상과 동일 */
  text-decoration: none;         /* 밑줄 제거 */
  cursor: pointer;
}
.qpref a.plink:hover{ text-decoration: underline; }   /* 호버 시만 밑줄 */
.qpref a.plink:focus{
  outline: 2px dashed #93c5fd;   /* 키보드 포커스 표시 */
  outline-offset: 2px;
}
.qpref a.plink:visited{ color: inherit; }             /* 방문 후에도 색 유지 */
`;
