export interface Certificate {
    certificate_id: number,
    certificate_name: string,
    jmcd: string,
    category?: string
}

export interface CertData {
    certificate_id: number,
    certificate_name: string,
    infogb: string,
    contents: string
}