import { useState } from "react"
import {Edit2, Save, Plus, Trash2, Upload} from "lucide-react"
import { depart_edit_style } from "../styles"
// 타입 정의
interface Department {
    id: number
    name: string
    content: string
}

interface Major {
    id: number
    name: string
    content: string
    departmentId: number
}

interface Faculty {
    id: number
    name: string
    content: string
    departments: Department[]
    majors: Major[]
}

// 샘플 데이터
const initialData: Faculty[] = [
    {
        id: 1,
        name: "공과대학",
        content: "공학 분야의 전문 인재를 양성하는 대학입니다.",
        departments: [
            { id: 1, name: "컴퓨터공학과", content: "소프트웨어 개발 및 컴퓨터 시스템 전문가를 양성합니다." },
            { id: 2, name: "전자공학과", content: "전자 및 통신 기술 전문가를 양성합니다." },
        ],
        majors: [
            { id: 1, name: "소프트웨어전공", content: "프로그래밍 및 소프트웨어 설계를 전문으로 합니다.", departmentId: 1 },
            { id: 2, name: "하드웨어전공", content: "컴퓨터 하드웨어 설계 및 개발을 전문으로 합니다.", departmentId: 1 },
            { id: 3, name: "통신전공", content: "무선 통신 및 네트워크 기술을 전문으로 합니다.", departmentId: 2 },
        ],
    },
    {
        id: 2,
        name: "인문대학",
        content: "인문학적 소양과 창의적 사고력을 기르는 대학입니다.",
        departments: [
            { id: 3, name: "국어국문학과", content: "한국어와 한국문학을 연구합니다." },
            { id: 4, name: "영어영문학과", content: "영어와 영미문학을 연구합니다." },
        ],
        majors: [
            { id: 4, name: "현대문학전공", content: "현대 한국문학을 집중 연구합니다.", departmentId: 3 },
            { id: 5, name: "언어학전공", content: "한국어 언어학을 전문으로 합니다.", departmentId: 3 },
        ],
    },
]

export const DepartmentEditPage = () => {
    const [faculties, setFaculties] = useState<Faculty[]>(initialData)
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null)
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
    const [selectedMajor, setSelectedMajor] = useState<Major | null>(null)
    const [editingItem, setEditingItem] = useState<"faculty" | "department" | "major" | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)

    // 학부 선택 핸들러
    const handleFacultySelect = (faculty: Faculty) => {
        setSelectedFaculty(faculty)
        setSelectedDepartment(null)
        setSelectedMajor(null)
        setEditingItem(null)
    }

    // 학과 선택 핸들러
    const handleDepartmentSelect = (department: Department) => {
        setSelectedDepartment(department)
        setSelectedMajor(null)
        setEditingItem(null)
    }

    // 전공 선택 핸들러
    const handleMajorSelect = (major: Major) => {
        setSelectedMajor(major)
        setEditingItem(null)
    }

    // 학부 업데이트
    const updateFaculty = (updatedFaculty: Faculty) => {
        setFaculties((prev) => prev.map((f) => (f.id === updatedFaculty.id ? updatedFaculty : f)))
        setSelectedFaculty(updatedFaculty)
    }

    // 학과 업데이트
    const updateDepartment = (updatedDepartment: Department) => {
        if (!selectedFaculty) return

        const updatedFaculty = {
            ...selectedFaculty,
            departments: selectedFaculty.departments.map((d) => (d.id === updatedDepartment.id ? updatedDepartment : d)),
        }
        updateFaculty(updatedFaculty)
        setSelectedDepartment(updatedDepartment)
    }

    // 전공 업데이트
    const updateMajor = (updatedMajor: Major) => {
        if (!selectedFaculty) return

        const updatedFaculty = {
            ...selectedFaculty,
            majors: selectedFaculty.majors.map((m) => (m.id === updatedMajor.id ? updatedMajor : m)),
        }
        updateFaculty(updatedFaculty)
        setSelectedMajor(updatedMajor)
    }

    // 새 항목 추가
    const addNewItem = (type: "department" | "major") => {
        if (!selectedFaculty) return

        if (type === "department") {
            const newDepartment: Department = {
                id: Date.now(),
                name: "새 학과",
                content: "",
            }
            const updatedFaculty = {
                ...selectedFaculty,
                departments: [...selectedFaculty.departments, newDepartment],
            }
            updateFaculty(updatedFaculty)
            setSelectedDepartment(newDepartment)
            setEditingItem("department")
        } else if (type === "major" && selectedDepartment) {
            const newMajor: Major = {
                id: Date.now(),
                name: "새 전공",
                content: "",
                departmentId: selectedDepartment.id,
            }
            const updatedFaculty = {
                ...selectedFaculty,
                majors: [...selectedFaculty.majors, newMajor],
            }
            updateFaculty(updatedFaculty)
            setSelectedMajor(newMajor)
            setEditingItem("major")
        }
    }

    // 항목 삭제
    const deleteItem = (type: "department" | "major", id: number) => {
        if (!selectedFaculty) return

        if (type === "department") {
            const updatedFaculty = {
                ...selectedFaculty,
                departments: selectedFaculty.departments.filter((d) => d.id !== id),
                majors: selectedFaculty.majors.filter((m) => m.departmentId !== id),
            }
            updateFaculty(updatedFaculty)
            if (selectedDepartment?.id === id) {
                setSelectedDepartment(null)
                setSelectedMajor(null)
            }
        } else if (type === "major") {
            const updatedFaculty = {
                ...selectedFaculty,
                majors: selectedFaculty.majors.filter((m) => m.id !== id),
            }
            updateFaculty(updatedFaculty)
            if (selectedMajor?.id === id) {
                setSelectedMajor(null)
            }
        }
    }

    const addNewFaculty = () => {
        const newFaculty: Faculty = {
            id: Date.now(),
            name: "새 학부",
            content: "",
            departments: [],
            majors: [],
        }
        setFaculties((prev) => [...prev, newFaculty])
        setSelectedFaculty(newFaculty)
        setSelectedDepartment(null)
        setSelectedMajor(null)
        setEditingItem("faculty")
    }

    const deleteFaculty = (facultyId: number) => {
        setFaculties((prev) => prev.filter((f) => f.id !== facultyId))
        if (selectedFaculty?.id === facultyId) {
            setSelectedFaculty(null)
            setSelectedDepartment(null)
            setSelectedMajor(null)
            setEditingItem(null)
        }
    }

    /** DB 업데이트 버튼
     * 여기서 DB 업데이트 구현 해야댐
     * */
    const handleUpdateDatabase = async () => {
        setIsUpdating(true)
        try {
            // TODO: 실제 DB 업데이트 로직 구현

            // 임시 지연 (실제 API 호출 시뮬레이션)
            await new Promise((resolve) => setTimeout(resolve, 500))

            alert("데이터베이스 업데이트가 완료되었습니다!")
        } catch (error) {
            console.error("DB 업데이트 실패:", error)
            alert("데이터베이스 업데이트에 실패했습니다.")
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className={depart_edit_style.container}>
            <div className={depart_edit_style.mainWrapper}>
                <div className={depart_edit_style.pageHeader}>
                    <div>
                        <h1 className={depart_edit_style.pageTitle}>학과 정보 수정</h1>
                        <p className={depart_edit_style.pageDescription}>학부, 학과, 전공 정보를 수정하고 관리할 수 있습니다.</p>
                    </div>
                    <button
                        className={`${depart_edit_style.button} ${depart_edit_style.buttonPrimary} ${depart_edit_style.updateButton}`}
                        onClick={handleUpdateDatabase}
                        disabled={isUpdating}
                    >
                        <Upload className={depart_edit_style.icon} />
                        {isUpdating ? "업데이트 중..." : "DB 업데이트"}
                    </button>
                </div>

                <div className={depart_edit_style.gridContainer}>
                    {/* 학부 목록 */}
                    <div className={depart_edit_style.card}>
                        <div className={depart_edit_style.cardHeader}>
                            <h2 className={depart_edit_style.cardTitle}>학부 목록</h2>
                            <button
                                className={`${depart_edit_style.button} ${depart_edit_style.buttonOutline} ${depart_edit_style.buttonSmall}`}
                                onClick={addNewFaculty}
                            >
                                <Plus className={depart_edit_style.icon} />
                            </button>
                        </div>
                        <div className={depart_edit_style.cardContent}>
                            <div className={depart_edit_style.scrollArea}>
                                <div className={depart_edit_style.facultyList}>
                                    {faculties.map((faculty) => (
                                        <div key={faculty.id} className={depart_edit_style.facultyItem}>
                                            <button
                                                className={`${depart_edit_style.button} ${depart_edit_style.facultyButton} ${
                                                    selectedFaculty?.id === faculty.id ? depart_edit_style.facultyButtonActive : depart_edit_style.facultyButtonInactive
                                                }`}
                                                onClick={() => handleFacultySelect(faculty)}
                                            >
                                                <div className={depart_edit_style.facultyInfo}>
                                                    <div className={depart_edit_style.facultyName}>{faculty.name}</div>
                                                    <div className={depart_edit_style.facultyCount}>{faculty.departments.length}개 학과</div>
                                                </div>
                                            </button>
                                            <button
                                                className={`${depart_edit_style.button} ${depart_edit_style.buttonDestructive} ${depart_edit_style.buttonIcon}`}
                                                onClick={() => deleteFaculty(faculty.id)}
                                            >
                                                <Trash2 className={depart_edit_style.icon} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 학과 및 전공 목록 */}
                    <div className={depart_edit_style.card}>
                        <div className={depart_edit_style.cardHeader}>
                            <h2 className={depart_edit_style.cardTitle}>학과 & 전공</h2>
                            {selectedFaculty && (
                                <button
                                    className={`${depart_edit_style.button} ${depart_edit_style.buttonOutline} ${depart_edit_style.buttonSmall}`}
                                    onClick={() => addNewItem("department")}
                                >
                                    <Plus className={depart_edit_style.icon} />
                                </button>
                            )}
                        </div>
                        <div className={depart_edit_style.cardContent}>
                            <div className={depart_edit_style.scrollArea}>
                                <div className={depart_edit_style.departmentList}>
                                    {selectedFaculty ? (
                                        selectedFaculty.departments.map((department) => (
                                            <div key={department.id} className={depart_edit_style.departmentItem}>
                                                <div className={depart_edit_style.departmentHeader}>
                                                    <button
                                                        className={`${depart_edit_style.button} ${depart_edit_style.departmentButton} ${
                                                            selectedDepartment?.id === department.id
                                                                ? depart_edit_style.departmentButtonActive
                                                                : depart_edit_style.departmentButtonInactive
                                                        }`}
                                                        onClick={() => handleDepartmentSelect(department)}
                                                    >
                                                        <div className={depart_edit_style.departmentInfo}>
                                                            <div className={depart_edit_style.departmentName}>{department.name}</div>
                                                            <div className={depart_edit_style.badge}>
                                                                {selectedFaculty.majors.filter((m) => m.departmentId === department.id).length}개 전공
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <button
                                                        className={`${depart_edit_style.button} ${depart_edit_style.buttonDestructive} ${depart_edit_style.buttonIcon}`}
                                                        onClick={() => deleteItem("department", department.id)}
                                                    >
                                                        <Trash2 className={depart_edit_style.icon} />
                                                    </button>
                                                </div>

                                                {selectedDepartment?.id === department.id && (
                                                    <div className={depart_edit_style.majorList}>
                                                        <div className={depart_edit_style.majorHeader}>
                                                            <span className={depart_edit_style.majorLabel}>전공</span>
                                                            <button
                                                                className={`${depart_edit_style.button} ${depart_edit_style.buttonGhost} ${depart_edit_style.buttonSmall}`}
                                                                onClick={() => addNewItem("major")}
                                                            >
                                                                <Plus className={depart_edit_style.iconSmall} />
                                                            </button>
                                                        </div>
                                                        {selectedFaculty.majors
                                                            .filter((major) => major.departmentId === department.id)
                                                            .map((major) => (
                                                                <div key={major.id} className={depart_edit_style.majorItem}>
                                                                    <button
                                                                        className={`${depart_edit_style.button} ${depart_edit_style.majorButton} ${
                                                                            selectedMajor?.id === major.id
                                                                                ? depart_edit_style.majorButtonActive
                                                                                : depart_edit_style.majorButtonInactive
                                                                        }`}
                                                                        onClick={() => handleMajorSelect(major)}
                                                                    >
                                                                        {major.name}
                                                                    </button>
                                                                    <button
                                                                        className={`${depart_edit_style.button} ${depart_edit_style.buttonDestructive} ${depart_edit_style.buttonIcon}`}
                                                                        onClick={() => deleteItem("major", major.id)}
                                                                    >
                                                                        <Trash2 className={depart_edit_style.iconSmall} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className={depart_edit_style.emptyStateText}>학부를 선택해주세요.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 편집 영역 */}
                    <div className={depart_edit_style.card}>
                        <div className={depart_edit_style.cardHeader}>
                            <h2 className={depart_edit_style.cardTitle}>정보 편집</h2>
                        </div>
                        <div className={depart_edit_style.editArea}>
                            {/* 학부 편집 */}
                            {selectedFaculty && (
                                <div className={depart_edit_style.editSection}>
                                    <div className={depart_edit_style.editHeader}>
                                        <h3 className={depart_edit_style.editTitle}>학부 정보</h3>
                                        <button
                                            className={`${depart_edit_style.button} ${depart_edit_style.buttonOutline} ${depart_edit_style.buttonSmall}`}
                                            onClick={() => setEditingItem(editingItem === "faculty" ? null : "faculty")}
                                        >
                                            <Edit2 className={depart_edit_style.icon} />
                                            {editingItem === "faculty" ? "취소" : "편집"}
                                        </button>
                                    </div>

                                    {editingItem === "faculty" ? (
                                        <FacultyEditForm
                                            faculty={selectedFaculty}
                                            onSave={(updatedFaculty) => {
                                                updateFaculty(updatedFaculty)
                                                setEditingItem(null)
                                            }}
                                            onCancel={() => setEditingItem(null)}
                                        />
                                    ) : (
                                        <div className={depart_edit_style.formGroup}>
                                            <div className={depart_edit_style.formField}>
                                                <label className={depart_edit_style.formLabel}>학부명</label>
                                                <p className={depart_edit_style.formValue}>{selectedFaculty.name}</p>
                                            </div>
                                            <div className={depart_edit_style.formField}>
                                                <label className={depart_edit_style.formLabel}>설명</label>
                                                <p className={depart_edit_style.formValue}>{selectedFaculty.content}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className={depart_edit_style.separator}></div>

                            {/* 학과 편집 */}
                            {selectedDepartment && (
                                <div className={depart_edit_style.editSection}>
                                    <div className={depart_edit_style.editHeader}>
                                        <h3 className={depart_edit_style.editTitle}>학과 정보</h3>
                                        <button
                                            className={`${depart_edit_style.button} ${depart_edit_style.buttonOutline} ${depart_edit_style.buttonSmall}`}
                                            onClick={() => setEditingItem(editingItem === "department" ? null : "department")}
                                        >
                                            <Edit2 className={depart_edit_style.icon} />
                                            {editingItem === "department" ? "취소" : "편집"}
                                        </button>
                                    </div>

                                    {editingItem === "department" ? (
                                        <DepartmentEditForm
                                            department={selectedDepartment}
                                            onSave={(updatedDepartment) => {
                                                updateDepartment(updatedDepartment)
                                                setEditingItem(null)
                                            }}
                                            onCancel={() => setEditingItem(null)}
                                        />
                                    ) : (
                                        <div className={depart_edit_style.formGroup}>
                                            <div className={depart_edit_style.formField}>
                                                <label className={depart_edit_style.formLabel}>학과명</label>
                                                <p className={depart_edit_style.formValue}>{selectedDepartment.name}</p>
                                            </div>
                                            <div className={depart_edit_style.formField}>
                                                <label className={depart_edit_style.formLabel}>설명</label>
                                                <p className={depart_edit_style.formValue}>{selectedDepartment.content}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className={depart_edit_style.separator}></div>

                            {/* 전공 편집 */}
                            {selectedMajor && (
                                <div className={depart_edit_style.editSection}>
                                    <div className={depart_edit_style.editHeader}>
                                        <h3 className={depart_edit_style.editTitle}>전공 정보</h3>
                                        <button
                                            className={`${depart_edit_style.button} ${depart_edit_style.buttonOutline} ${depart_edit_style.buttonSmall}`}
                                            onClick={() => setEditingItem(editingItem === "major" ? null : "major")}
                                        >
                                            <Edit2 className={depart_edit_style.icon} />
                                            {editingItem === "major" ? "취소" : "편집"}
                                        </button>
                                    </div>

                                    {editingItem === "major" ? (
                                        <MajorEditForm
                                            major={selectedMajor}
                                            onSave={(updatedMajor) => {
                                                updateMajor(updatedMajor)
                                                setEditingItem(null)
                                            }}
                                            onCancel={() => setEditingItem(null)}
                                        />
                                    ) : (
                                        <div className={depart_edit_style.formGroup}>
                                            <div className={depart_edit_style.formField}>
                                                <label className={depart_edit_style.formLabel}>전공명</label>
                                                <p className={depart_edit_style.formValue}>{selectedMajor.name}</p>
                                            </div>
                                            <div className={depart_edit_style.formField}>
                                                <label className={depart_edit_style.formLabel}>설명</label>
                                                <p className={depart_edit_style.formValue}>{selectedMajor.content}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!selectedFaculty && (
                                <div className={depart_edit_style.emptyState}>
                                    <p className={depart_edit_style.emptyStateText}>편집할 항목을 선택해주세요.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// 학부 편집 폼 컴포넌트
function FacultyEditForm({
                             faculty,
                             onSave,
                             onCancel,
                         }: {
    faculty: Faculty
    onSave: (faculty: Faculty) => void
    onCancel: () => void
}) {
    const [name, setName] = useState(faculty.name)
    const [content, setContent] = useState(faculty.content)

    const handleSave = () => {
        onSave({ ...faculty, name, content })
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
            <div className={depart_edit_style.formField}>
                <label className={depart_edit_style.formLabel}>설명</label>
                <textarea
                    className={depart_edit_style.textarea}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="학부 설명을 입력하세요"
                    rows={4}
                />
            </div>
            <div className={depart_edit_style.formActions}>
                <button className={`${depart_edit_style.button} ${depart_edit_style.buttonPrimary}`} onClick={handleSave}>
                    <Save className={depart_edit_style.icon} />
                    저장
                </button>
                <button className={`${depart_edit_style.button} ${depart_edit_style.buttonOutline}`} onClick={onCancel}>
                    취소
                </button>
            </div>
        </div>
    )
}

// 학과 편집 폼 컴포넌트
function DepartmentEditForm({
                                department,
                                onSave,
                                onCancel,
                            }: {
    department: Department
    onSave: (department: Department) => void
    onCancel: () => void
}) {
    const [name, setName] = useState(department.name)
    const [content, setContent] = useState(department.content)

    const handleSave = () => {
        onSave({ ...department, name, content })
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
            <div className={depart_edit_style.formField}>
                <label className={depart_edit_style.formLabel}>설명</label>
                <textarea
                    className={depart_edit_style.textarea}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="학과 설명을 입력하세요"
                    rows={4}
                />
            </div>
            <div className={depart_edit_style.formActions}>
                <button className={`${depart_edit_style.button} ${depart_edit_style.buttonPrimary}`} onClick={handleSave}>
                    <Save className={depart_edit_style.icon} />
                    저장
                </button>
                <button className={`${depart_edit_style.button} ${depart_edit_style.buttonOutline}`} onClick={onCancel}>
                    취소
                </button>
            </div>
        </div>
    )
}

// 전공 편집 폼 컴포넌트
function MajorEditForm({
                           major,
                           onSave,
                           onCancel,
                       }: {
    major: Major
    onSave: (major: Major) => void
    onCancel: () => void
}) {
    const [name, setName] = useState(major.name)
    const [content, setContent] = useState(major.content)

    const handleSave = () => {
        onSave({ ...major, name, content })
    }

    return (
        <div className={depart_edit_style.formGroup}>
            <div className={depart_edit_style.formField}>
                <label className={depart_edit_style.formLabel}>전공명</label>
                <input
                    className={depart_edit_style.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="전공명을 입력하세요"
                />
            </div>
            <div className={depart_edit_style.formField}>
                <label className={depart_edit_style.formLabel}>설명</label>
                <textarea
                    className={depart_edit_style.textarea}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="전공 설명을 입력하세요"
                    rows={4}
                />
            </div>
            <div className={depart_edit_style.formActions}>
                <button className={`${depart_edit_style.button} ${depart_edit_style.buttonPrimary}`} onClick={handleSave}>
                    <Save className={depart_edit_style.icon} />
                    저장
                </button>
                <button className={`${depart_edit_style.button} ${depart_edit_style.buttonOutline}`} onClick={onCancel}>
                    취소
                </button>
            </div>
        </div>
    )
}
