import { DepartmentList } from "./ui"
import { deptListStyles } from "./styles";

export const DepartmentListPage = () => {
    return (
        <div className={deptListStyles.container}>
            <div className={deptListStyles.header}>
                <h1 className={deptListStyles.title}>학과 목록</h1>
                <button className={deptListStyles.addButton}>+ 추가</button>
            </div>
            <DepartmentList />
        </div>
    )
}

