import { axiosApi } from "@/shared/api/axios-api.ts";
import { Department, DeptMapData, DeptList, DeptMap, Faculty, Major } from '@/entities';

export const departmentApi = {

  getFaculty: async (signal?: AbortSignal): Promise<Faculty> => {
    const response = await axiosApi.get<Faculty>("/api/dept/faculty", { signal })
    return response.data
  },

  getDepartment: async (signal?: AbortSignal): Promise<Department> => {
    const response = await axiosApi.get<Department>("/api/dept/department", { signal })
    return response.data
  },

  getMajor: async (signal?: AbortSignal): Promise<Major> => {
    const response = await axiosApi.get<Major>("/api/dept/major", { signal })
    return response.data
  },

  getDeptMap: async (signal?: AbortSignal): Promise<DeptMap[]> => {
    const response = await axiosApi.get<DeptMap[]>("/api/dept/map", { signal })
    return response.data
  },

  getDeptList: async (signal?: AbortSignal): Promise<DeptList[]> => {
    const response = await axiosApi.get<DeptList[]>("/api/dept/list", { signal })
    return response.data
  },

  getDeptMapData: async (signal?: AbortSignal): Promise<DeptMapData[]> => {
    const response = await axiosApi.get<DeptMapData[]>("/api/dept/data", { signal })
    return response.data
  }

}