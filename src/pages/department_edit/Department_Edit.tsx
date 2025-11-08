import { DepartmentList_edit } from "./ui"
import { departmentEditStyles } from "./styles";
import { useNavigate } from "react-router-dom";
import {DepartmentEditSection} from "@/features/department_edit/components/DepartmentEditSection.tsx";
import {useEditSectionButton} from "@/features/department_edit/model/useEditSectionButton.tsx";
import {Popup} from "@/shared/popup";
import {departmentApi} from "@/entities";
import {useDataFetching} from "@/shared";

export const Department_Edit = () => {
    const navigate = useNavigate();
    const { data, loading, error, refetch } = useDataFetching({ fetchFn: departmentApi.getDeptList });
    const {handleOpen,isopen,handleClose,name,departments_name,type} = useEditSectionButton(refetch)

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
                <button
                    className={departmentEditStyles.addButton}
                    onClick={() => handleOpen("","faculty")}
                >
                    + 추가
                </button>
            </div>


            <DepartmentList_edit data={data} loading={loading} error={error} refetch={refetch}/>

            <Popup isOpen={isopen}>
             <DepartmentEditSection facultyDefault={name} parentType={type} departmentOptions={departments_name} onClose={handleClose} refetch={refetch} />
            </Popup>
        </div>
    )
}
