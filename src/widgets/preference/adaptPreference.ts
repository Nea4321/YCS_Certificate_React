// widgets/preference/adaptPreference.ts
type Dict = Record<string, unknown>;

export type PrefRow = {
    law: string;         // 우대법령 (법령명)
    articleText: string; // 조문 텍스트
    href?: string;       // 하이퍼링크 (있으면 링크)
    usage?: string;      // 활용내용
};

const isDict = (v: unknown): v is Dict =>
    typeof v === "object" && v !== null && !Array.isArray(v);

const get = (o: Dict, k: string) => o[k as keyof Dict];

function pickCandidate(raw: unknown): Dict | null {
    if (!isDict(raw)) return null;
    if (isDict(get(raw, "other_info") as unknown)) return get(raw, "other_info") as Dict;
    return raw;
}

function isLawDetailLink(href: string): boolean {
    try {
        const u = new URL(href);
        if (!/\.?law\.go\.kr$/i.test(u.hostname)) return false;
        if (!decodeURIComponent(u.pathname).includes("/법령/")) return false;
        // 조문 형태가 들어간 링크만 (제xx조)
        return /(제\s*\d+\s*조)/.test(decodeURIComponent(u.pathname));
    } catch {
        return false;
    }
}

export function adaptPreference(raw: unknown): PrefRow[] {
    const src = pickCandidate(raw);
    if (!src) return [];

    // 1) 링크 맵 (text -> href)
    const linkArr = Array.isArray(get(src, "링크"))
        ? (get(src, "링크") as unknown[])
        : [];

    const linkMap = new Map<string, string>();
    for (const it of linkArr) {
        if (!isDict(it)) continue;
        const href = typeof it.href === "string" ? it.href : "";
        const text = typeof it.text === "string" ? it.text.trim() : "";
        if (!href || !text) continue;
        if (!isLawDetailLink(href)) continue; // q-net 등 불필요 링크 자동 제거
        if (!linkMap.has(text)) linkMap.set(text, href);
    }

    // 2) 우대법령 표 데이터 조립
    const lawPref = isDict(get(src, "우대현황") as unknown)
        ? (get(src, "우대현황") as Dict)
        : null;

    const lawList = Array.isArray(lawPref?.["법령우대"])
        ? (lawPref!["법령우대"] as unknown[])
        : [];

    const rows: PrefRow[] = [];
    for (const r of lawList) {
        if (!isDict(r)) continue;
        const articleText = typeof r["조문"] === "string" ? r["조문"].trim() : "";
        const law = typeof r["법령명"] === "string" ? r["법령명"].trim() : "";
        const usage = typeof r["활용내용"] === "string" ? r["활용내용"].trim() : "";
        if (!articleText && !law && !usage) continue;

        rows.push({
            law,
            articleText,
            href: articleText ? linkMap.get(articleText) : undefined,
            usage,
        });
    }

    return rows;
}
