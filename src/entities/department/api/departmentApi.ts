import { api } from "@/shared/api"
import { Department } from '../model/types';

export const getDepartmentList = async (): Promise<Department[]> => {
  const response = await api.get<Department[]>("/api/dept/list")
  return response.data
}