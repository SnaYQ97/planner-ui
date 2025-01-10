import { useMutation, useQuery } from '@tanstack/react-query';
import BaseService from '../BaseService/Base.service';
import { Transaction } from '@/types/transaction';

interface TransactionResponse {
  data: Transaction | Transaction[];
  message?: string;
  error?: string;
}

interface GetTransactionsParams {
  month?: number;
  year?: number;
}

const TransactionService = () => {
  const Service = BaseService();

  const getAllTransactions = (params?: GetTransactionsParams) =>
    Service.get<TransactionResponse>('/transaction', {
      withCredentials: true,
      params
    });

  const getTransactionById = (id: string) =>
    Service.get<TransactionResponse>(`/transaction/${id}`, {
      withCredentials: true,
    });

  const createTransaction = (data: Partial<Transaction>) =>
    Service.post<TransactionResponse>('/transaction', data, {
      withCredentials: true,
    });

  const updateTransaction = (id: string, data: Partial<Transaction>) =>
    Service.put<TransactionResponse>(`/transaction/${id}`, data, {
      withCredentials: true,
    });

  const deleteTransaction = (id: string) =>
    Service.delete<TransactionResponse>(`/transaction/${id}`, {
      withCredentials: true,
    });

  return {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};

export const transactionService = TransactionService();

// React Query hooks
export const useGetTransactions = (params?: GetTransactionsParams) => {
  return useQuery({
    queryKey: ['transactions', params?.month, params?.year],
    queryFn: () => transactionService.getAllTransactions(params),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minut
    refetchOnWindowFocus: false,
  });
};

export const useGetTransactionById = (id: string) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionService.getTransactionById(id),
    retry: 1,
    enabled: !!id,
  });
};

export const useCreateTransaction = () => {
  return useMutation({
    mutationFn: (data: Partial<Transaction>) => 
      transactionService.createTransaction(data),
  });
};

export const useUpdateTransaction = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) =>
      transactionService.updateTransaction(id, data),
  });
};

export const useDeleteTransaction = () => {
  return useMutation({
    mutationFn: (id: string) => transactionService.deleteTransaction(id),
  });
};

export default TransactionService; 