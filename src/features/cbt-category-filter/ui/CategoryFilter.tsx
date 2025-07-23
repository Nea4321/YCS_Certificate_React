import React from 'react';
import CBTExamStyles from '@/pages/cbt/styles/CBTExamPage.module.css';

interface CategoryFilterProps {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, setSelectedCategory }) => {
    const categories = [
        { name: '전체' },
        { name: 'IT/컴퓨터' },
        { name: '운전/운송' },
        { name: '건설' },
        { name: '화학' },
        { name: '기계' },
        { name: '농림어업' },
        { name: '재료' },
        { name: '조리' },
        { name: '이용/미용' },
        { name: '기상' },
        { name: '전기/전자' },
        { name: '안전' },
        { name: '항공' },
        { name: '환경' },
        {name: '경영'}
    ];

    return (
        <div className={CBTExamStyles.cbtCategoryGrid}>
            {categories.map((cat) => (
                <button
                    key={cat.name}
                    className={`${CBTExamStyles.categoryCard} ${
                        selectedCategory === cat.name ? CBTExamStyles.selected : ''
                    }`}
                    onClick={() => setSelectedCategory(cat.name)}
                >
                    <div className={CBTExamStyles.categoryName}>{cat.name}</div>
                </button>
            ))}
        </div>
    );
};