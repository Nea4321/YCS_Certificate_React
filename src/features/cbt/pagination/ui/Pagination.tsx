import React from 'react';
import CBTExamStyles from '@/pages/cbt/styles/CBTExamPage.module.css';

/**Pagination에 전달하는 props
 *
 * @property {number} totalPages - 부모 컴포넌트에 전달받은 전체 페이지 수
 * @property {number} currentPage - 부모 컴포넌트에 전달받은 현재 페이지
 * @property {(page: number) => void} setCurrentPage - currentPage의 값을 변경하는 상태 변경 함수
 */
interface PaginationProps {
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

/**CBTExamPage의 페이징 컴포넌트
 * - 현재 페이지(currentPage)와 전체 페이지(totalPages)를 기준으로 페이지 번호를 생성하고 배치
 * - '이전', '다음' 버튼으로 페이지 이동이 가능
 * - 한 번에 표시할 페이지 수(maxVisiblePages)를 최대 5개로 제한하여 중앙에 페이지 번호를 배치
 *
 * @component
 *
 * @example
 * <Pagination
 *  totalPages={totalPages}
 *  currentPage={currentPage}
 *  setCurrentPage={setCurrentPage}
 * />
 */
export const Pagination: React.FC<PaginationProps> = ({
                                                          totalPages,
                                                          currentPage,
                                                          setCurrentPage,
                                                      }) => {
    const maxVisiblePages = 5; // 한 번에 표시할 페이지 수
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1); // 현재 페이징 상태의 첫 번호
    let endPage = startPage + maxVisiblePages - 1; // 현재 페이징 상태의 마지막 번호

    // 전체 페이지 수를 endPage가 넘을 경우 startPage와 endPage를 제어
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    // 이전 버튼과 다음 버튼 사이의 페이지 번호를 담는 배열
    const pageNumbers = [];

    // 페이징의 시작번호부터 마지막 번호를 pageNumbers에 담는다
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className={CBTExamStyles.pagination}>
            <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={CBTExamStyles.pageButton}
            >
                이전
            </button>

            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={currentPage === page}
                    className={`${CBTExamStyles.pageButton} ${
                        currentPage === page ? CBTExamStyles.activePage : ''
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={CBTExamStyles.pageButton}
            >
                다음
            </button>
        </div>
    );
};