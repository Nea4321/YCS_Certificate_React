import React, { useMemo } from 'react';
import CBTExamStyles from '@/pages/cbt/styles/CBTExamPage.module.css';
import { certificateTags } from '@/entities/certificate/model/tags';

interface CategoryFilterProps {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
                                                                  selectedCategory,
                                                                  setSelectedCategory,
                                                              }) => {
    // 모든 자격증 태그를 집계해 카테고리 목록 생성 (중복 제거 + 정렬 + '전체' 추가)
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
