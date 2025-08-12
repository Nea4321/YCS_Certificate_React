import {combineReducers, configureStore} from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage 사용
import { userSlice } from "@/shared/slices";

const persistConfig = {
    key: 'root',           // localStorage key 이름
    storage,
    whitelist: ['user'],   // persist 할 리듀서 이름 (userSlice)
};
const rootReducer = combineReducers({
    user: userSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);


/**
 * redux 저장소
 *
 * configureStore - redux 설정을 쉽게 만들어줌.
 * 이 redux 저장소는 user 경로를 사용. -> store.getState().user 이런 형식으로 사용
 * */
export const store = configureStore({
    // user의 이름으로 리덕스에 저장되고 이를 관리해주는 리듀서 가 userSlice임.
    reducer: persistedReducer,
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;





/**
 * redux 간단 설명
 *
 * 리덕스는 [저장소, 액션, 리듀서] 총 3가지 요소로 이루어져 있음.
 * 저장소(store) - 상태를 보관하는 곳.
 * 액션(action) - 상태를 바꾸는 요청.
 * 리듀서(reducers) - 액션을 받아서 상태를 변경하는 함수.
 *
 *  #유저이름을  redux 에 저장하려고 한다
 *  1. action 을 이용해 저장 요청을 reducers 에다 보냄   ex)  dispatch(setUser({ name: '조재현'}))
 *  2. reducers 는 action 을 통해 받은 정보로 상태를 변경함  ex) serUser: (state,action) => {state.name = action.payload.name}
 *  3. store 에 저장됨.
 * */