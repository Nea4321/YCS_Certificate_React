import {departmentStyles} from "@/pages/department_edit";
import {DepartmentEditPage} from "@/features/department_edit/components/DepartmentEditPage.tsx";
import {useDataFetching} from "@/shared";
import {departmentApi} from "@/entities";
import {DepartmentListSection_edit} from "@/features/department_edit";
import {DepartmentListSection} from "@/features";

export const DepartmentList = ()=>{

    const { data, loading, error, refetch } = useDataFetching({
        fetchFn:departmentApi.getDeptList
    })


    console.log(majorData)
    return (
        <div className={departmentStyles.container}>
            {
            data.map((dept) => (
            <DepartmentListSection_edit key={`${dept.parent_type}-${dept.parent_id}`} department={dept} />
            ))}
            <DepartmentEditPage />
        </div>
    )
}
