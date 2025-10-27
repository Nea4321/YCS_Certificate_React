import {createSlice} from "@reduxjs/toolkit";

export interface OrganizationProps {
    organizationId: number;
    organizationName: string;
}

interface OrganizationState {
    list: OrganizationProps[];
}

const initialState: OrganizationState = {
    list: []
};

export const OrganizationSlice = createSlice({
    name: 'OrganizationSlice',
    initialState,
    reducers: {
        setOrganization: (state, action) => {
            state.list = action.payload;
        },
        clearOrganization: (state) => {
            state.list = [];
        },
    },
});

export const { setOrganization, clearOrganization } = OrganizationSlice.actions;
export default OrganizationSlice.reducer;