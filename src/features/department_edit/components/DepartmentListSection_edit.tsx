import {memo, useState} from "react"
import type { DeptList } from "@/entities/department/model"
import {Check, Edit, Trash, X} from "lucide-react";
import {departmentEditStyles} from "@/pages/department_edit";
import {useButton} from "@/features/department_edit/model";

/**DepartmentListSection에 전달되는 props
 *
 * @property {DeptList} department - DB에서 불러온 학부와 학과,전공 정보
 */
interface DepartmentCardProps {
  department: DeptList
    onAdd?: (name: string, type: string) => void
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
export const DepartmentListSection_edit = memo(({ department, onAdd }: DepartmentCardProps) => {

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState(""); // 수정 값
     const {handleDelete} = useButton()

  return (
    <ul className={departmentEditStyles.facultyItem}>
        <div className={departmentEditStyles.facultyName}>
          <span>
            {department.parent_name} ({department.parent_type})
          </span>
            <button
                className={departmentEditStyles.addButton}
                onClick={() =>  onAdd?.(department.parent_name, department.parent_type)}
            >
                + 추가
            </button>
            <button
                className={departmentEditStyles.iconButton}
                 onClick={() => handleDelete(department.parent_id,department.parent_type)}
                aria-label="삭제">
                <Trash size={16} />
            </button>
        </div>

      <div className={departmentEditStyles.departmentList}>
          {department.child.map((child) => (
              <li key={`${child.child_type}-${child.child_id}`} className={departmentEditStyles.departmentItem}>
                  <div className={departmentEditStyles.actionButtons}>
                      {editingId === child.child_id ? ( // 현재 수정중인 항목만 input 노출
                          <div>
                              <input
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                              />
                              <button /*onClick={() => handleSave_edit(child.child_id, child.child_type, editValue)}*/>
                                  <Check size={16} /> 확인
                              </button>
                              <button onClick={() => setEditingId(null)}>
                                  <X size={16} /> 취소
                              </button>
                          </div>
                      ) : (
                          <div>
                              <span className={departmentEditStyles.departmentItem_edit}>
                                {child.child_name}
                              </span>
                                  <button
                                      className={departmentEditStyles.iconButton}
                                      onClick={() => {
                                          setEditingId(child.child_id);
                                          setEditValue(child.child_name); // 기존 값 미리 채워주기
                                          // handleSave_edit(editingId,editValue,"");
                                      }}
                                      aria-label="수정"
                                  >
                                      <Edit size={16} />
                                  </button>
                          </div>
                  )}

                  {/* 삭제 아이콘 버튼 */}
                  <button
                      className={departmentEditStyles.iconButton}
                      onClick={() => handleDelete(child.child_id,child.child_type)}
                      aria-label="삭제">
                      <Trash size={16} />

                  </button>
              </div>

          </li>
        ))}
      </div>
    </ul>


  )
})

// 디버깅을 위한 displayName 추가
DepartmentListSection_edit.displayName = "DepartmentListSection_edit"
