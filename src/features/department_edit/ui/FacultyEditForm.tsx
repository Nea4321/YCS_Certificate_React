"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import {depart_edit_style} from "@/pages/department_edit";
import {Department, Major} from "@/features/department_edit/lib/DeptEdit.tsx";


export interface Faculty {
    id: number
    name: string
    departments: Department[]
    majors: Major[]
}
export const FacultyEditForm = ({
                                            faculty,
                                            onSave,
                                            onCancel,
                                        }: {
    faculty: Faculty
    onSave: (faculty: Faculty) => void
    onCancel: () => void
}) => {
    const [name, setName] = useState(faculty.name)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const handleSave = () => {
        if (name === faculty.name) {
            setErrorMessage("변경된 내용이 없습니다.")
            setTimeout(() => setErrorMessage(""), 3000)
            return
        }

        setErrorMessage("")
        onSave({...faculty, name})
    }

    return (
        <div className={depart_edit_style.formGroup}>
            <div className={depart_edit_style.formField}>
                <label className={depart_edit_style.formLabel}>학부명</label>
                <input
                    className={depart_edit_style.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="학부명을 입력하세요"
                />
            </div>
            {errorMessage && <div className={depart_edit_style.errorMessageSmall}>{errorMessage}</div>}
            <div className={depart_edit_style.formActions}>
                <button className={`${depart_edit_style.button} ${depart_edit_style.buttonPrimary}`} onClick={handleSave}>
                    <Save className={depart_edit_style.icon} />
                    수정
                </button>
                <button className={`${depart_edit_style.button} ${depart_edit_style.buttonOutline}`} onClick={onCancel}>
                    취소
                </button>
            </div>
        </div>
    )

}