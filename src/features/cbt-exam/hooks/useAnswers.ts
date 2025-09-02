import { useCallback, useState } from "react";

/** 답안 상태 관리 훅
 *
 * @param totalQuestions - 전체 문항 수
 * @returns { answers, setAnswer }
 */
export function useAnswers(totalQuestions: number) {
    const [answers, setAnswers] = useState<(number | null)[]>(
        Array(totalQuestions).fill(null)
    );

    /** 특정 번호의 답안 설정
     * @param index - 0-based index
     * @param opt   - 사용자가 선택한 보기(1~4) 또는 null
     */
    const setAnswer = useCallback((index: number, opt: number | null) => {
        setAnswers((prev) => {
            const next = [...prev];
            next[index] = opt;
            return next;
        });
    }, []);

    return { answers, setAnswer };
}
