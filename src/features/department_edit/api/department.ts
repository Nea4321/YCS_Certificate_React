import type {Department, DepartmentFormData} from "../types/department"

// Mock data for testing
const mockData: Department[] = [
    {
        parent_id: 1,
        parent_name: "공과대학",
        parent_type: "학부",
        child: [
            { child_id: 1, child_name: "컴퓨터공학과", child_type: "학과" },
            { child_id: 2, child_name: "전자공학과", child_type: "학과" },
            { child_id: 3, child_name: "AI전공", child_type: "전공" },
            { child_id: 4, child_name: "소프트웨어전공", child_type: "전공" },
        ],
    },
    {
        parent_id: 2,
        parent_name: "경영대학",
        parent_type: "학부",
        child: [
            { child_id: 5, child_name: "경영학과", child_type: "학과" },
            { child_id: 6, child_name: "회계학과", child_type: "학과" },
            { child_id: 7, child_name: "마케팅전공", child_type: "전공" },
        ],
    },
    {
        parent_id: 3,
        parent_name: "인문대학",
        parent_type: "학부",
        child: [
            { child_id: 8, child_name: "국어국문학과", child_type: "학과" },
            { child_id: 9, child_name: "영어영문학과", child_type: "학과" },
            { child_id: 10, child_name: "문학전공", child_type: "전공" },
        ],
    },
]

const currentData = [...mockData]

export const departmentApi = {
    getDeptList: async (): Promise<Department[]> => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        return [...currentData]
    },

    addDepartment: async (data: {
        faculty?: string;
        department?: string;
        major?: string;
        parentId: number | undefined
    }): Promise<void> => {
        await new Promise((resolve) => setTimeout(resolve, 300))
        // Mock implementation - in real app this would call backend
        console.log("Adding department:", data)
    },

    updateDepartment: async (id: number, data: Partial<DepartmentFormData>): Promise<void> => {
        await new Promise((resolve) => setTimeout(resolve, 300))
        // Mock implementation
        console.log("Updating department:", id, data)
    },

    deleteDepartment: async (id: number): Promise<void> => {
        await new Promise((resolve) => setTimeout(resolve, 300))
        // Mock implementation
        console.log("Deleting department:", id)
    },
}
