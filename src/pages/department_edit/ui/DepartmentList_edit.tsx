import { departmentApi } from "@/entities/department/api"
import { DepartmentListSection_edit } from "@/features/department_edit"
import { useDataFetching } from "@/shared/hooks";
import { departmentEditStyles } from "../styles";
import {DepartmentEditSection} from "@/features/department_edit/components/DepartmentEditSection.tsx";
import {useEditSectionButton} from "@/features/department_edit/model/useEditSectionButton.tsx";
import {Popup} from "@/shared/popup";
import {useDispatch} from "react-redux";
import {setFaculty_Department} from "@/shared/slice";

/**학과 목록 접근 컴포넌트*/
export const DepartmentList_edit = () => {
    const dispatch = useDispatch()
    /**학과 데이터를 가져오고 로딩, 에러, 재요청 기능을 제공하는 hooks
     * - 해당 학과의 id를 숫자로 변환하고 departmentApi.getDeptList에 전달하고
     *   해당 학과의 데이터를 API에 비동기 요청
     * - 요청 상태(loading, error)와 데이터(data)를 관리하고
     *   필요 시 refetch를 호출해 API 재요청 가능
     *
     * @property {object} data - 요청 성공 시 받아온 학과 목록 상세 데이터
     * @property {boolean} loading - 요청이 진행 중인지 여부
     * @property {string|null} error - 요청 실패 시의 에러 메시지
     * @property {() => Promise<void>} refetch - 데이터를 다시 요청하는 함수
     */
    const { data, loading, error, refetch } = useDataFetching({
        fetchFn:departmentApi.getDeptList
    })

    const { data: abc } = useDataFetching({
        fetchFn:departmentApi.getDepartList_edit,
    })
    dispatch(setFaculty_Department(abc))
    console.log("daaaaaaa",data)
    console.log("asad",abc)


    const {handleOpen,isopen,handleClose,name,departments_name,type} = useEditSectionButton(refetch)


    // 데이터가 없을 때의 처리
    /**현재 상태(로딩,에러,데이터없음,정상)에 따라 UI 렌더링
     *
     * @return 로딩/에러/데이터없음/정상 UI 중 하나를 반환
     */
    const renderContent = () => {
        if (loading) {
            return (
                <div className={departmentEditStyles.loading}>
                    <div className={departmentEditStyles.loadingSpinner}></div>
                    <p>데이터를 불러오는 중입니다...</p>
                </div>
            )
        }

        if (error) {
            return (
                <div className={departmentEditStyles.error}>
                    <p>오류: {error}</p>
                    <button className={departmentEditStyles.retryButton} onClick={() => void refetch()}>
                        다시 시도
                    </button>
                </div>
            )
        }

        if (data.length === 0) {
            return (
                <div className={departmentEditStyles.emptyState}>
                    <p>표시할 학과 정보가 없습니다.</p>
                </div>
            )
        }

        return (<>
                <div className={departmentEditStyles.facultyList}>
                    {
                        data.map((dept) => (
                            <DepartmentListSection_edit
                                key={`${dept.parent_type}-${dept.parent_id}`}
                                department={dept}
                                onAdd={handleOpen}
                                refetch={refetch}
                            />
                        ))}
                </div>
                <Popup isOpen={isopen}>
                 <DepartmentEditSection facultyDefault={name} parentType={type} departmentOptions={departments_name} onClose={handleClose} refetch={refetch} />
                </Popup>
            </>
        )
    }

    return <div className="department-list-container">{renderContent()}</div>
}

