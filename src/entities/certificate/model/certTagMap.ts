export const certificateTags: Record<number, number[]> = {};
export const certificateNames: Record<number, string> = {};

export function loadCertTagMap(
    certs: Array<{ certificate_id: number; tag?: number[]; certificate_name:string;}>
) {
    for (const c of certs) {
        if (Array.isArray(c.tag)) {
            certificateTags[c.certificate_id] = c.tag;
            certificateNames[c.certificate_id] = c.certificate_name;
        }
    }
}