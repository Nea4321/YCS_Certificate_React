import { memo } from "react"
import type { DeptMapData } from "@/entities/department/model"
import { departmentDetailStyles } from "../styles"
import { Link } from "react-router-dom"
import { DepartmentCalendar } from "@/features/department/DepartmentCalendar/DepartmentCalendar.tsx"

interface DepartmentDetailProps {
    department: DeptMapData
}

export const DepartmentDetail = memo(({ department }: DepartmentDetailProps) => {
    return (
        <div className={departmentDetailStyles.container}>
            <div className={departmentDetailStyles.header}>
                <h1 className={departmentDetailStyles.title}>{department.dept_map_name}</h1>
            </div>

            <div className={departmentDetailStyles.content}>


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

                <section className={departmentDetailStyles.descriptionSection}>
                    <h2>학과 소개</h2>
                    <div className={departmentDetailStyles.description}>
                        {department.description || "학과 소개 정보가 없습니다."}
                    </div>
                </section>

                {/* 메인코드에서 추가된 캘린더 */}
                <section className={departmentDetailStyles.calendarSection}>
                    <h2>자격증 시험 일정</h2>
                    {/* dept_map_id를 통해서 해당 학과 자격증 구분 */}
                    <DepartmentCalendar dept_map_id={department.dept_map_id} />
                </section>
            </div>
        </div>
    )
})

DepartmentDetail.displayName = "DepartmentDetail"
