// widgets/preference/adaptPreference.ts
type Dict = Record<string, unknown>;

export type PrefRow = {
    law: string;         // 우대법령
    articleText: string; // 조문 텍스트
    href?: string;       // 조문 상세 링크(법제처)
    usage?: string;      // 활용내용
};

const isDict = (v: unknown): v is Dict =>
    typeof v === "object" && v !== null && !Array.isArray(v);

// 값 → 문자열로 ‘강제’ 변환 (array/object도 안전 처리)
const toText = (v: unknown): string => {
    if (v == null) return "";
    if (typeof v === "string") return v.trim();
    if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(" ");
    if (isDict(v)) {
        const o = v as Dict;
        return toText(o.text ?? o.value ?? o.content ?? "");
    }
    return String(v);
};

// 배열/객체 모두 받아서 배열로
const asArray = (v: unknown): unknown[] => {
    if (Array.isArray(v)) return v;
    if (isDict(v)) return Object.values(v); // {0:{},1:{}} 형태까지 흡수
    return [];
};

const get = (o: Dict | null | undefined, k: string) =>
    (o && (o[k as keyof Dict] as unknown)) ?? undefined;

function pickCandidate(raw: unknown): Dict | null {
    if (!isDict(raw)) return null;
    // other_info가 있으면 우선
    if (isDict(get(raw, "other_info"))) return get(raw, "other_info") as Dict;
    // preference 바로 들어오는 버전도 흡수
    if (isDict(get(raw, "preference"))) return get(raw, "preference") as Dict;
    return raw;
}

function isLawDetailLink(href: string): boolean {
    try {
        const u = new URL(href);
        if (!/\.?law\.go\.kr$/i.test(u.hostname)) return false;
        const path = decodeURIComponent(u.pathname);
        if (!path.includes("/법령/")) return false;
        return /(제\s*\d+\s*조)/.test(path);
    } catch {
        return false;
    }
}

export function adaptPreference(raw: unknown): PrefRow[] {
    const src = pickCandidate(raw);
    if (!src) return [];

    // 1) 링크 맵 (text -> href)
    const linkArr = asArray(get(src, "링크"));
    const linkMap = new Map<string, string>();
    for (const it of linkArr) {
        if (!isDict(it)) continue;
        const href = toText(it.href);
        const text = toText(it.text);
        if (!href || !text) continue;
        if (!isLawDetailLink(href)) continue; // 법제처 조문 상세만
        if (!linkMap.has(text)) linkMap.set(text, href);
    }

    // 2) 우대법령 표 데이터
    const lawPref = isDict(get(src, "우대현황")) ? (get(src, "우대현황") as Dict) : null;

    // 필드명이 살짝 다른 케이스까지 함께 본다
    const lawList = asArray(get(lawPref, "법령우대") ?? get(lawPref, "법령우대현황"));

    const rows: PrefRow[] = [];
    for (const r of lawList) {
        if (!isDict(r)) continue;
        const articleText = toText(r["조문"]);
        const law = toText(r["법령명"]);
        const usage = toText(r["활용내용"] ?? r["활용내역"] ?? r["활용"]);
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
