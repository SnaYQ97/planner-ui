import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BankAccount } from '../types/bankAccount';

interface BankAccountState {
  accounts: BankAccount[];
  totalBalance: number;
}

const initialState: BankAccountState = {
  accounts: [],
  totalBalance: 0,
};

const bankAccountSlice = createSlice({
  name: 'bankAccount',
  initialState,
  reducers: {
    setBankAccounts: (state, action: PayloadAction<BankAccount[]>) => {
      state.accounts = action.payload;
      state.totalBalance = action.payload.reduce((sum, account) => sum + Number(account.balance), 0);
    },
    addBankAccount: (state, action: PayloadAction<BankAccount>) => {
      state.accounts.push(action.payload);
      state.totalBalance += Number(action.payload.balance);
    },
    updateBankAccount: (state, action: PayloadAction<BankAccount>) => {
      const index = state.accounts.findIndex(acc => acc.id === action.payload.id);
      if (index !== -1) {
        state.totalBalance = state.totalBalance - Number(state.accounts[index].balance) + Number(action.payload.balance);
        state.accounts[index] = action.payload;
      }
    },
    removeBankAccount: (state, action: PayloadAction<string>) => {
      const account = state.accounts.find(acc => acc.id === action.payload);
      if (account) {
        state.totalBalance -= Number(account.balance);
      }
      state.accounts = state.accounts.filter(acc => acc.id !== action.payload);
    },
  },
});

export const { setBankAccounts, addBankAccount, updateBankAccount, removeBankAccount } = bankAccountSlice.actions;
export default bankAccountSlice.reducer; 