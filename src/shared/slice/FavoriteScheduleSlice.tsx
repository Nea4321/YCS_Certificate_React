import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ScheduleItem {
    시험일: string;
    exam_date: string;
    round: string;
    phase: string;
}

export interface FavoriteSchedule {
    certificate_id: number;
    certificate_name: string;
    schedule: ScheduleItem[];
}

interface FavoriteScheduleState {
    list: FavoriteSchedule[];
}

const initialState: FavoriteScheduleState = {
    list: [],
};

export const FavoriteScheduleSlice = createSlice({
    name: "favoriteScheduleSlice",
    initialState,
    reducers: {
        setFavoriteSchedule: (state, action: PayloadAction<FavoriteSchedule[]>) => {
            state.list = action.payload;
        },
        addFavoriteSchedule: (state, action: PayloadAction<FavoriteSchedule>) => {
            state.list.push(action.payload);
        },
        removeFavoriteSchedule: (state, action: PayloadAction<number>) => {
            state.list = state.list.filter((item) => item.certificate_id !== action.payload);
        },
        clearFavoriteSchedule: (state) => {
            state.list = [];
        },
    },
});

export const {
    setFavoriteSchedule,
    addFavoriteSchedule,
    removeFavoriteSchedule,
    clearFavoriteSchedule,
} = FavoriteScheduleSlice.actions;

export default FavoriteScheduleSlice.reducer;
