import { useState } from "react"

/** 타입 (원하시면 별도 파일로 분리) */
export interface Department {
    id: number
    name: string
    facultyId?: number | null
}

export interface Major {
    id: number
    name: string
    departmentId?: number | null
}

export interface Faculty {
    id: number
    name: string
    departments: Department[]
    majors: Major[]
}

/**
 * useDeptEdit
 * - initialData: 초기 학부/학과/전공 데이터 (샘플/서버에서 불러온 것)
 * 반환: 상태와 모든 핸들러(추가, 삭제, 업데이트 등)
 */
export const DeptEdit = (initialData: Faculty[] = []) => {
    const [faculties, setFaculties] = useState<Faculty[]>(initialData)
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null)
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
    const [selectedMajor, setSelectedMajor] = useState<Major | null>(null)
    const [editingItem, setEditingItem] = useState<"faculty" | "department" | "major" | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    /* navigation placeholder */
    const handleGoToDepartmentPage = () => {
        // 페이지 라우팅을 넣으려면 여기서 구현 (next/router 등)
        console.log("학과페이지로 이동")
    }

    /* 선택 핸들러들 */
    const handleFacultySelect = (faculty: Faculty) => {
        setSelectedFaculty(faculty)
        setSelectedDepartment(null)
        setSelectedMajor(null)
        setEditingItem(null)
    }

    const handleDepartmentSelect = (department: Department) => {
        setSelectedDepartment(department)
        setSelectedMajor(null)
        setEditingItem(null)
    }

    const handleMajorSelect = (major: Major) => {
        setSelectedMajor(major)
        setEditingItem(null)
    }

    /* 업데이트들 */
    const updateFaculty = (updatedFaculty: Faculty) => {
        setFaculties((prev) => prev.map((f) => (f.id === updatedFaculty.id ? updatedFaculty : f)))
        setSelectedFaculty(updatedFaculty)
    }

    const updateDepartment = (updatedDepartment: Department) => {
        if (!selectedFaculty) return
        const updatedFaculty = {
            ...selectedFaculty,
            departments: selectedFaculty.departments.map((d) => (d.id === updatedDepartment.id ? updatedDepartment : d)),
        }
        updateFaculty(updatedFaculty)
        setSelectedDepartment(updatedDepartment)
    }

    const updateMajor = (updatedMajor: Major) => {
        if (!selectedFaculty) return
        const updatedFaculty = {
            ...selectedFaculty,
            majors: selectedFaculty.majors.map((m) => (m.id === updatedMajor.id ? updatedMajor : m)),
        }
        updateFaculty(updatedFaculty)
        setSelectedMajor(updatedMajor)
    }

    /* 추가 (학과 또는 전공) */
    const addNewItem = (type: "department" | "major") => {
        if (type === "department") {
            const newDepartment: Department = {
                id: Date.now(),
                name: "새 학과",
                facultyId: selectedFaculty?.id || null,
            }

            if (selectedFaculty) {
                const updatedFaculty = {
                    ...selectedFaculty,
                    departments: [...selectedFaculty.departments, newDepartment],
                }
                updateFaculty(updatedFaculty)
            } else {
                // 빈 학부(예: id=0)로 추가
                const emptyFacultyIndex = faculties.findIndex((f) => f.id === 0)
                if (emptyFacultyIndex !== -1) {
                    const updatedEmptyFaculty = {
                        ...faculties[emptyFacultyIndex],
                        departments: [...faculties[emptyFacultyIndex].departments, newDepartment],
                    }
                    setFaculties((prev) => prev.map((f, i) => (i === emptyFacultyIndex ? updatedEmptyFaculty : f)))
                    setSelectedFaculty(updatedEmptyFaculty)
                }
            }

            setSelectedDepartment(newDepartment)
            setEditingItem("department")
        } else {
            const newMajor: Major = {
                id: Date.now(),
                name: "새 전공",
                departmentId: selectedDepartment?.id || null,
            }

            if (selectedFaculty) {
                const updatedFaculty = {
                    ...selectedFaculty,
                    majors: [...selectedFaculty.majors, newMajor],
                }
                updateFaculty(updatedFaculty)
            } else {
                const emptyFacultyIndex = faculties.findIndex((f) => f.id === 0)
                if (emptyFacultyIndex !== -1) {
                    const updatedEmptyFaculty = {
                        ...faculties[emptyFacultyIndex],
                        majors: [...faculties[emptyFacultyIndex].majors, newMajor],
                    }
                    setFaculties((prev) => prev.map((f, i) => (i === emptyFacultyIndex ? updatedEmptyFaculty : f)))
                    setSelectedFaculty(updatedEmptyFaculty)
                }
            }

            setSelectedMajor(newMajor)
            setEditingItem("major")
        }
    }

    /* 삭제 (학과 / 전공) */
    const deleteItem = (type: "department" | "major", id: number) => {
        if (!selectedFaculty) return

        if (type === "department") {
            const confirmMessage = "연관된 전공 데이터들이 전부 삭제될 수 있습니다. 정말 삭제하시겠습니까?"
            if (!confirm(confirmMessage)) return

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
        } else {
            const confirmMessage = "정말 삭제하시겠습니까?"
            if (!confirm(confirmMessage)) return

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

    /* 학부 추가 / 삭제 */
    const addNewFaculty = () => {
        const newFaculty: Faculty = {
            id: Date.now(),
            name: "새 학부",
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
        if (facultyId === 0) return // 빈 학부는 삭제 불가
        const confirmMessage = "연관된 학과 및 전공 데이터들이 전부 삭제될 수 있습니다. 정말 삭제하시겠습니까?"
        if (!confirm(confirmMessage)) return

        setFaculties((prev) => prev.filter((f) => f.id !== facultyId))
        if (selectedFaculty?.id === facultyId) {
            setSelectedFaculty(null)
            setSelectedDepartment(null)
            setSelectedMajor(null)
            setEditingItem(null)
        }
    }

    /* DB에 추가 (임시 시뮬레이션 로직) */
    const handleAddToDatabase = async () => {
        const hasNewData = faculties.some((faculty) => {
            // 기존 샘플 기준 판단 로직 (프로덕션에서는 서버 기준으로 판단)
            if (faculty.id > 2 && faculty.id !== 0) return true
            if (faculty.departments.some((dept) => dept.id > 4)) return true
            if (faculty.majors.some((major) => major.id > 5)) return true
            return false
        })

        if (!hasNewData) {
            setErrorMessage("추가할 새로운 데이터가 없습니다.")
            setTimeout(() => setErrorMessage(""), 3000)
            return
        }

        setErrorMessage("")
        setIsUpdating(true)
        try {
            // TODO: 실제 API 호출 (수정/추가/삭제 등)
            console.log("DB 추가 데이터:", faculties)
            await new Promise((res) => setTimeout(res, 1200))
            alert("데이터베이스에 추가가 완료되었습니다!")
        } catch (e) {
            console.error("DB 추가 실패:", e)
            alert("데이터베이스 추가에 실패했습니다.")
        } finally {
            setIsUpdating(false)
        }
    }

    /* 개별 항목 저장(임시) */
    const handleSaveIndividualEdit = async (type: "faculty" | "department" | "major", item: any) => {
        try {
            // 실제로는 API 호출 후 상태 동기화 필요
            console.log(`${type} 개별 수정:`, item)
            alert(`${type === "faculty" ? "학부" : type === "department" ? "학과" : "전공"} 정보가 수정되었습니다.`)
        } catch (e) {
            console.error("개별 수정 실패:", e)
            alert("수정에 실패했습니다.")
        }
    }

    /* --- 반환: 상태 + 모든 핸들러 --- */
    return {
        // 상태
        faculties,
        selectedFaculty,
        selectedDepartment,
        selectedMajor,
        editingItem,
        isUpdating,
        errorMessage,

        // 상태 설정자(필요하면 외부에서 직접 사용 가능)
        setFaculties,
        setSelectedFaculty,
        setSelectedDepartment,
        setSelectedMajor,
        setEditingItem,
        setIsUpdating,
        setErrorMessage,

        // 네비/핸들러
        handleGoToDepartmentPage,
        handleFacultySelect,
        handleDepartmentSelect,
        handleMajorSelect,

        // CRUD
        updateFaculty,
        updateDepartment,
        updateMajor,
        addNewItem,
        deleteItem,
        addNewFaculty,
        deleteFaculty,

        // DB 연동(시뮬)
        handleAddToDatabase,
        handleSaveIndividualEdit,
    }
}
