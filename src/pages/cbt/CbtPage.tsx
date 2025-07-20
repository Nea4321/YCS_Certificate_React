import { CBTExamPage } from "./ui"
import { CBTExamStyles } from "./styles"

export const CbtPage = () => {
    return (
     <div className="pageBackground">
         <div className={CBTExamStyles.container}>
            <CBTExamPage />
        </div>
     </div>
    )
}
