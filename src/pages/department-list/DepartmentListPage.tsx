import { DepartmentList } from "./ui"
import { deptListStyles } from "./styles";
import {departmentEditStyles} from "@/pages/department_edit";
import {useNavigate} from "react-router-dom";

export const DepartmentListPage = () => {
    const navigate = useNavigate();

    return (
        <div className={deptListStyles.container}>
            <h1>학과 목록</h1>
            <button className={departmentEditStyles.addButton} onClick={()=>navigate("/departments_edit")}>수정 페이지</button>
            <DepartmentList />
        </div>
    )
}