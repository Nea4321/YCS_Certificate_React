import { Department } from "./ui"
import { departmentStyles } from "./styles"

export const DepartmentPage = () => {
    return (
        <div className={departmentStyles.container}>
            <Department />
        </div>
    )
}
