import React from 'react';
import CBTExamStyles from '@/pages/cbt/styles/CBTExamPage.module.css';

/**CategoryFilter에 전달하는 props
 *
 * @property {string} selectedCategory - 현재 선택된 카테고리의 상태(state) 값
 * @property {(category: string) => void} setSelectedCategory - selectedCategory의 값을 변경하는 상태 변경 함수
 */
interface CategoryFilterProps {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

/**카테고리를 배치하고 선택된 카테고리에 포함되는 자격증을 보여주기 위해 카테고리의 상태를 변경하는 컴포넌트
 *
 * - 부모 컴포넌트(CBTExamPage)에서 전달받은 현재 선택된 카테고리(selectedCategory)와
 * - 사용자가 다시 선택한 상태를 변경할 카테고리(setSelectedCategory)를 받아 해당 상태로 변경하는 역할
 *
 * @component
 *
 * @example
 * <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
 */
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
        { name: '경영' }
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