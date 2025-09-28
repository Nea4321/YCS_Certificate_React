export interface DeptChild {
    child_id: number
    child_name: string
    child_type: string
    dept_map_id: number
}

export interface DeptList {
    parent_id: number
    parent_name: string
    parent_type: string
    child: DeptChild[]
}

export interface DragItem {
    type: "faculty" | "department" | "major"
    id: number
    name: string
    parentId?: number
}

export interface AddFormData {
    faculty: string
    department: string
    major: string
}
