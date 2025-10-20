// widgets/basic-info/BasicInfoPanel.tsx
import { adaptBasicInfo, type InfoBlock } from './adaptBasicInfo';

// widgets/basic-info/BasicInfoPanel.tsx
function DlRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <>
            <div className="col-start-1 w-36 shrink-0 font-semibold text-gray-800 pr-4">
                {label}
            </div>
            <div className="col-start-2">
                {children}
            </div>
        </>
    );
}


function Block({ b }: { b: InfoBlock }) {
    switch (b.type) {
        case 'kv':
            return (
                <div className="not-prose grid grid-cols-[9rem,1fr] gap-y-2">
                    {b.items.map((it, i) => (
                        <DlRow key={i} label={it.key}>{it.value}</DlRow>
                    ))}
                </div>
            );

        // BasicInfoPanel.tsx - Block의 agency 케이스
        case 'agency':
            return (
                <div className="space-y-2">
                    {b.url && (
                        <>
                            <h4 className="font-semibold">실시기관 홈페이지</h4>
                            <p>
                                <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                                    {b.url}
                                </a>
                            </p>
                        </>
                    )}
                    {b.name && (
                        <>
                            <h4 className="font-semibold">실시기관명</h4>
                            <p>{b.name}</p>
                        </>
                    )}
                </div>
            );



        case 'table': {
            const keys = Object.keys(b.rows[0] ?? {});
            return (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border">
                        <thead className="bg-gray-50">
                        <tr>
                            {keys.map((k) => (
                                <th key={k} className="px-3 py-2 text-left border-b">{k}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {b.rows.map((row, i) => (
                            <tr key={i} className="odd:bg-white even:bg-gray-50">
                                {keys.map((k) => (
                                    <td key={k} className="px-3 py-2 border-b">{row[k]}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        case 'link':
            return (
                <a className="text-blue-600 underline" href={b.href} target="_blank" rel="noreferrer">
                    {b.label}
                </a>
            );

        case 'links':
            return (
                <ul className="list-disc pl-5">
                    {b.items.map((it, i) => (
                        <li key={i}>
                            <a className="text-blue-600 underline" href={it.href} target="_blank" rel="noreferrer">
                                {it.label}
                            </a>
                        </li>
                    ))}
                </ul>
            );

        case 'image':
            return (
                <figure>
                    <img src={b.url} alt={b.caption ?? ''} className="max-h-96 rounded border" />
                    {b.caption && <figcaption className="text-xs text-gray-500">{b.caption}</figcaption>}
                </figure>
            );

        case 'html':
            return <div dangerouslySetInnerHTML={{ __html: b.html }} />;

        case 'unknown':
        default:
            return (
                <pre className="bg-gray-50 p-3 rounded border text-xs overflow-auto">
          {JSON.stringify(b.raw, null, 2)}
        </pre>
            );
    }
}

type Dict = Record<string, unknown>;
const isDict = (v: unknown): v is Dict =>
    typeof v === 'object' && v !== null && !Array.isArray(v);

export function BasicInfoPanel({ data }: { data: unknown }) {
    const candidate = isDict(data) && 'basic_info' in data ? (data as Dict).basic_info : data;
    const blocks = adaptBasicInfo(candidate);
    return (
        <div className="rounded border p-4 space-y-6">
            {blocks.map((b, i) => <Block key={i} b={b} />)}
        </div>
    );
}