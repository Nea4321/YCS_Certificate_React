"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card } from "./ui/card"

import type { AddFormData, DragItem } from "../types/department"
import {departmentStyles} from "@/pages";

interface AddDepartmentModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: AddFormData) => void
    existingData?: { faculties: string[]; departments: string[]; majors: string[] }
}

export const AddDepartmentModal = ({ isOpen, onClose, onSubmit, existingData }: AddDepartmentModalProps) => {
    const [formData, setFormData] = useState<AddFormData>({
        faculty: "",
        department: "",
        major: "",
    })
    const [draggedItems, setDraggedItems] = useState<DragItem[]>([])

    useEffect(() => {
        if (!isOpen) {
            setFormData({ faculty: "", department: "", major: "" })
            setDraggedItems([])
        }
    }, [isOpen])

    const handleInputChange = (field: keyof AddFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // 전공은 학과 또는 학부가 있어야 함
        if (formData.major && !formData.department && !formData.faculty) {
            alert("전공을 추가하려면 학과 또는 학부가 필요합니다.")
            return
        }

        onSubmit(formData)
        onClose()
    }

    const handleDragStart = (e: React.DragEvent, type: "faculty" | "department" | "major", name: string) => {
        const dragItem: DragItem = {
            type,
            id: Date.now(), // 임시 ID
            name,
        }
        e.dataTransfer.setData("application/json", JSON.stringify(dragItem))
        e.dataTransfer.effectAllowed = "move"
    }

    const createDraggableItem = (type: "faculty" | "department" | "major", name: string, color: string) => {
        if (!name) return null

        return (
            <div
                key={`${type}-${name}`}
                draggable
                onDragStart={(e) => handleDragStart(e, type, name)}
                className={`p-2 ${color} rounded cursor-move border-2 border-dashed border-gray-300 text-sm font-medium transition-all hover:shadow-md`}
            >
                {name} ({type === "faculty" ? "학부" : type === "department" ? "학과" : "전공"})
            </div>
        )
    }

    if (!isOpen) return null

    return (
        <div className={departmentStyles.modalOverlay}>
            <Card className={departmentStyles.modalCard}>
                <div className={departmentStyles.modalHeader}>
                    <h2 className={departmentStyles.modalTitle}>학과 정보 추가</h2>
                    <Button className={departmentStyles.modalCloseButton} onClick={onClose}>
                        X
                    </Button>
                </div>

                <form className={departmentStyles.modalForm} onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="faculty">학부 (선택사항)</Label>
                            <Input
                                id="faculty"
                                value={formData.faculty}
                                onChange={(e) => handleInputChange("faculty", e.target.value)}
                                placeholder="학부명 입력"
                            />
                        </div>

                        <div>
                            <Label htmlFor="department">학과 (선택사항)</Label>
                            <Input
                                id="department"
                                value={formData.department}
                                onChange={(e) => handleInputChange("department", e.target.value)}
                                placeholder="학과명 입력"
                            />
                        </div>

                        <div>
                            <Label htmlFor="major">전공 (선택사항)</Label>
                            <Input
                                id="major"
                                value={formData.major}
                                onChange={(e) => handleInputChange("major", e.target.value)}
                                placeholder="전공명 입력"
                            />
                            <p className="text-xs text-gray-500 mt-1">* 전공은 학과 또는 학부가 있어야 추가됩니다</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium mb-2 mt-4">드래그 가능한 항목</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div>
                                <Label className="text-xs text-gray-600">학부</Label>
                                {createDraggableItem("faculty", formData.faculty)}
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">학과</Label>
                                {createDraggableItem("department", formData.department)}
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">전공</Label>
                                {createDraggableItem("major", formData.major)}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <Button type="submit" className="flex-1">
                            확인
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                            취소
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
