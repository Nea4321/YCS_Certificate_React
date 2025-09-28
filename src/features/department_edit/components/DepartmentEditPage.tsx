"use client"

import { useState, useCallback } from "react"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
import { DepartmentEditSection } from "./DepartmentEditSection.tsx"
import type { DeptList, DragItem, AddFormData } from "../types/department"
import {AddDepartmentModal} from "@/features/department_edit/components/AddDepartmentModel.tsx";
import { departmentStyles } from "@/pages/department_edit"
// 샘플 데이터
const sampleDepartments: DeptList[] = [
  {
    parent_id: 1,
    parent_name: "공과대학",
    parent_type: "학부",
    child: [
      { child_id: 101, child_name: "컴퓨터공학과", child_type: "학과", dept_map_id: 1001 },
      { child_id: 102, child_name: "전자공학과", child_type: "학과", dept_map_id: 1002 },
      { child_id: 103, child_name: "소프트웨어전공", child_type: "전공", dept_map_id: 1003 },
    ],
  },
  {
    parent_id: 2,
    parent_name: "인문대학",
    parent_type: "학부",
    child: [
      { child_id: 201, child_name: "국어국문학과", child_type: "학과", dept_map_id: 2001 },
      { child_id: 202, child_name: "영어영문학과", child_type: "학과", dept_map_id: 2002 },
      { child_id: 203, child_name: "문학전공", child_type: "전공", dept_map_id: 2003 },
    ],
  },
]

export const DepartmentEditPage = () => {
  const [departments, setDepartments] = useState<DeptList[]>(sampleDepartments)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleEdit = useCallback((id: number, type: string) => {
    console.log(`Edit ${type} with id: ${id}`)
    // TODO: 수정 로직 구현
  }, [])

  const handleDelete = useCallback((id: number, type: string) => {
    if (confirm(`정말로 이 ${type}을(를) 삭제하시겠습니까?`)) {
      console.log(`Delete ${type} with id: ${id}`)
      // TODO: 삭제 로직 구현
    }
  }, [])

  const handleAddSubmit = useCallback(async (data: AddFormData) => {
    setLoading(true)
    try {
      console.log("Adding new department data:", data)
      // TODO: DB에 추가하는 로직 구현

      // 임시로 콘솔에 출력
      if (data.faculty) console.log("새 학부 추가:", data.faculty)
      if (data.department) console.log("새 학과 추가:", data.department)
      if (data.major) console.log("새 전공 추가:", data.major)
    } catch (error) {
      console.error("Error adding department:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDrop = useCallback((item: DragItem, targetParentId: number) => {
    console.log("Dropped item:", item, "to parent:", targetParentId)

    // 드롭된 아이템을 해당 학부에 추가하는 로직
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.parent_id === targetParentId) {
          const newChild = {
            child_id: Date.now(), // 임시 ID
            child_name: item.name,
            child_type: item.type === "faculty" ? "학부" : item.type === "department" ? "학과" : "전공",
            dept_map_id: Date.now() + 1000,
          }

          return {
            ...dept,
            child: [...dept.child, newChild],
          }
        }
        return dept
      }),
    )
  }, [])

  const handleBack = () => {
    // TODO: 뒤로가기 로직 구현
    console.log("Going back to department list")
  }

  return (
      <div className={departmentStyles.container}>
        <div className={departmentStyles.header}>
          <div className={departmentStyles.headerInner}>
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              학과 목록으로
            </Button>
            <h1 className={departmentStyles.title}>학과 정보 수정</h1>
          </div>
        </div>

        <div className={departmentStyles.body}>
          <div className="mb-6">
            <div className={departmentStyles.card}>
              <div className={departmentStyles.cardHeader}>
                <div>
                  <h2 className={departmentStyles.cardTitle}>학과 관리</h2>
                  <p className={departmentStyles.cardDesc}>
                    학부, 학과, 전공 정보를 추가, 수정, 삭제할 수 있습니다. 드래그 앤 드롭으로 항목을 이동할 수도 있습니다.
                  </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>새 항목 추가</Button>
              </div>
            </div>
          </div>

          <div className={departmentStyles.sectionList}>
            {departments.map((department) => (
                <DepartmentEditSection
                    key={`${department.parent_type}-${department.parent_id}`}
                    department={department}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddClick={() => setIsModalOpen(true)}
                    onDrop={handleDrop}
                />
            ))}
          </div>

          {departments.length === 0 && (
              <div className={departmentStyles.emptyCard}>
                <p className={departmentStyles.emptyText}>등록된 학과 정보가 없습니다.</p>
                <Button onClick={() => setIsModalOpen(true)}>첫 번째 학과 추가하기</Button>
              </div>
          )}
        </div>

        <AddDepartmentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddSubmit}
        />
      </div>
  )
}
