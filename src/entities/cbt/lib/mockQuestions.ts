import type { Question } from "@/entities/cbt/model/types.ts";

/** 총 25문제의 임시 데이터 생성
 *
 * 각 문제는 4개의 보기를 포함한다.
 *
 * @param {number} i - 문제 인덱스
 * @returns {Question}
 */
export const mockQuestions: Question[] = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    text: `문제 ${i + 1} 내용`,
    options: ["보기1", "보기2", "보기3", "보기4"],
}));
