export type AccountType = 'DAILY' | 'SAVINGS';

export interface BankAccount {
  id: string;
  accountType: AccountType;
  name: string;
  balance: number;
  accountNumber: string;
  interestRate?: number | null;
  interestRateLimit?: number | null;
  interestStartDate?: string | null;
  interestEndDate?: string | null;
  targetAmount?: number | null;
  targetDate?: string | null;
  color: string;
}

export interface CreateBankAccountRequest {
  accountType: AccountType;
  name: string;
  balance: number;
  accountNumber: string;
  interestRate?: number | null;
  interestRateLimit?: number | null;
  interestStartDate?: string | null;
  interestEndDate?: string | null;
  targetAmount?: number | null;
  targetDate?: string | null;
  color: string;
}

export interface BankAccountResponse {
  account?: BankAccount;
  accounts?: BankAccount[];
  message?: string;
  error?: string;
} 