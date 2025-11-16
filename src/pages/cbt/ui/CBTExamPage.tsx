import React, {useEffect, useMemo, useRef, useState} from 'react';
import { certificateApi } from '@/entities/certificate/api/certificate-api';
import { Certificate } from "@/entities/certificate/model/types";
import { CBTExamStyles } from '../styles';
import { CategoryFilter } from '@/features/cbt/category-filter/ui/CategoryFilter';
import { Pagination } from '@/features/cbt/pagination/ui/Pagination';
import { useNavigate } from 'react-router-dom';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import type { RootState } from '@/app/store/store';
import { certificateTags, loadCertTagMap } from '@/entities/certificate';
import { questions as mockQuestions } from "@/entities/cbt/lib/mockQuestions";
import {setCbtHistory} from "@/shared/slice";

/**certificate 모델에 tag 필드를 덧붙임*/
type UICertificate = Certificate & { tags: string[] };

/**자격증 목록을 가져와 id 기반 태그를 부여하고,
 * 선택된 태그로 필터링하여 자격증 CBT 리스트를 보여주는 컴포넌트
 *
 * @component
 */
export const CBTExamPage: React.FC = () => {
    /**태그가 부여된 자격증 리스트*/
    const [certificates, setCertificates] = useState<UICertificate[]>([]);
    /**현재 선택된 태그 (기본값: 전체)*/
    const [selectedTag, setSelectedTag] = useState<string>('전체');
    /**현재 페이지 번호*/
    const [currentPage, setCurrentPage] = useState<number>(1);
    /**한 페이지에 보여줄 자격증 개수*/
    const itemsPerPage = 12;
    const navigate = useNavigate();
    const rawRef = useRef<Certificate[] | null>(null);
    const tagList = useSelector((s: RootState) => s.tag.list, shallowEqual);
    const tagMetaMap = useMemo(() => {
        return new Map(tagList.map(t => [t.tag_id, { name: t.tag_Name, color: t.tag_color }]));
    }, [tagList]);
    const questionCertIdSet = useMemo(
        () => new Set(mockQuestions.map(q => q.certificate_id)),
        []
    );
    const dispatch = useDispatch();
    /**자격증 목록을 가져와 certificate_id을 기반으로 태그를 부여함
     * 만약 certificate_id가 없는 자격증은 빈 배열
     */
    useEffect(() => {
        const controller = new AbortController();
        certificateApi.getCertificate(controller.signal)
            .then((data) => {
                rawRef.current = data;
                loadCertTagMap(data);
                const withTags: UICertificate[] = data.map(cert => {
                    const ids = certificateTags[cert.certificate_id] ?? [];
                    const names = ids.map(id => tagMetaMap.get(id)?.name).filter((v): v is string => !!v);
                    return { ...cert, tags: names };
                });
                setCertificates(withTags);
            })
            .catch(console.error);
        return () => controller.abort();
    }, []);


    /**태그가 변경되면 페이지를 1로 리셋함*/
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedTag]);

    /**선택된 태그가 '전체'라면 모든 자격증을 화면에 표시함
     * '전체'가 아니라면 선택한 태그 기준으로 자격증 리스트를 필터링하여 표시
     */
    const filteredCertificates =
        selectedTag === '전체'
            ? certificates
            : selectedTag === "문제 O"
                ? certificates.filter(cert => questionCertIdSet.has(cert.certificate_id))
                : certificates.filter(cert => cert.tags.includes(selectedTag));

    const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);

    const paginatedCertificates = filteredCertificates.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    /**CBT 시작 버튼 클릭 시 해당 자격증의 id와 이름을 쿼리스트링에 담아 CBTStartPage로 이동한다
     *
     * @param {Certificate} cert - 선택한 자격증 객체
     */
    const handleStartClick = (cert: Certificate) => {
        // cbt 시작하기 눌렀을 때 redux에 자격증 아이디 저장
        dispatch(setCbtHistory({certificate_id: cert.certificate_id || 0,}))
        const query = new URLSearchParams({
            certificateId: cert.certificate_id.toString(),
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
                        {selectedTag === "전체"
                            ? "전체 자격증 수 "
                            : selectedTag === "문제 O"
                                ? "문제가 있는 자격증 수 "
                                : `${selectedTag} 태그에서 `}
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
