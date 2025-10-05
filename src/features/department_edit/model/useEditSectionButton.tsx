import {useState} from "react";
import {useDataFetching} from "@/shared";
import {departmentApi} from "@/entities";

export const useEditSectionButton=() =>{
    const [isopen, setIsopen] = useState<boolean>(false)
    const [name, setName] = useState<string>("")
    const [type, setType] = useState<string>("")
    const [departments_name, setDepartments] = useState<string[]>([]);
    const { data } = useDataFetching({
        fetchFn:departmentApi.getDepartList_edit
    })
    console.log("data",data)

    // const { data: DeptMap, error: DeptMapError } = useDataFetching({
    //     fetchFn:departmentApi.getDeptMap
    // })
    // const { data: Faculty, error: FacultyError } = useDataFetching({
    //     fetchFn:departmentApi.getFaculty
    // })
    // const { data: Department, error: DepartmentError } = useDataFetching({
    //     fetchFn:departmentApi.getDepartment
    // })
    // const { data: Major, error: MajorError } = useDataFetching({
    //     fetchFn:departmentApi.getMajor
    // })

    const handleOpen = (parent_name:string, parent_type:string) => {
          setIsopen(true);
          setName(parent_name)
          setType(parent_type)
            const targetParent = data.find(faculty => faculty.facultyName === parent_name);
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

    // const handleDepartmentChange = (index: number, name: string) => {
    //
    // };
    //
    // const handleAddMajor = (depIndex: number) => {
    //
    // };
    //
    // const handleMajorChange = (depIndex: number, majorIndex: number, name: string) => {
    //
    // };

    const handleSave = () => {

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