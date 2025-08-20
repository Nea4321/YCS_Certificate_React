// CBTExamPage.tsx
import React, { useEffect, useState } from 'react';
import { certificateApi } from '@/entities/certificate/api/certificate-api';
import { Certificate } from '@/entities';
import { CBTExamStyles } from '../styles';
import { CategoryFilter } from '@/features/cbt-category-filter/ui/CategoryFilter';
import { Pagination } from '@/features/cbt-pagination/ui/Pagination';
import { useNavigate } from 'react-router-dom';
import { certificateTags } from '@/entities/certificate/model/tags';

type UICertificate = Certificate & { tags: string[] };

export const CBTExamPage: React.FC = () => {
    const [certificates, setCertificates] = useState<UICertificate[]>([]);
    const [selectedTag, setSelectedTag] = useState<string>('전체');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 12;
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();

        certificateApi.getCertificate(controller.signal)
            .then((data: Certificate[]) => {
                const withTags: UICertificate[] = data.map(cert => ({
                    ...cert,
                    tags: certificateTags[cert.certificate_id] ?? []
                }));
                setCertificates(withTags);
            })
            .catch((err) => console.error(err));

        return () => controller.abort();
    }, []);


    useEffect(() => {
        setCurrentPage(1);
    }, [selectedTag]);

    const filteredCertificates =
        selectedTag === '전체'
            ? certificates
            : certificates.filter(cert => cert.tags.includes(selectedTag));

    const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);

    const paginatedCertificates = filteredCertificates.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleStartClick = (cert: Certificate) => {
        const query = new URLSearchParams({
            certId: cert.certificate_id.toString(),
            certName: cert.certificate_name
        }).toString();
        navigate(`/cbt/start?${query}`);
    };

    return (
        <div className={CBTExamStyles.pageBackground}>
            <div className={CBTExamStyles.contentCard}>
                <div className={CBTExamStyles.cbtContainer}>
                    <h1 className={CBTExamStyles.cbtTitle}>CBT 자격증 시험</h1>
                    <CategoryFilter
                        selectedCategory={selectedTag}
                        setSelectedCategory={setSelectedTag}
                    />
                </div>
            </div>

            {/* 자격증 리스트 */}
            <div className={CBTExamStyles.examListSection}>
                <div className={CBTExamStyles.examContainer}>
                    <div className={CBTExamStyles.cbtCountInfo}>
                        {selectedTag === '전체' ? '전체 자격증 수 ' : `${selectedTag} 태그에서 `}
                        <strong>{filteredCertificates.length}</strong>개의 자격증이 있습니다
                    </div>

                    <div className={CBTExamStyles.cbtExamGrid}>
                        {paginatedCertificates.map((cert) => (
                            <div key={cert.certificate_id} className={CBTExamStyles.cbtExamCard}>
                                <h3 className={CBTExamStyles.examTitle}>{cert.certificate_name}</h3>

                                <p className={CBTExamStyles.examCategory}>
                                    {cert.tags.length ? cert.tags.join(' · ') : '\u00A0'}
                                </p>

                                <button
                                    className={CBTExamStyles.cbtStartButton}
                                    onClick={() => handleStartClick(cert)}
                                >
                                    CBT 시작하기
                                </button>
                            </div>
                        ))}
                    </div>

                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};
