export type Dict = Record<string, unknown>;

export const isDict = (v: unknown): v is Dict =>
    typeof v === 'object' && v !== null && !Array.isArray(v);

export const get = <T = unknown>(obj: Dict, key: string): T | undefined =>
    (obj[key] as T | undefined);

export const toHtml = (v: unknown) =>
    typeof v === 'string' ? v.replace(/\n/g, '<br/>') : '';
