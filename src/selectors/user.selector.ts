import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/index.store';

export const getUser = (state: RootState) => state.user;

export const selectUserName = createSelector(
  getUser,
  (user) => user.name
);


