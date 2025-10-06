export const addDays = (d: Date, n: number): Date => {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
};

export const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = ('0' + (date.getMonth() + 1)).slice(-2);
    const d = ('0' + date.getDate()).slice(-2);
    return `${y}-${m}-${d}`;
};

export const startOfMonth = (d: Date): Date => {
    return new Date(d.getFullYear(), d.getMonth(), 1);
};

export const sameMonth = (a: Date, b: Date): boolean => {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
};