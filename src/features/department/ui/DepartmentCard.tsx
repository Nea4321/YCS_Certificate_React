import { memo } from "react"
import type { DeptList } from "@/entities/department/model"

interface DepartmentCardProps {
    department: DeptList
}

export const DepartmentCard = memo(({ department }: DepartmentCardProps) => {
    return (
        <ul className="faculty-item">
            <div className="faculty-name">
                {department.parent_name} ({department.parent_type})
            </div>
            <div className="department-list">
                {department.child.map((child) => (
                    <li key={`${child.child_type}-${child.child_id}`} className="department-item">
                        <a href="#" className="department-link" data-id={child.child_id}>
                            {child.child_name} ({child.child_type})
                        </a>
                    </li>
                ))}
            </div>
        </ul>
    )
})

// 디버깅을 위한 displayName 추가
DepartmentCard.displayName = "DepartmentCard"

