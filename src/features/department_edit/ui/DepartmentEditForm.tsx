import {useState} from "react";
import {depart_edit_style} from "@/pages/department_edit";
import {Save} from "lucide-react";

export interface Department {
    id: number
    name: string
    facultyId?: number | null
}

export const DepartmentEditForm=({
                                department,
                                onSave,
                                onCancel,
                            }: {
    department: Department
    onSave: (department: Department) => void
    onCancel: () => void
})=> {
    const [name, setName] = useState(department.name)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const handleSave = () => {
        if (name === department.name) {
            setErrorMessage("변경된 내용이 없습니다.")
            setTimeout(() => setErrorMessage(""), 3000)
            return
        }

        setErrorMessage("")
        onSave({ ...department, name })
    }

    return (
        <div className={depart_edit_style.formGroup}>
            <div className={depart_edit_style.formField}>
                <label className={depart_edit_style.formLabel}>학과명</label>
                <input
                    className={depart_edit_style.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="학과명을 입력하세요"
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