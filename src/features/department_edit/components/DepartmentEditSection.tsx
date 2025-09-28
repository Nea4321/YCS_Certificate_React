import { useState } from "react";
import { deptListStyles } from "@/pages";
import { useEditSectionButton } from "@/features/department_edit/model/useEditSectionButton.tsx";

interface AddDepartmentModalProps {
    facultyDefault?: string;
    departmentOptions?: { name: string; majors: string[] }[];
    isopen: boolean;
    onClose?: () => void;
}

export const DepartmentEditSection = ({
                                          facultyDefault,
                                          departmentOptions = [],
                                          isopen,
                                          onClose,
                                      }: AddDepartmentModalProps) => {
    const [faculty, setFaculty] = useState(facultyDefault || "");
    const [departments, setDepartments] = useState<{ name: string; majors: string[] }[]>([]);
    const Close = () => {
        onClose?.();
        setDepartments([]);
        setFaculty("");
    };

    const {
        handleSave,
        handleAddDepartment,
        handleDepartmentChange,
        handleMajorChange,
        handleAddMajor,
    } = useEditSectionButton();

    if (!isopen) return null;

    return (
        <div className={`${deptListStyles.facultyItem} ${deptListStyles.addForm}`}>
            <h3>새 학부/학과/전공 추가</h3>

            {/* ✅ 학부명: 기본값이 있으면 select, 없으면 input */}
            {facultyDefault ? (
                <div>
                    <label>학부명</label>
                    <select
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                        className={deptListStyles.selectBox}
                    >
                        <option value="">{facultyDefault || "학부 선택"}</option>
                        {departmentOptions.map((dep, i) => (
                            <option key={i} value={dep.name}>
                                {dep.name}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                <input
                    type="text"
                    placeholder="학부 명"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className={!faculty ? deptListStyles.transparentPlaceholder : ""}
                />
            )}

            {departments.map((dep, i) => (
                <div key={i} className={deptListStyles.departmentBlock}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                            type="text"
                            placeholder="학과명"
                            value={dep.name}
                            onChange={(e) => {
                                const newDepartments = [...departments];
                                newDepartments[i].name = e.target.value;
                                setDepartments(newDepartments);
                            }}
                        />
                        {/* ✅ 학과 삭제 버튼 */}
                        <button
                            className={` ${deptListStyles.deleteButton}`}
                            onClick={() => {
                                const newDepartments = departments.filter((_, idx) => idx !== i);
                                setDepartments(newDepartments);
                            }}
                        >
                            ➖
                        </button>
                    </div>

                    {/* 전공 */}
                    {dep.name &&
                        dep.majors.map((m, j) => (
                            <div
                                key={j}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginLeft: "20px",
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="전공명"
                                    value={m}
                                    onChange={(e) => {
                                        const newDepartments = [...departments];
                                        newDepartments[i].majors[j] = e.target.value;
                                        setDepartments(newDepartments);
                                    }}
                                />
                                {/* ✅ 전공 삭제 버튼 */}
                                <button
                                    className={`${deptListStyles.deleteButton}`}
                                    onClick={() => {
                                        const newDepartments = [...departments];
                                        newDepartments[i].majors = newDepartments[i].majors.filter(
                                            (_, idx) => idx !== j
                                        );
                                        setDepartments(newDepartments);
                                    }}
                                >
                                    ➖
                                </button>
                            </div>
                        ))}

                    {dep.name && (
                        <button
                            className={deptListStyles.addMinorButton}
                            onClick={() => {
                                const newDepartments = [...departments];
                                newDepartments[i].majors.push("");
                                setDepartments(newDepartments);
                            }}
                        >
                            전공 추가
                        </button>
                    )}
                </div>
            ))}

            {/* 학과 추가 버튼 */}
            <button
                className={deptListStyles.addDepartmentButton}
                onClick={() => setDepartments([...departments, { name: "", majors: [] }])}
            >
                학과 추가
            </button>


            <div className={deptListStyles.formActions}>
                <button className={deptListStyles.saveButton} onClick={handleSave}>
                    저장
                </button>
                <button className={deptListStyles.cancelButton} onClick={Close}>
                    취소
                </button>
            </div>
        </div>
    );
};
