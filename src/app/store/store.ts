import {combineReducers, configureStore} from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage 사용
import {
    Faculty_DepartmentSlice,
    FavoriteListSlice,
    FavoriteScheduleSlice,
    userSlice,
    OrganizationSlice,
    TagSlice,
    CbtHistorySlice
} from "@/shared/slice";

/**
 * 아래 3개 설정 설명
 * 1. persistConfig - redux-persist 을 사용하기 위한 설정
 * redux-persist 가 뭔데 -> redux store에 특정 slice(user)를 localstorage 에 저장하도록 지정하는 거임.
 * 2. combineReducer - 여러 Slice를 하나로 합침. ( redux store에서 user slice의 상태를 user라는 key로 관리 )
 * 3. persistedReducer - 리듀서 에다가 persist 기능을 추가, 즉 리듀서에 로컬 저장소에 저장하는 기능 추가 한거임.
 * */

// 🔹 통합 persist 설정
const persistConfig = {
    key: "root",         // localStorage key 이름
    storage,             // localStorage 사용
    whitelist: ["user","tag","organization","userCbtHistory"], // user만 persist (faculty는 굳이 저장 안 해도 되면 제외)
};

// 🔹 모든 slice 합치기
const rootReducer = combineReducers({
    user: userSlice.reducer,
    faculty: Faculty_DepartmentSlice.reducer,
    organization: OrganizationSlice.reducer,
    tag: TagSlice.reducer,
    favorite: FavoriteListSlice.reducer,
    favorite_schedule: FavoriteScheduleSlice.reducer,
    userCbtHistory: CbtHistorySlice.reducer,
});

// 🔹 persist 기능을 루트 리듀서에 적용
const persistedReducer = persistReducer(persistConfig, rootReducer);



/**
 * redux 저장소
 *
 * 리듀서에 persisteReducer(userSlice.reducer) 를 저장함
 * -> 현재 이 redux 저장소는 userSlice가 관리하고 있음.
 * */
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // redux-persist 비직렬화 경고 방지
        }),
});


// 🔹 persistor 생성
export const persistor = persistStore(store);
// 🔹 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;




/**
 * redux 간단 설명
 *
 * 리덕스는 [저장소, 액션, 리듀서] 총 3가지 요소로 이루어져 있음.
 * 저장소(store) - 상태를 보관하는 곳.
 * 액션(action) - 상태를 바꾸는 요청.
 * 리듀서(reducers) - 액션을 받아서 상태를 변경하는 함수.
 *
 *  #유저이름을  slice 에 저장하려고 한다
 *  1. action 을 이용해 저장 요청을 reducers 에다 보냄   ex)  dispatch(setUser({ name: '조재현'}))
 *  2. reducers 는 action 을 통해 받은 정보로 상태를 변경함  ex) serUser: (state,action) => {state.name = action.payload.name}
 *  3. store 에 저장됨.
 * */