import {configureStore} from "@reduxjs/toolkit";
import userReducer from "@reducer/user.reducer";
import bankAccountReducer from "@reducer/bankAccount.reducer";
import categoryReducer from "@reducer/category.reducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
    bankAccount: bankAccountReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
