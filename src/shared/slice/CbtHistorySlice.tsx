import {createSlice} from "@reduxjs/toolkit";

// 초기값
interface CbtHistoryState {
    certificate_id: number;
    score: number;
    correct_count: number;
    left_time: number;
}

const initialState: CbtHistoryState = {
    certificate_id: 0,
    score: 0,
    correct_count: 0,
    left_time: 0,
};

export const CbtHistorySlice = createSlice({
    name : 'userCbtHistory',
    initialState,
    reducers: {
        setCbtHistory: (state, action) => {
            state.certificate_id = action.payload.certificate_id;
            state.score = action.payload.score;
            state.correct_count = action.payload.correct_count;
            state.left_time = action.payload.left_time;
        },
        clearCbtHistory: (state) => {
            state.correct_count = 0
            state.certificate_id = 0
            state.score = 0
            state.left_time = 0
        }
    }
})


export const { setCbtHistory, clearCbtHistory } = CbtHistorySlice.actions;