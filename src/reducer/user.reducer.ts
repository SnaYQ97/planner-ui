import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface User {
  name?: string | null;
  email?: string | null;
}


const initialState: User = {
    name: null ,
    email: null,
};


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
    },
});

export const {
    setName,
    setEmail
} = userSlice.actions;

export default userSlice.reducer;
