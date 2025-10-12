import {createSlice} from "@reduxjs/toolkit";

/**
 * 수정 페이지에 사용할 학부-학과 연결된 데이터
 * */
export interface FacultywithDepartment {
    facultyName: string;
    departments: string[];
}

interface FacultyState {
    list: FacultywithDepartment[];
}

const initialState: FacultyState = {
    list: []
};

export const Faculty_DepartmentSlice = createSlice({
    name: 'Faculty_DepartmentSlice',
    initialState,
    reducers: {
        setFaculty_Department: (state, action) => {
            state.list = action.payload;
        },
        clearFaculty_Department: (state) => {
            state.list = [];
        },
    },
});

export const { setFaculty_Department, clearFaculty_Department } = Faculty_DepartmentSlice.actions;
export default Faculty_DepartmentSlice.reducer;