import React, { useEffect, useState } from 'react';
import { certificateApi } from '@/entities/certificate/api/certificate-api';
import { Certificate } from '@/entities';
import { CBTExamStyles } from '../styles';
import { CategoryFilter } from '@/features/cbt-category-filter/ui/CategoryFilter';
import { Pagination } from '@/features/cbt-pagination/ui/Pagination';

export const CBTExamPage: React.FC = () => {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('전체');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 12;

    useEffect(() => {
        const controller = new AbortController();

        certificateApi.getCertificate(controller.signal)
            .then((data) => {
                const mapped = data.map((cert) => {
                    if (
                        cert.certificate_name.includes('정보처리') ||
                        cert.certificate_name.includes('컴퓨터')
                    ) {
                        return { ...cert, category: 'IT/컴퓨터' };
                    }

                    if (
                        cert.certificate_name.includes('운전') ||
                        cert.certificate_name.includes('운송')
                    ) {
                        return { ...cert, category: '운전/운송' };
                    }
                    if (
                        cert.certificate_name.includes('화공') ||
                        cert.certificate_name.includes('화학') ||
                        cert.certificate_name.includes('위험물')
                    ) {
                        return { ...cert, category: '화학' };
                    }
                    if (
                        cert.certificate_name.includes('한식') ||
                        cert.certificate_name.includes('양식') ||
                        cert.certificate_name.includes('중식') ||
                        cert.certificate_name.includes('조리') ||
                        cert.certificate_name.includes('복어') ||
                        cert.certificate_name.includes('일식')
                    ) {
                        return { ...cert, category: '조리' };
                    }
                    if (
                        cert.certificate_name.includes('전기') ||
                        cert.certificate_name.includes('전자')
                    ) {
                        return { ...cert, category: '전기/전자' };
                    }
                    if (
                        cert.certificate_name.includes('항공')
                    ) {
                        return { ...cert, category: '항공' };
                    }
                    if (
                        cert.certificate_name.includes('안전')
                    ) {
                        return { ...cert, category: '안전' };
                    }
                    if (
                        cert.certificate_name.includes('기상') ||
                        cert.certificate_name.includes('에너지')
                    ) {
                        return { ...cert, category: '기상' };
                    }
                    if (
                        cert.certificate_name.includes('이용') ||
                        cert.certificate_name.includes('미용')
                    ) {
                        return { ...cert, category: '이용/미용' };
                    }
                    if (
                        cert.certificate_name.includes('금속') ||
                        cert.certificate_name.includes('판금') ||
                        cert.certificate_name.includes('주조') ||
                        cert.certificate_name.includes('용접') ||
                        cert.certificate_name.includes('표면')
                    ) {
                        return { ...cert, category: '재료' };
                    }
                    if (
                        cert.certificate_name.includes('농업') ||
                        cert.certificate_name.includes('원예') ||
                        cert.certificate_name.includes('축산') ||
                        cert.certificate_name.includes('식물') ||
                        cert.certificate_name.includes('버섯') ||
                        cert.certificate_name.includes('수산') ||
                        cert.certificate_name.includes('어업') ||
                        cert.certificate_name.includes('종자')
                    ) {
                        return { ...cert, category: '농림어업' };
                    }
                    if (
                        cert.certificate_name.includes('기계') ||
                        cert.certificate_name.includes('공조냉동') ||
                        cert.certificate_name.includes('설비') ||
                        cert.certificate_name.includes('조선')
                    ) {
                        return { ...cert, category: '기계' };
                    }
                    if (
                        cert.certificate_name.includes('건설') ||
                        cert.certificate_name.includes('건축') ||
                        cert.certificate_name.includes('토목') ||
                        cert.certificate_name.includes('조경')
                    ) {
                        return { ...cert, category: '건설' };
                    }
                    if (
                        cert.certificate_name.includes('환경') ||
                        cert.certificate_name.includes('생물') ||
                        cert.certificate_name.includes('대기') ||
                        cert.certificate_name.includes('폐기물') ||
                        cert.certificate_name.includes('토양')
                    ) {
                        return { ...cert, category: '환경' };
                    }
                    if (
                        cert.certificate_name.includes('사회조사') ||
                        cert.certificate_name.includes('소비자') ||
                        cert.certificate_name.includes('컨벤션') ||
                        cert.certificate_name.includes('폐기물')
                    ) {
                        return { ...cert, category: '경영' };
                    }

                    return cert;
                });

                setCertificates(mapped);
            })
            .catch((err) => console.error(err));

        return () => controller.abort();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    const filteredCertificates = selectedCategory === '전체'
        ? certificates
        : certificates.filter(cert => cert.category === selectedCategory);

    const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
    const paginatedCertificates = filteredCertificates.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className={CBTExamStyles.pageBackground}>
            <div className={CBTExamStyles.contentCard}>
                <div className={CBTExamStyles.cbtContainer}>
                    <h1 className={CBTExamStyles.cbtTitle}>CBT 자격증 시험</h1>
                    <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                </div>
            </div>

            <div className={CBTExamStyles.examListSection}>
                <div className={CBTExamStyles.examContainer}>
                    <div className={CBTExamStyles.cbtCountInfo}>
                        {selectedCategory === '전체' ? '전체 자격증 수 ' : `${selectedCategory} 카테고리에서 `}
                        <strong>{filteredCertificates.length}</strong>개의 자격증이 있습니다
                    </div>

                    <div className={CBTExamStyles.cbtExamGrid}>
                        {paginatedCertificates.map((cert) => (
                            <div key={cert.certificate_id} className={CBTExamStyles.cbtExamCard}>
                                <h3 className={CBTExamStyles.examTitle}>{cert.certificate_name}</h3>
                                <p className={CBTExamStyles.examCategory}>{cert.category || '\u00A0'}</p>
                                <button className={CBTExamStyles.cbtStartButton}>CBT 시작하기</button>
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

export default CBTExamPage;
