import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FavoriteInfo {
    type: string;       // "certificate" | "department"
    type_id: number;    // 실제 id
    name: string;       // 이름
}

interface FavoriteInfoState {
    list: FavoriteInfo[];
}

const initialState: FavoriteInfoState = {
    list: [],
};

export const FavoriteListSlice = createSlice({
    name: "favoriteInfoSlice",
    initialState,
    reducers: {
        setFavoriteInfo: (state, action: PayloadAction<FavoriteInfo[]>) => {
            state.list = action.payload;
        },
        addFavoriteInfo: (state, action: PayloadAction<FavoriteInfo>) => {
            state.list.push(action.payload);
        },
        removeFavoriteInfo: (state, action: PayloadAction<{ type: string; id: number }>) => {
            state.list = state.list.filter(
                (item) => !(item.type === action.payload.type && item.type_id === action.payload.id)
            );
        },
        clearFavoriteInfo: (state) => {
            state.list = [];
        },
    },
});

export const {
    setFavoriteInfo,
    addFavoriteInfo,
    removeFavoriteInfo,
    clearFavoriteInfo,
} = FavoriteListSlice.actions;

export default FavoriteListSlice.reducer;