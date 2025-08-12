import {createSlice} from "@reduxjs/toolkit";

// 리덕스에 들어갈 초기값 설정
const initialState = {
    userName: "가나다",
    userEmail: '',
    socialType: "NORMAL",
};

/**
 * Slice = 초기상태, 리듀서, 액션 한번에 처리하는 함수
 *
 * */
export const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userName = action.payload.userName;
            state.userEmail = action.payload.userEmail;
            state.socialType = action.payload.socialType;
        },
        clearUser: (state) => {
        state.userName = ''
        state.userEmail = ''
        state.socialType = ''}
    }
})

// dispath(userSlice.actions.getUser()) -> dispath(getUser())
export const { setUser, clearUser } = userSlice.actions;