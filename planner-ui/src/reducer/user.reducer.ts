import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
}


const initialState: User = {} as User;


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
    }
  },
});

export const {
  setUser,
} = userSlice.actions;

export default userSlice.reducer;
