import {useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/app/store";
import axios from "axios";

// 전공 DTO
interface DepartmentCreateDTO {
    name: string;
    majors: string[];
}

// 학부 DTO
interface FacultyCreateRequestDTO {
    facultyName: string;
    department: DepartmentCreateDTO[];
}

export const useEditSectionButton=(refetch: (() => void) | undefined)  =>{
    const [isopen, setIsopen] = useState<boolean>(false)
    const [name, setName] = useState<string>("")
    const [type, setType] = useState<string>("")
    const [departments_name, setDepartments] = useState<string[]>([]);
    const faculty = useSelector((state:RootState)=> state.faculty?.list ??[])



    const handleOpen = (parent_name:string, parent_type:string) => {
          setIsopen(true);
          setName(parent_name)
          setType(parent_type)

            const targetParent = faculty.find(f => f.facultyName === parent_name)
        if (targetParent) {
            setDepartments(targetParent.departments); // string[] 그대로 저장
        } else {
            setDepartments([]);
        }

    };
    const handleClose = () => {
        setIsopen(false);
    };

    const handleAddDepartment = () => {

    };


    const handleSave = async (faculty: string, departments: { name: string; majors: string[] }[]) => {
        console.log("faculty,department", faculty, departments);
        const result = confirm("저장 하시겠습니까?")
        const payload: FacultyCreateRequestDTO = {
            facultyName: faculty,         // string
            department: departments       // DepartmentCreateDTO[]
        };

        if (result) {
             await axios.post('/api/dept/create', payload);
            setIsopen(false);
            refetch?.()
        }
    };

    return{
        name,
        type,
        handleOpen,
        isopen,
        departments_name,
        handleClose,
        handleSave,
        handleAddDepartment,
        // handleDepartmentChange,
        // handleMajorChange,
        // handleAddMajor,
    }
}