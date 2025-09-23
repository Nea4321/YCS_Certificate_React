import {ArrowLeft, Edit2, Plus, Trash2, Upload} from "lucide-react";
import { depart_edit_style } from "../styles";
import {DepartmentEditForm, DeptEdit, FacultyEditForm, MajorEditForm} from "@/features/department_edit";



export const DepartmentEditPage =()=>{
    const {addNewFaculty,addNewItem,deleteFaculty,deleteItem,editingItem,errorMessage,faculties,
        handleAddToDatabase,handleGoToDepartmentPage,handleDepartmentSelect,handleFacultySelect,handleMajorSelect,handleSaveIndividualEdit,
    isUpdating,updateDepartment,updateFaculty,updateMajor,selectedFaculty,selectedDepartment,selectedMajor
    ,setEditingItem} = DeptEdit()

    return (
        <div className={depart_edit_style.container}>
            <div className={depart_edit_style.mainWrapper}>
                <div className={depart_edit_style.pageHeader}>
                    <div className={depart_edit_style.headerLeft}>
                        <button
                            className={`${depart_edit_style.button} ${depart_edit_style.buttonOutline} ${depart_edit_style.backButton}`}
                            onClick={handleGoToDepartmentPage}
                        >
                            <ArrowLeft className={depart_edit_style.icon} />
                            학과페이지로
                        </button>
                        <div>
                            <h1 className={depart_edit_style.pageTitle}>학과 정보 수정</h1>
                            <p className={depart_edit_style.pageDescription}>학부, 학과, 전공 정보를 수정하고 관리할 수 있습니다.</p>
                        </div>
                    </div>
                    <div className={depart_edit_style.headerRight}>
                        <button
                            className={`${depart_edit_style.button} ${depart_edit_style.buttonPrimary} ${depart_edit_style.updateButton}`}
                            onClick={handleAddToDatabase}
                            disabled={isUpdating}
                        >
                            <Upload className={depart_edit_style.icon} />
                            {isUpdating ? "추가 중..." : "DB 추가"}
                        </button>
                        {errorMessage && <div className={depart_edit_style.errorMessage}>{errorMessage}</div>}
                    </div>
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
                                            {faculty.id !== 0 && (
                                                <button
                                                    className={`${depart_edit_style.button} ${depart_edit_style.buttonDestructive} ${depart_edit_style.buttonIcon}`}
                                                    onClick={() => deleteFaculty(faculty.id)}
                                                >
                                                    <Trash2 className={depart_edit_style.icon} />
                                                </button>
                                            )}
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
                            <button
                                className={`${depart_edit_style.button} ${depart_edit_style.buttonOutline} ${depart_edit_style.buttonSmall}`}
                                onClick={() => addNewItem("department")}
                            >
                                <Plus className={depart_edit_style.icon} />
                            </button>
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
                                                handleSaveIndividualEdit("faculty", updatedFaculty)
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
                                                handleSaveIndividualEdit("department", updatedDepartment)
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
                                                handleSaveIndividualEdit("major", updatedMajor)
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



