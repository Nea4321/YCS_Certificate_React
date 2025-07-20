import React from 'react';
import CBTExamStyles from '@/pages/cbt/styles/CBTExamPage.module.css'; // 스타일 임포트

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
                                                          totalPages,
                                                          currentPage,
                                                          setCurrentPage,
                                                      }) => {
    const maxVisiblePages = 5;
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    const pageNumbers = [];
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