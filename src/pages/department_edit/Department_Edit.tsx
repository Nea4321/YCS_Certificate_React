import { DepartmentList_edit } from "./ui"
import { departmentEditStyles } from "./styles";
import { useNavigate } from "react-router-dom";

export const Department_Edit = () => {
    const navigate = useNavigate();

    return (
        <div className={departmentEditStyles.container}>
            <div className={departmentEditStyles.header}>
                {/* 🔙 뒤로가기 버튼 (왼쪽) */}
                <button
                    className={departmentEditStyles.addButton}
                    onClick={() => navigate(-1)}
                >
                    뒤로가기
                </button>
                <h1 className={departmentEditStyles.title}>학과 목록</h1>
                <button className={departmentEditStyles.addButton}>+ 추가</button>
            </div>

            <DepartmentList_edit />
        </div>
    )
}
