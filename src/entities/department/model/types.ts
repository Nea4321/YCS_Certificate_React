export interface DepartmentChild {
  child_type: string
  child_id: number
  child_name: string
}

export interface Department {
  parent_type: string
  parent_id: number
  parent_name: string
  child: DepartmentChild[]
}

