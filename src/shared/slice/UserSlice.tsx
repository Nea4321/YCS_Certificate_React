import {createSlice} from "@reduxjs/toolkit";

// 리덕스에 저장소에 들어갈 초기값 설정
const initialState = {
    userName: '',
    userEmail: '',
    socialType: "NORMAL",
    tokenExp: null
};

/**
 * Slice = 초기상태, 리듀서, 액션 한번에 처리하는 함수
 *
 * user라는 이름(key)로 관리되며,
 * 유저 이름(name)
 * 유저 이메일(email)
 * 유저 소셜 타입(socialType)
 * 토큰 만료 기간(tokenExp)
 * 가 redux store 에 저장됨.
 *
 * setUser로 store에 토큰에서 가져온 값을 저장 action 을 전달하고
 * clearUser로 store에 있는 정보를 초기화 한다.
 * */
export const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userName = action.payload.userName;
            state.userEmail = action.payload.userEmail;
            state.socialType = action.payload.socialType;
            state.tokenExp = action.payload.tokenExp
        },
        clearUser: (state) => {
        state.userName = ''
        state.userEmail = ''
        state.socialType = ''
            state.tokenExp = null}
    }
})


export const { setUser, clearUser } = userSlice.actions;