// ---- 공통 타입 & 유틸 ----
export type Dict = Record<string, unknown>;
export const isDict = (v: unknown): v is Dict =>
    typeof v === 'object' && v !== null && !Array.isArray(v);

// 값이 하나라도 의미 있으면 true
export const hasNonEmptyValue = (v: unknown): boolean => {
    if (v == null) return false;

    if (typeof v === 'string') {
        return v.trim() !== '';
    }
    if (typeof v === 'number' || typeof v === 'boolean') {
        return true;
    }
    if (Array.isArray(v)) {
        return v.some(hasNonEmptyValue);
    }
    if (isDict(v)) {
        return Object.values(v).some(hasNonEmptyValue);
    }
    // 기타 타입은 일단 “뭔가 있다”라고 판단
    return true;
};