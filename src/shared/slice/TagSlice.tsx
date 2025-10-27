import {createSlice} from "@reduxjs/toolkit";

export interface TagSlice {
    tag_id : number;
    tag_Name: string;
    tag_color: string;
}

interface TagState {
    list: TagSlice[];
}

const initialState: TagState = {
    list: []
};

export const TagSlice = createSlice({
    name: 'TagSlice',
    initialState,
    reducers: {
        setTag: (state, action) => {
            state.list = action.payload;
        },
        clearTag: (state) => {
            state.list = [];
        },
    },
});

export const { setTag, clearTag } = TagSlice.actions;
export default TagSlice.reducer;