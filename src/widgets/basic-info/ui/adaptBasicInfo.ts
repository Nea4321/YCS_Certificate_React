// widgets/basic-info/adaptBasicInfo.ts
export type KvItem   = { key: string; value: string };
export type LinkItem = { href: string; label: string };

export type InfoBlock =
    | { type: 'kv';     items: KvItem[] }
    | { type: 'table';  rows: Array<Record<string, string>> }
    | { type: 'link';   href: string; label: string }
    | { type: 'links';  items: LinkItem[] }
    | { type: 'html';   html: string }
    | { type: 'image';  url: string; caption?: string }
    | { type: 'agency'; name?: string; url?: string }
    | { type: 'unknown'; raw: unknown };

type Dict = Record<string, unknown>;
type ImageLike = { url?: string; caption?: string };
type TableLike = { rows?: Array<Record<string, string>> };

const isDict = (v: unknown): v is Dict =>
    typeof v === 'object' && v !== null && !Array.isArray(v);

const toStr = (v: unknown) => (typeof v === 'string' ? v : String(v ?? ''));

function normalizeAgency(input: unknown): { type: 'agency'; name?: string; url?: string } | null {
    if (!input) return null;

    if (typeof input === 'string') {
        const url = input.match(/https?:\/\/[^\s]+/i)?.[0];
        const name = input.replace(/https?:\/\/[^\s]+/g, '').replace(/홈페이지[:：]?\s*/g, '').trim();
        return name || url ? { type: 'agency', name: name || undefined, url: url || undefined } : null;
    }

    if (isDict(input)) {
        const name = toStr(input['기관명'] ?? input['name'] ?? '').trim();
        const url  = toStr(input['홈페이지'] ?? input['홈페이지주소'] ?? input['url'] ?? '').trim();
        return name || url ? { type: 'agency', name: name || undefined, url: url || undefined } : null;
    }
    return null;
}

export function adaptBasicInfo(raw: unknown): InfoBlock[] {
    if (!isDict(raw)) return [];

    const clean: Dict = { ...raw };

    // 기본정보에서 제외(별도 패널)
    delete clean['종목별검정현황' as keyof Dict];
    delete clean['종목별 검정현황' as keyof Dict];

    const blocks: InfoBlock[] = [];

    // 본문(제목 굵게는 h4로 처리됨)
    const groups: Array<{ label: string; keys: string[] }> = [
        { label: '개요',          keys: ['개요'] },
        { label: '수행직무',      keys: ['수행직무', '수행 직무'] },
        { label: '진로 및 전망',  keys: ['진로전망', '진로및전망', '진로 및 전망'] },
    ];
    for (const g of groups) {
        const key = g.keys.find((k) => typeof clean[k as keyof Dict] === 'string' && (clean[k as keyof Dict] as string).trim());
        if (!key) continue;
        const v = clean[key as keyof Dict] as string;
        blocks.push({ type: 'html', html: `<h4 class="font-medium mb-1">${g.label}</h4><p>${v}</p>` });
        delete clean[key as keyof Dict];
    }

    if ('실시기관' in clean) {
        const agency = normalizeAgency((clean as Dict)['실시기관']);
        if (agency) blocks.push(agency);        // ← 전용 블록으로 푸시
        delete (clean as Dict)['실시기관'];
    }


    // 그 외 kv 후보
    const kvPairs: KvItem[] = [];
    for (const [k, v] of Object.entries(clean)) {
        if (typeof v === 'string' && k.length <= 16 && !/^https?:\/\//i.test(v)) {
            kvPairs.push({ key: k, value: v });
        }
    }
    if (kvPairs.length >= 2) blocks.push({ type: 'kv', items: kvPairs });

    // 링크 모음
    if (Array.isArray((clean as Dict).links)) {
        const arr = (clean as Dict).links as unknown[];
        const items = arr
            .filter((x): x is Dict => isDict(x) && typeof x.href === 'string')
            .map((x) => ({ href: toStr(x.href), label: toStr(x.label ?? '링크') }));
        if (items.length) blocks.push({ type: 'links', items });
    }

    // 5) 이미지 / 테이블
    if (isDict((clean as Dict).image)) {
        const img = (clean as Dict).image as ImageLike;
        if (typeof img.url === 'string') {
            blocks.push({
                type: 'image',
                url: img.url,
                caption: typeof img.caption === 'string' ? img.caption : undefined,
            });
        }
        delete (clean as Dict).image;
    }

    if (isDict((clean as Dict).table)) {
        const tbl = (clean as Dict).table as TableLike;
        if (Array.isArray(tbl.rows)) {
            blocks.push({ type: 'table', rows: tbl.rows as Array<Record<string, string>> });
        }
        delete (clean as Dict).table;
    }


    if (!blocks.length) blocks.push({ type: 'unknown', raw });
    return blocks;
}
