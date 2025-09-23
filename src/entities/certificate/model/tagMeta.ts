export interface TagMeta {
    id: number;
    name: string;
    color: string;
}

export const tagMetaList: TagMeta[] = [
    // ── 기술/공학 (보라·그린·브라운 톤) ─────────────────
    { id: 1, name: "IT", color: "#7C3AED" },
    { id: 2, name: "전기", color: "#EAB308" },
    { id: 3, name: "전자", color: "#FB923C" },
    { id: 4, name: "기계", color: "#334155" },
    { id: 5, name: "제조", color: "#047857" },
    { id: 6, name: "설비", color: "#475569" },
    { id: 7, name: "재료", color: "#4338CA" },
    { id: 8, name: "금형", color: "#1F2937" },
    { id: 9, name: "화학", color: "#0D9488" },

    // ── 안전/에너지 ─────────────────────────────────────
    { id: 10, name: "안전", color: "#B45309" },
    { id: 11, name: "소방", color: "#DC2626" },
    { id: 12, name: "에너지", color: "#EA580C" },

    // ── 환경/농림/조경 ──────────────────────────────────
    { id: 13, name: "환경", color: "#14532D" },
    { id: 14, name: "농업", color: "#4D7C0F" },
    { id: 15, name: "축산", color: "#3F6212" },
    { id: 16, name: "조경", color: "#15803D" },

    // ── 운송/교통 ────────────────
    { id: 17, name: "운송", color: "#1D4ED8" },
    { id: 18, name: "철도", color: "#172554" },
    { id: 19, name: "항공", color: "#38BDF8" },
    { id: 20, name: "물류", color: "#2563EB" },

    // ── 경영/서비스 ────────────────
    { id: 21, name: "경영", color: "#A16207" },
    { id: 22, name: "부동산", color: "#CA8A04" },
    { id: 23, name: "보험", color: "#6B21A8" },
    { id: 24, name: "기획", color: "#059669" },
    { id: 25, name: "서비스", color: "#64748B" },

    // ── 인문/사회/문화 ────────────────
    { id: 26, name: "교육", color: "#0F766E" },
    { id: 27, name: "심리", color: "#0C4A6E" },
    { id: 28, name: "언어", color: "#9333EA" },
    { id: 29, name: "문화재", color: "#65A30D" },
    { id: 30, name: "예술", color: "#C026D3" },
    { id: 31, name: "보건", color: "#10B981" },

    // ── 식품/조리 ────────────────
    { id: 32, name: "식품", color: "#F97316" },
    { id: 33, name: "조리", color: "#92400E" },

    // ── 법/보안 ────────────────
    { id: 34, name: "법", color: "#1E3A8A" },
    { id: 35, name: "보안", color: "#BE123C" },

    // ── 디자인/인쇄출판 ────────────────
    { id: 36, name: "디자인", color: "#F59E0B" },
    { id: 37, name: "인쇄출판", color: "#3F3F46" },

    // ── 관광/해양 ────────────────
    { id: 38, name: "관광", color: "#6366F1" },
    { id: 39, name: "해양", color: "#0284C7" },

    // ── 건설/건축/측량 ────────────────
    { id: 40, name: "건설", color: "#44403C" },
    { id: 41, name: "건축", color: "#16A34A" },
    { id: 42, name: "측량", color: "#374151" },

    // ── 미용/스포츠 ────────────────
    { id: 43, name: "미용", color: "#E879F9" },
    { id: 44, name: "스포츠", color: "#7E22CE" },
];

// 빠른 조회용 룩업 맵
// 태그의 이름과 색상을 동시에 써야 할 때
export const tagById: Record<number, TagMeta> =
    Object.fromEntries(tagMetaList.map(t => [t.id, t])) as Record<number, TagMeta>;

//태그를 이름으로 입력할 때 ID기반으로 변환
export const tagIdByName: Record<string, number> =
    Object.fromEntries(tagMetaList.map(t => [t.name, t.id]));

// 태그 리스트 및 카드에서 색상만 필요해 렌더 빈도가 높을 때
export const tagColorById: Record<number, string> =
    Object.fromEntries(tagMetaList.map(t => [t.id, t.color]));

// 헬퍼
export const getTagMeta = (id: number) => tagById[id];
export const getTagName = (id: number) => tagById[id]?.name;
export const getTagColor = (id: number) => tagColorById[id];