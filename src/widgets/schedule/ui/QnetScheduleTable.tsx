// widgets/schedule/ui/QnetScheduleTable.tsx
import React from "react";
import type { RawItem } from '@/entities/certificate/model/types';
import { buildQnetGrid } from "../buildQnetGrid";
import { hasNonEmptyValue } from '@/widgets/common/utils/hasNonEmpty';
import { EmptyState } from '@/widgets/common/EmptyState';

type Props = { data: RawItem[] };

export const QnetScheduleTable: React.FC<Props> = ({ data }) => {
    const { headers, rows } = buildQnetGrid(data);

    if (!data || !hasNonEmptyValue(data)) {
        return <EmptyState message="등록된 시험일정이 없습니다." height={120} />;
    }


    return (
        <div className="qnet-table-wrap">
            <table className="qnet-table">
                <thead>
                <tr>
                    {headers.map((h) => (
                        <th key={h.id}>{h.title}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {rows.map((r, i) => (
                    <tr key={i}>
                        {headers.map((h) => (
                            <td key={h.id}>
                                {(r[h.id] ?? "—").split("\n").map((line, idx) => (
                                    <div key={idx}>{line}</div>
                                ))}
                            </td>
                        ))}
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
