import { memo } from "react"
import type { Department } from "../model/types"

interface DepartmentCardProps {
    department: Department
}

export const DepartmentCard = memo(({ department }: DepartmentCardProps) => {
    return (
        <li className="faculty-item">
            <div className="faculty-name">
                {department.parent_name} ({department.parent_type})
            </div>
            <ul className="department-list">
                {department.child.map((child) => (
                    <li key={`${child.child_type}-${child.child_id}`} className="department-item">
                        <a href="#" className="department-link" data-id={child.child_id}>
                            {child.child_name} ({child.child_type})
                        </a>
                    </li>
                ))}
            </ul>
        </li>
    )
})

// 디버깅을 위한 displayName 추가
DepartmentCard.displayName = "DepartmentCard"

