import {useState} from "react";

export const useEditSectionButton=() =>{
    const [isopen, setIsopen] = useState<boolean>(false)
    const [name, setName] = useState<string>("")

    const handleOpen = (parent_name:string) => {
          setIsopen(true);
          setName(parent_name)
    };
    const handleClose = () => {
        setIsopen(false);
    };

    const handleAddDepartment = () => {

    };

    const handleDepartmentChange = (index: number, name: string) => {

    };

    const handleAddMajor = (depIndex: number) => {

    };

    const handleMajorChange = (depIndex: number, majorIndex: number, name: string) => {

    };

    const handleSave = () => {

    };

    return{
        name,
        handleOpen,
        isopen,
        handleClose,
        handleSave,
        handleAddDepartment,
        handleDepartmentChange,
        handleMajorChange,
        handleAddMajor,
    }
}