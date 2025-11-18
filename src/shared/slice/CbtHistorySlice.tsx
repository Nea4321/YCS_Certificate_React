import {createSlice, PayloadAction} from "@reduxjs/toolkit";

// 초기값

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

interface CbtHistoryState {
    certificate_id: number;
    score: number;
    correct_count: number;
    left_time: number;

    answers: (number | null)[];
    questions: Question[];
}

const initialState: CbtHistoryState = {
    certificate_id: 0,
    score: 0,
    correct_count: 0,
    left_time: 0,

    answers: [],
    questions: [],
};

export const CbtHistorySlice = createSlice({
    name : 'userCbtHistory',
    initialState,
    reducers: {
        setCbtHistory: (state, action: PayloadAction<Partial<CbtHistoryState>>) => {
            Object.assign(state, action.payload);
        },
        clearCbtHistory: (state) => {
            state.correct_count = 0
            state.certificate_id = 0
            state.score = 0
            state.left_time = 0

            state.answers = [];
            state.questions = [];
        }
    }
})


export const { setCbtHistory, clearCbtHistory } = CbtHistorySlice.actions;