import {configureStore} from "@reduxjs/toolkit";
import userReducer from "@reducer/user.reducer.ts";
import bankAccountReducer from "@reducer/bankAccount.reducer.ts";
import categoryReducer from "@reducer/category.reducer.ts";

export const store = configureStore({
  reducer: {
    user: userReducer,
    bankAccount: bankAccountReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
