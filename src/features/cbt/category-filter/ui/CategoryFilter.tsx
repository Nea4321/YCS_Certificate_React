import React, {useLayoutEffect, useMemo, useRef, useState} from 'react';
import CBTExamStyles from '@/pages/cbt/styles/CBTExamPage.module.css';
import { certificateTags } from '@/entities/certificate/model/tags.ts';
import { getTagName } from "@/entities/certificate/model/tagMeta";
import { ChevronDown, ChevronUp } from 'lucide-react';

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
        Object.values(certificateTags).forEach((arr) =>
            arr.forEach((id) => {
                const name = getTagName(id); // 숫자 ID → 태그 이름으로 변환
                if (name) s.add(name);
            })); // 문자열 수집 -> ID를 이름으로 바꿔서 수집
        // 기존 코드 Object.values(certificateTags).forEach((arr) => arr.forEach((t) => s.add(t)));
        return ['전체', ...Array.from(s).sort((a, b) => a.localeCompare(b, 'ko'))];
    }, []);

    const [isExpanded, setIsExpanded] = useState(false);


    const gridRef = useRef<HTMLDivElement>(null);
    const [cols, setCols] = useState(3); // 기본값: 모바일에서 3열 가정

    useLayoutEffect(() => {
        const updateCols = () => {
            const el = gridRef.current;
            if (!el) return;
            const style = getComputedStyle(el);
            const count = style.gridTemplateColumns.split(' ').filter(Boolean).length;
            if (count > 0) setCols(count);
        };
        updateCols();

        const ro = new ResizeObserver(updateCols);
        if (gridRef.current) ro.observe(gridRef.current);
        window.addEventListener('resize', updateCols);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', updateCols);
        };
    }, []);

    /**열 수에 따라 초기 노출 개수 결정
     * - 데스크탑(열≥4): 8개로 꽉 채움
     * - 모바일(열=3): 9개로 꽉 채움
     */
    const initialCount =
        cols >= 4 ? 8 : cols === 3 ? 9 : cols === 2 ? 6 : 8;

    const shown = Math.min(initialCount, categories.length);
    const initialTags = categories.slice(0, shown);
    const additionalTags = categories.slice(shown);

    return (
        <div className={CBTExamStyles.categoryFilterContainer}>
            <div ref={gridRef} className={CBTExamStyles.cbtCategoryGrid}>
                {initialTags.map(name => (
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

            {additionalTags.length > 0 && (
                <div
                    className={`${CBTExamStyles.categoryExpandedGrid} ${
                        isExpanded ? CBTExamStyles.expanded : ''
                    }`}
                >
                    {additionalTags.map(name => (
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
            )}

            {additionalTags.length > 0 && (
                <div className={CBTExamStyles.expandIconWrapper}>
                    <button
                        className={CBTExamStyles.expandIconButton}
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-label={isExpanded ? '카테고리 접기' : '카테고리 펼치기'}
                    >
                        {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                </div>
            )}
        </div>
    );
};
