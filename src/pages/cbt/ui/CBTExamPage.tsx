import React, { useEffect, useState } from 'react';
import { certificateApi } from '@/entities/certificate/api/certificate-api';
import { Certificate } from '@/entities';
import { CBTExamStyles } from '../styles';
import { CategoryFilter } from '@/features/cbt-category-filter/ui/CategoryFilter';
import { Pagination } from '@/features/cbt-pagination/ui/Pagination';
import { useNavigate } from 'react-router-dom';

/**
 * 카테고리에 맞는 자격증들을 보여주는 페이지
 *
 * 자격증 이름에 있는 특정 키워드에 맞는 카테고리를 자격증에 부여한다
 *
 * 해당하는 카테고리에 맞는 자격증만 필터로 노출시킬 수 있다
 */
export const CBTExamPage: React.FC = () => {
    const [certificates, setCertificates] = useState<Certificate[]>([]); // 자격증 목록 상태
    const [selectedCategory, setSelectedCategory] = useState<string>('전체'); // 카테고리 상태(기본값:전체)
    const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지 상태
    const itemsPerPage = 12; // 한 페이지에 보여 줄 자격증 개수
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();

        /**DB에 존재하는 자격증을 가져오고 키워드로 카테고리 부여*/
        certificateApi.getCertificate(controller.signal)
            .then((data) => {
                const mapped = data.map((cert) => {
                    // 하드코딩으로 불러온 자격증 키워드로 카테고리 부여
                    if (cert.certificate_name.includes('정보처리') || cert.certificate_name.includes('컴퓨터'))
                        return { ...cert, category: 'IT/컴퓨터' };
                    if (cert.certificate_name.includes('운전') || cert.certificate_name.includes('운송'))
                        return { ...cert, category: '운전/운송' };
                    if (cert.certificate_name.includes('화공') || cert.certificate_name.includes('화학') || cert.certificate_name.includes('위험물'))
                        return { ...cert, category: '화학' };
                    if (cert.certificate_name.includes('한식') || cert.certificate_name.includes('양식') || cert.certificate_name.includes('조리'))
                        return { ...cert, category: '조리' };
                    if (cert.certificate_name.includes('전기') || cert.certificate_name.includes('전자'))
                        return { ...cert, category: '전기/전자' };
                    if (cert.certificate_name.includes('항공'))
                        return { ...cert, category: '항공' };
                    if (cert.certificate_name.includes('안전'))
                        return { ...cert, category: '안전' };
                    if (cert.certificate_name.includes('기상') || cert.certificate_name.includes('에너지'))
                        return { ...cert, category: '기상' };
                    if (cert.certificate_name.includes('이용') || cert.certificate_name.includes('미용'))
                        return { ...cert, category: '이용/미용' };
                    if (cert.certificate_name.includes('금속') || cert.certificate_name.includes('용접'))
                        return { ...cert, category: '재료' };
                    if (cert.certificate_name.includes('농업') || cert.certificate_name.includes('수산'))
                        return { ...cert, category: '농림어업' };
                    if (cert.certificate_name.includes('기계') || cert.certificate_name.includes('설비'))
                        return { ...cert, category: '기계' };
                    if (cert.certificate_name.includes('건설') || cert.certificate_name.includes('조경'))
                        return { ...cert, category: '건설' };
                    if (cert.certificate_name.includes('환경') || cert.certificate_name.includes('대기'))
                        return { ...cert, category: '환경' };
                    if (cert.certificate_name.includes('사회조사') || cert.certificate_name.includes('소비자'))
                        return { ...cert, category: '경영' };
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

    /**선택된 카테고리에 따른 자격증을 필터링*/
    const filteredCertificates = selectedCategory === '전체'
        ? certificates
        : certificates.filter(cert => cert.category === selectedCategory);

    /**전체 페이지 수 계산
     *
     * 현재 카테고리 자격증 / 한 페이지에 보여줄 자격증 수(12)
     */
    const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);

    /**현재 페이지에 맞는 자격증 목록을 반환
     *
     * (현재 페이지 -1) * 한 페이지에 보여줄 자격증 개수
     */
    const paginatedCertificates = filteredCertificates.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    /**CBT 페이지 접근을 위해 필요한 정보를 쿼리스트링에 담아 페이지 이동
     *
     * @param {Certificate} cert - 선택된 자격증 객체
     * @param {number} cert.certificate_id - 자격증 고유 id
     * @param {string} cert.certificate_name - 자격증 이름
     *
     * @example
     * handleStartClick({
     *  certificate_id: 274
     *  certificate_name: 정보처리산업기사
     *  });
     *  결과: cbt/start?certId=274&certName=정보처리산업기사
     */
    const handleStartClick = (cert: Certificate) => {
        const query = new URLSearchParams({
            certId: cert.certificate_id.toString(),
            certName: cert.certificate_name
        }).toString();
        navigate(`/cbt/start?${query}`);
        // CBT 시작 버튼을 누르면 해당하는 자격증의 ID, 이름을 쿼리스트링에 담아 cbt/start 접근
    };

    return (
        <div className={CBTExamStyles.pageBackground}>
            {/*카테고리 필터*/}
            <div className={CBTExamStyles.contentCard}>
                <div className={CBTExamStyles.cbtContainer}>
                    <h1 className={CBTExamStyles.cbtTitle}>CBT 자격증 시험</h1>
                    <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                </div>
            </div>

            {/*자격증 리스트*/}
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