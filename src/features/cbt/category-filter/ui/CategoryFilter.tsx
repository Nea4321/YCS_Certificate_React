import React, { useMemo } from 'react';
import CBTExamStyles from '@/pages/cbt/styles/CBTExamPage.module.css';
import { certificateTags } from '@/entities/certificate/model/tags.ts';

/**CategoryFilter에 전달되는 props
 *
 * @property {string} selectedCategory - 현재 선택된 태그
 * @property {(category: string) => void} setSelectedCategory - 태그 선택 시 호출되는 상태 변경 함수
 */
interface CategoryFilterProps {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

/**CertificateTag에서 모든 태그를 수집하여 중복을 제거하고, 정렬 후 렌더링하는 컴포넌트
 *
 * @param props - CategoryFilter에 전달되는 속성 집합
 * @param props.selectedCategory - 현재 선택된 태그
 * @param props.setSelectedCategory - 선택 변경 핸들러
 *
 * @returns 태그 버튼 그리드
 */
export const CategoryFilter: React.FC<CategoryFilterProps> = ({
                                                                  selectedCategory,
                                                                  setSelectedCategory,
                                                              }) => {
    /**모든 자격증의 태그를 집계하여 태그 목록을 만든다
     * - set으로 중복을 제거한다
     * - localeCompare을 사용해 한국어 기준 정렬
     */
    const categories = useMemo<string[]>(() => {
        const s = new Set<string>();
        Object.values(certificateTags).forEach((arr) => arr.forEach((t) => s.add(t)));
        return ['전체', ...Array.from(s).sort((a, b) => a.localeCompare(b, 'ko'))];
    }, []);

    return (
        <div className={CBTExamStyles.cbtCategoryGrid}>
            {categories.map((name) => (
                <button
                    key={name}
                    className={`${CBTExamStyles.categoryCard} ${
                        selectedCategory === name ? CBTExamStyles.selected : ''
                    }`}
                    onClick={() => setSelectedCategory(name)}
                >
                    <div className={CBTExamStyles.categoryName}>{name}</div>
                </button>
            ))}
        </div>
    );
};
