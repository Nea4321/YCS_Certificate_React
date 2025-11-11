import {memo} from "react"
import type { DeptMapData } from "@/entities/department/model"
import { departmentDetailStyles } from "../styles"
import { Link } from "react-router-dom"
import { CalendarWidget } from "@/widgets/calendar/ui/CalendarWidget.tsx";
import { useDepartmentSchedules } from "@/features/department/model/useDepartmentSchedules";
import { AdditionalInfoSection } from "@/features/department/ui/AdditionalInfoSection";
import {FavoriteButton} from "@/features/favorite";
import {RootState} from "@/app/store";
import {useSelector} from "react-redux";

/**DepartmentDetail에 전달할 props
 *
 * @property {DeptMapData} department - 부모(Department)에게 전달받은 departmentData
 * - departmentData: 학과 목록에서 사용자가 클릭한 학과의 id를 사용해 로드한 데이터
 */
interface DepartmentDetailProps {
    department: DeptMapData
}

/**학과 상세 페이지 컴포넌트
 *
 * - 학과 목록 페이지에서 선택한 학과의 id를 사용해 해당 학과의 데이터를 로드한다
 * - 이후 전달받은 데이터를 DepartmentDetail이 배치한다
 * - 전달받은 데이터를 사용해 해당 학과의 관련 자격증을 표시할 수 있으며
 *   관련 자격증들의 일정을 보여주는 캘린더를 배치한다
 * - 화면에 표시된 관련 자격증을 클릭하면 해당 자격증의 상세 페이지로 리다이렉트 가능
 * - 하단에 학과 소개 존재
 *
 * @param {DepartmentDetailProps} props - 컴포넌트에 전달되는 props
 * @param {DeptMapData} props.department - 학과 데이터 객체
 *
 * @component*/
export const DepartmentDetail = memo(({ department }: DepartmentDetailProps) => {
    const { events, isLoading, error } = useDepartmentSchedules(department.cert);
    const descriptionObject = department.description as unknown as Record<string, string>;
    const introduction = descriptionObject?.["학과소개"];
    const userName = useSelector((state: RootState) => state.user.userName)

    return (
        <div className={departmentDetailStyles.container}>
            <div className={departmentDetailStyles.header}>
                <div className={departmentDetailStyles.titlebox}>
                <h1 className={departmentDetailStyles.title}>{department.dept_map_name}</h1>
                    {userName? (<FavoriteButton exist={department.dept_map_name} id={department.dept_map_id} type={"department"}/>) :null}
                </div>
            </div>

            <div className={departmentDetailStyles.content}>
                {introduction && (
                    <section className={departmentDetailStyles.descriptionSection}>
                        <h2>학과 소개</h2>
                        <div className={departmentDetailStyles.description}>
                        <p className={departmentDetailStyles.descriptionText}>{introduction}</p>
                        </div>
                    </section>
                )}
                <section className={departmentDetailStyles.calendarSection}>
                    <h2>자격증 시험 일정</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {!isLoading && (
                        <CalendarWidget
                            events={events}
                            loading={isLoading}
                        />
                    )}
                </section>

                <section className={departmentDetailStyles.certificatesSection}>
                    <h2>관련 자격증</h2>
                    {department.cert && department.cert.length > 0 ? (
                        <div className={departmentDetailStyles.certificateGrid}>
                            {department.cert.map((certificate) => (
                                <Link to={`/certificate/${certificate.certificate_id}`} key={certificate.certificate_id} className={departmentDetailStyles.certificateCard}>
                                    <h3 className={departmentDetailStyles.certificateName}>{certificate.certificate_name}</h3>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className={departmentDetailStyles.noCertificates}>관련 자격증 정보가 없습니다.</div>
                    )}
                </section>

                <AdditionalInfoSection description={descriptionObject} />
            </div>
        </div>

    )
})

DepartmentDetail.displayName = "DepartmentDetail"
