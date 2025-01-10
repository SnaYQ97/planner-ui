import { Category } from './category';
import { BankAccount } from './bankAccount';

export type TransactionType = 'EXPENSE' | 'INCOME';

export interface Transaction {
  id: string;
  amount: string;
  description: string;
  date: string;
  type: TransactionType;
  categoryId: string;
  category: Category;
  accountId: string;
  bankAccount: BankAccount;
  createdAt: string;
  updatedAt: string;
} 