// widgets/schedule/ui/QnetScheduleTable.tsx
import React from 'react';
import { buildQnetGrid, QnetGridRow, RawItem } from '../buildQnetGrid';

type Props = { data: RawItem[] };

const RegCell: React.FC<{ main?: string|null; extra?: string|null }> = ({ main, extra }) => (
    <td>
        {main ?? '-'}
        {extra ? (
            <>
                <br />
                <span style={{ opacity: .75 }}>추가접수: {extra}</span>
            </>
        ) : null}
    </td>
);

export const QnetScheduleTable: React.FC<Props> = ({ data }) => {
    const rows: QnetGridRow[] = buildQnetGrid(data);

    return (
        <div className="qnet-table-wrap">
            <table className="qnet-table">
                <thead>
                <tr>
                    <th style={{minWidth:120}}>구분(회차)</th>
                    <th>필기원서접수(휴일제외)</th>
                    <th>필기시험</th>
                    <th>필기합격(예정자)발표</th>
                    <th>실기원서접수(휴일제외)</th>
                    <th>실기시험</th>
                    <th>최종합격자 발표</th>
                </tr>
                </thead>
                <tbody>
                {rows.map((r, i) => (
                    <tr key={i}>
                        <td style={{fontWeight:600}}>{r.round}</td>

                        {/* 필기 */}
                        <RegCell main={r.docReg}  extra={r.docRegExtra} />
                        <td>{r.docExam ?? '-'}</td>
                        <td>{r.docPass ?? '-'}</td>

                        {/* 실기 */}
                        <RegCell main={r.pracReg} extra={r.pracRegExtra} />
                        <td>{r.pracExam ?? '-'}</td>
                        <td>{r.pracPass ?? '-'}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <style>{`
        .qnet-table-wrap{width:100%;overflow:auto}
        .qnet-table{width:100%;border-collapse:collapse}
        .qnet-table th,.qnet-table td{
          padding:10px 12px;border-bottom:1px solid #e6e6ea;text-align:left;white-space:nowrap
        }
        .qnet-table thead th{background:#fafafb;border-top:1px solid #e6e6ea}
      `}</style>
        </div>
    );
};
