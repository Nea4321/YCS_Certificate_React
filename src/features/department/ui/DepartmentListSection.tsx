import { memo } from "react"
import type { DeptList } from "@/entities/department/model"
import { deptListStyles } from "@/pages/department-list/styles";
import {Link} from "react-router-dom";

/**DepartmentListSection에 전달되는 props
 *
 * @property {DeptList} department - DB에서 불러온 학부와 학과,전공 정보
 */
interface DepartmentCardProps {
    department: DeptList
}

/**학과 목록 페이지 컴포넌트
 * - 학부(부모)의 이름과 타입을 표시한다
 * - 학과,전공(자식)을 순회하며 매핑되는 학부 아래에 <Link>로 렌더링
 * - 각 학과를 클릭 시 해당 학과의 상세 페이지로 리다이렉트(<Link to={`/departments/${child.dept_map_id}`})
 *
 * @component
 *
 * @example
 * <DepartmentListSection_edit key={`${dept.parent_type}-${dept.parent_id}`} department={dept} />
 */
export const DepartmentListSection = memo(({ department }: DepartmentCardProps) => {
    return (
        <ul className={deptListStyles.facultyItem}>
            <div className={deptListStyles.facultyName}>
                {department.parent_name} ({department.parent_type})
            </div>
            <div className={deptListStyles.departmentList}>
                {department.child.map((child) => (
                    <li key={`${child.child_type}-${child.child_id}`}
                        className={deptListStyles.departmentItem}>
                        <Link to={`/departments/${child.dept_map_id}`}
                              className={deptListStyles.departmentLink} data-id={child.child_id}>
                            {child.child_name} ({child.child_type})
                        </Link>
                    </li>
                ))}
            </div>
        </ul>
    )
})

// 디버깅을 위한 displayName 추가
DepartmentListSection.displayName = "DepartmentListSection"

