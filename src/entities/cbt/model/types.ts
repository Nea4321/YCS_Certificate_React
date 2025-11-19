export type AnswerDTO = {
    answer_id: number;
    question_id: number;
    bool: boolean;
    content: string;
    img: string | null;
    solution: string | null;
};

export type QuestionDTO = {
    question_num: number;
    question_id: number;
    text: string;
    content: string;
    img: string | null;
    answers: AnswerDTO[];

    question_type_id?: number;
    question_type_name?: string;
};

export type QuestionTypeDTO = {
    question_type_id: number;
    question_type_name: string;
    questions: QuestionDTO[];
};

export type QuestionInfoDTO = {
    question_info_id: number;
    question_info_name: string;
    question_types: QuestionTypeDTO[];
};

export type PreviousDTO = {
    previous_id: number;
    previous_name: string | null;
    list: QuestionInfoDTO;
};

export type UserAnswerDTO = {
    answer_id: number;
    bool: boolean;
};

export type UserCbtHistoryDTO = {
    certificate_id: number;
    score: number;
    correct_Count: number;
    left_time: number;
    previous_id: number;
    answers: UserAnswerDTO[];
};

export type UserPreviousDTO = {
    previous: PreviousDTO;
    userAnswer: UserAnswerDTO[];
};

// export type ReviewQuestion = QuestionDTO & {
//     userAnswerId: number | null;
//     isCorrect: boolean | null;
// };

export interface UserIncorrectAnswerDTO {
    answer_id: number;
    bool: boolean;
    content: string;
    img: string | null;
    solution: string;
}

export interface UserIncorrectQuestionDTO {
    question_id: number;
    text: string;
    content: string | null;
    img: string | null;
    userIncorrectAnswerDTOList: UserIncorrectAnswerDTO[];
}

export interface UserIncorrectDTO {
    certificate_id: number;
    certificate_name: string;
    userIncorrectQuestionDTOList: UserIncorrectQuestionDTO[];
}