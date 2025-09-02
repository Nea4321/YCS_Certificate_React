/** 문제 타입 정의
 *
 * @property {number} id   - 문제 번호
 * @property {string} text - 문제 본문
 * @property {string[]} options - 보기 배열
 */
export type Question = {
    id: number;
    text: string;
    options: string[];
};
