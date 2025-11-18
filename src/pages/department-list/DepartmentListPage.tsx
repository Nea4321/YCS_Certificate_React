import { DepartmentList } from "./ui"
import { deptListStyles } from "./styles";
import {departmentEditStyles} from "@/pages/department_edit";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "@/app/store";

export const DepartmentListPage = () => {
    const navigate = useNavigate();
    const role = useSelector((state: RootState) => state.user.userRole);
    return (
        <div className={deptListStyles.container}>
            <h1>학과 목록</h1>
            {role === "admin" ? (
            <button className={departmentEditStyles.addButton} onClick={()=>navigate("/departments_edit")}>수정 페이지</button>
            ):null}
            <DepartmentList />
        </div>
    )
}