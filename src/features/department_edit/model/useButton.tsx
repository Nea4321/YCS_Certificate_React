//import { departmentApi } from "../api/department";

export const useButton=() =>{

    const handleSave_edit = async (id: number | null, type: string, value: string | null) => {
        //const data = await departmentApi.getDetail(id);
        console.log("수정할 데이터", id);
        console.log("수정할 데이터", type);
        console.log("수정할 데이터", value);
    };

    const handleDelete = async (id: number, type: string, value: string) => {
        //await departmentApi.delete(id);
        console.log("수정할 데이터", id);
        console.log("수정할 데이터", type);
        console.log("수정할 데이터", value);
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