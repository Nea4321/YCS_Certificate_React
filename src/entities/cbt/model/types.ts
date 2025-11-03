/** 문제 타입 정의
 *
 * @property {number} id   - 문제 번호
 * @property {string} text - 문제 본문
 * @property {string[]} options - 보기 배열
 */
export interface Question {
    question_id: number;
    certificate_id: number;
    question_type_id: number;
    text: string;
    content: string | null;
    img: string | null;
    answers: Answer[];
}

export interface Answer {
    answer_id: number;
    question_id: number;
    bool: boolean;
    content: string;
    img: string | null;
}