import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CBTExamStyles } from '../styles';
import { CategoryFilter } from '@/features/cbt/category-filter/ui/CategoryFilter';
import { Pagination } from '@/features/cbt/pagination/ui/Pagination';
import { useNavigate } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';
import type { RootState } from '@/app/store/store';
import { certificateTags, loadCertTagMap } from '@/entities/certificate';
import { Certificate } from '@/entities/certificate/model/types';

/** certificate 모델에 tag 필드를 덧붙임 */
type UICertificate = Certificate & { tags: string[] };

/**
 * 자격증 목록을 가져와 id 기반 태그를 부여하고,
 * 선택된 태그로 필터링하여 자격증 CBT 리스트를 보여주는 컴포넌트
 * (이제 /api/cbt 에서 "문제가 있는 자격증만" 가져옴)
 */
export const CBTExamPage: React.FC = () => {
    const userName = useSelector((state: RootState) => state.user.userName);
    const isGuest = !userName;

    /** 태그가 부여된 자격증 리스트 (이미 CBT 문제 있는 자격증만) */
    const [certificates, setCertificates] = useState<UICertificate[]>([]);
    /** 현재 선택된 태그 (기본값: 전체) */
    const [selectedTag, setSelectedTag] = useState<string>('전체');
    /** 현재 페이지 번호 */
    const [currentPage, setCurrentPage] = useState<number>(1);
    /** 한 페이지에 보여줄 자격증 개수 */
    const itemsPerPage = 12;

    const navigate = useNavigate();
    const rawRef = useRef<Certificate[] | null>(null);

    const tagList = useSelector((s: RootState) => s.tag.list, shallowEqual);
    const tagMetaMap = useMemo(() => {
        return new Map(
            tagList.map(t => [
                t.tag_id,
                { name: t.tag_Name, color: t.tag_color },
            ])
        );
    }, [tagList]);

    useEffect(() => {
        if (isGuest) {
            alert('로그인이 필요합니다. 로그인 후 CBT 시험을 이용할 수 있습니다.');
            navigate('/auth', { replace: true });
        }
    }, [isGuest, navigate]);

    /**
     * /api/cbt 호출해서 "문제가 있는 자격증만" 가져옴
     * 응답 예:
     * [
     *   {
     *     "certificate_id": 173,
     *     "certificate_name": "사무자동화산업기사",
     *     "jmcd": "2193",
     *     "organization_id": 1,
     *     "tag": [1, 21]
     *   },
     *   ...
     * ]
     */
    useEffect(() => {
        if (isGuest) return; // 게스트면 API 호출하지 않음

        const controller = new AbortController();

        fetch('/api/cbt', { signal: controller.signal })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch /api/cbt: ${res.status}`);
                }
                return res.json();
            })
            .then((data: Certificate[]) => {
                rawRef.current = data;

                // 백엔드에서 내려주는 tag(id 배열)를 기반으로 전역 맵 갱신
                loadCertTagMap(data);

                const withTags: UICertificate[] = data.map(cert => {
                    // certificate_id -> tagId[] 매핑에서 태그 id 목록 가져오기
                    const ids = certificateTags[cert.certificate_id] ?? [];
                    // id -> 태그 이름으로 변환
                    const names = ids
                        .map(id => tagMetaMap.get(id)?.name)
                        .filter((v): v is string => !!v);

                    return { ...cert, tags: names };
                });

                setCertificates(withTags);
            })
            .catch(console.error);

        return () => controller.abort();
    }, [isGuest, tagMetaMap]);

    /** 태그가 변경되면 페이지를 1로 리셋 */
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedTag]);

    /**
     * 선택된 태그가 '전체'라면 /api/cbt 결과 전체(= 문제 있는 자격증들)를 표시
     * '전체'가 아니라면 선택한 태그 기준으로 자격증 리스트를 필터링
     * 🔥 "문제 O" 관련 하드코딩 필터는 제거
     */
    const filteredCertificates =
        selectedTag === '전체'
            ? certificates
            : certificates.filter(cert => cert.tags.includes(selectedTag));

    const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);

    const paginatedCertificates = filteredCertificates.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    /** CBT 시작 버튼 클릭 시: 자격증 id/이름을 쿼리스트링에 담아 CBTStartPage로 이동 */
    const handleStartClick = (cert: Certificate) => {
        const query = new URLSearchParams({
            certificateId: cert.certificate_id.toString(),
            certName: cert.certificate_name,
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
                        {selectedTag === '전체'
                            ? '문제가 있는 자격증 수 '
                            : `${selectedTag} 태그에서 `}
                        <strong>{filteredCertificates.length}</strong>
                        개의 자격증이 있습니다
                    </div>

                    <div className={CBTExamStyles.cbtExamGrid}>
                        {paginatedCertificates.map(cert => (
                            <div
                                key={cert.certificate_id}
                                className={CBTExamStyles.cbtExamCard}
                            >
                                <h3 className={CBTExamStyles.examTitle}>
                                    {cert.certificate_name}
                                </h3>

                                <p className={CBTExamStyles.examCategory}>
                                    {cert.tags.length
                                        ? cert.tags.join(' · ')
                                        : '\u00A0'}
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
