//import { departmentApi } from "../api/department";

export const useButton=() =>{

    const handleSave_edit = async (id: number, child_type: string, editValue: string) => {
        //const data = await departmentApi.getDetail(id);
        console.log("수정할 데이터", id);
    };

    const handleDelete = async (id: number, child_type: string) => {
        //await departmentApi.delete(id);
        const result = confirm("정말 삭제하시겠습니까?")
        if (result) {
            /* 삭제api */
        }

        else {
            //console.log(`${id} 삭제됨`);
        }

    };

    return {
        handleSave_edit,
        handleDelete,
    }
}