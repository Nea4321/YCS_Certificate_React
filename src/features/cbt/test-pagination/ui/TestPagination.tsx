// CBT 문제 페이징
import React from "react";

/**TestPagination에 전달하는 props
 *
 * @property {number} currentPage - 부모(CBTTestPage)에 전달받은 현재 페이지
 * @property {number} totalPages - 부모에 전달받은 총 페이지 수
 * @property {(page: number) => void} onPageChange - 페이지 상태를 변경하는 콜백 함수
 */
interface TestPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    containerClassName?: string;
    buttonClassName?: string;
    pageInfoClassName?: string;
}

/**CBT 문제를 페이징하는 컴포넌트
 * '이전' 버튼과 '다음' 버튼으로 페이지 제어 가능
 *
 * - 이전 버튼을 누르면 (현재 페이지 - 1)의 값을 onPageChange에 적용하여 페이지 상태를 변경한다
 * - 만약 현재 페이지가 1이라면 이전 버튼은 비활성화
 * - 다음 버튼을 누르면 (현재 페이지 + 1)의 값을 onPageChange에 적용하여 페이지 상태를 변경한다
 * - 만약 현재 페이지가 총 페이지 수라면 다음 버튼은 비활성화
 *
 * @component
 */
export const TestPagination: React.FC<TestPaginationProps> = ({
                                                                  currentPage,
                                                                  totalPages,
                                                                  onPageChange,
                                                                  containerClassName,
                                                                  buttonClassName,
                                                                  pageInfoClassName,
                                                              }) => {
    return (
        <div className={containerClassName}>
            <button
                className={buttonClassName}
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                ◀ 이전
            </button>

            <span className={pageInfoClassName}>
                {currentPage}/{totalPages}
            </span>

            <button
                className={buttonClassName}
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            >
                다음 ▶
            </button>
        </div>
    );
};