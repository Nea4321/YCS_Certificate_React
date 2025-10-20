// src/entities/certificate/api/certificate-api.ts
import { axiosApi } from '@/shared/api/axios-api';
import type { Certificate, CertificateData, Schedule, Tag, Organization } from "@/entities/certificate/model/types";
// CertData export 되어있어야 합니다.

export const certificateApi = {
    // 자격증 리스트 (기존)
    async getCertificate(signal?: AbortSignal): Promise<Certificate[]> {
        const res = await axiosApi.get<Certificate[]>('/api/cert/list', { signal });
        return res.data;
    },

    async getSchedule(ids: number[], signal?: AbortSignal): Promise<Schedule[]> {
        const query = ids.map(id => `id=${id}`).join('&');
        const res = await axiosApi.get<Schedule[]>(`/api/cert/schedule?${query}`, { signal });
        return res.data;
    },

    async getTags(signal?: AbortSignal): Promise<Tag[]> {
        const res = await axiosApi.get<Tag[]>('/api/cert/tag', { signal });
        return res.data;
    },

    async getOrganization(signal?: AbortSignal): Promise<Organization[]> {
        const res = await axiosApi.get<Organization[]>('/api/cert/organization', { signal });
        return res.data;
    },

    // 일정(분할)
    // async getSchedule(id: number, signal?: AbortSignal): Promise<ScheduleEventsDto> {
    //     const res = await axiosApi.get<ScheduleEventsDto>(`/api/certificates/${id}/schedule`, { signal });
    //     return res.data;
    // },

    async getCertData(id: number, signal?: AbortSignal): Promise<CertificateData> {
        const res = await axiosApi.get<CertificateData>(`/api/cert/data/${id}`, { signal });
        return res.data;
    },

    // ===== 아직 백엔드 미구현/미확정이면 주석 처리 =====
    // async getCertPublicView(id: number, signal?: AbortSignal) {
    //   const res = await axiosApi.get(`/api/certificates/${id}/public`, { signal });
    //   return res.data;
    // },
    // async getExamInfo(id: number, signal?: AbortSignal) { ... },
    // async getBasicInfo(id: number, signal?: AbortSignal) { ... },
    // async getPreference(id: number, signal?: AbortSignal) { ... },

    // (레거시) 필요할 때만
    // async getCertData(id: number, signal?: AbortSignal) {
    //   const res = await axiosApi.get(`/api/cert/data/${id}`, { signal });
    //   return res.data;
    // },
};
