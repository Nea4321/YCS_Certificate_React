//import { departmentApi } from "../api/department";

import axios from "axios";

export const useButton= (refetch: (() => void) | undefined) =>{

    const handleSave_edit = async (id: number | null, type: string | null, value: string | null) => {
        const response = await axios.post('/api/dept/edit', { id,type,value });
        refetch?.()
        console.log(response);
    };

    const handleDelete = async (id: number, type: string, value: string) => {

        console.log("수정할 데이터", id);
        console.log("수정할 데이터", type);
        console.log("수정할 데이터", value);
        const result = confirm("정말 삭제하시겠습니까?")
        if (result) {
            const response = await axios.post('/api/dept/delete', { id,type,value });
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