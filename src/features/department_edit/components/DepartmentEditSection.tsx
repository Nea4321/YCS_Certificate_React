import { useState } from "react";
import { useEditSectionButton } from "@/features/department_edit/model/useEditSectionButton.tsx";
import {departmentEditStyles} from "@/pages/department_edit";

interface AddDepartmentModalProps {
    facultyDefault?: string;
    parentType?: string
    departmentOptions?: string[];
    isopen: boolean;
    onClose?: () => void;
}

export const DepartmentEditSection = ({
                                          facultyDefault,
                                          parentType = "faculty",
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
    console.log("targetParent:", departmentOptions);

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        if (!selectedName) return;

        // 이미 같은 학과가 추가되어 있으면 중복 추가 안 함
        const exists = departments.some((dep) => dep.name === selectedName);
        if (!exists) {
            setDepartments([...departments, { name: selectedName, majors: [] }]);
        }
    };


    const addMinor = (deptIndex: number) => {
        const newDepartments = [...departments];
        newDepartments[deptIndex].majors.push("");
        setDepartments(newDepartments);
    };

    const {
        handleSave        
    } = useEditSectionButton();

    if (!isopen) return null;

    return (
        <div className={`${departmentEditStyles.facultyItem} ${departmentEditStyles.addForm}`}>
            <h3>새 학부/학과/전공 추가</h3>
            {parentType === "faculty" ? (
            facultyDefault ? (
                <div>
                    <label style={{ display: "block", marginBottom: "4px" }}>학부명</label>
                    <select
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                        className={departmentEditStyles.selectBox}
                    >
                        <option value="">{facultyDefault || "학부 선택"}</option>
                    </select>
                    <label style={{ display: "block", marginBottom: "4px" }}>학과명</label>
                    <select onChange={handleDepartmentChange} defaultValue="">
                        <option value="">학과 선택</option>
                        {departmentOptions?.map((dept, i) => (
                            <option key={i} value={dept}>
                                {dept}
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
                    className={!faculty ? departmentEditStyles.transparentPlaceholder : ""}
                />
            )
            ) : (<div>
                <label style={{ display: "block", marginBottom: "4px" }}>학과명</label>
                <select onChange={handleDepartmentChange} defaultValue="">
                    <option value="">{facultyDefault || "학과 선택"}</option>
                </select>
            </div>)}

            {departments.map((dep, i) => (
                <div key={i} className={departmentEditStyles.departmentBlock}>
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
                            className={` ${departmentEditStyles.deleteButton}`}
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
                                    className={`${departmentEditStyles.deleteButton}`}
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
                            className={departmentEditStyles.addMinorButton}
                            onClick={()=> addMinor(i)}
                        >
                            전공 추가
                        </button>
                    )}
                </div>
            ))}

            {/* 학과 추가 버튼 */}
            {parentType === "faculty" ? (
            <button
                className={departmentEditStyles.addDepartmentButton}
                onClick={() => setDepartments([...departments, { name: "", majors: [] }])}
            >
                학과 추가
            </button>
            ): (<button
                className={departmentEditStyles.addMinorButton}
                onClick={()=> {
                    setDepartments([...departments, { name: facultyDefault ?? "", majors: [] }]);
                    addMinor(departments.length - 1)
                }
            }
            >
                전공 추가
            </button>)}


            <div className={departmentEditStyles.formActions}>
                <button className={departmentEditStyles.saveButton} onClick={handleSave}>
                    저장
                </button>
                <button className={departmentEditStyles.cancelButton} onClick={Close}>
                    취소
                </button>
            </div>
        </div>
    );
};
