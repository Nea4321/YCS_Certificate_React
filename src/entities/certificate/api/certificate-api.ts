import { axiosApi } from "@/shared/api/axios-api.ts";
import { Certificate, CertData } from '@/entities';

export const certificateApi = {
    
    getCertificate: async (signal?: AbortSignal): Promise<Certificate[]> => {
        const response = await axiosApi.get<Certificate[]>("/api/cert/list", { signal })
        return response.data
    },

    getCertData: async (id: number, signal?: AbortSignal): Promise<CertData> => {
        const response = await axiosApi.get<CertData>(`/api/cert/data/${id}`, { signal })
        return response.data
    },

}
