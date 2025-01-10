import { useMutation, useQuery } from '@tanstack/react-query';
import BaseService from '../BaseService/Base.service';
import { BankAccount, BankAccountResponse, CreateBankAccountRequest } from '../../types/bankAccount';

const BankAccountService = () => {
  const Service = BaseService();

  const getBankAccounts = () => 
    Service.get<BankAccountResponse>('/bank-account', {
      withCredentials: true,
    });

  const getBankAccountById = (id: string) =>
    Service.get<BankAccountResponse>(`/bank-account/${id}`, {
      withCredentials: true,
    });

  const createBankAccount = (data: CreateBankAccountRequest) =>
    Service.post<BankAccountResponse>('/bank-account', data, {
      withCredentials: true,
    });

  const updateBankAccount = (id: string, data: CreateBankAccountRequest) =>
    Service.put<BankAccountResponse>(`/bank-account/${id}`, data, {
      withCredentials: true,
    });

  const deleteBankAccount = (id: string) =>
    Service.delete<BankAccountResponse>(`/bank-account/${id}`, {
      withCredentials: true,
    });

  return {
    getBankAccounts,
    getBankAccountById,
    createBankAccount,
    updateBankAccount,
    deleteBankAccount,
  };
};

export const bankAccountService = BankAccountService();

// React Query hooks
export const useGetBankAccounts = () => {
  return useQuery({
    queryKey: ['bankAccounts'],
    queryFn: () => bankAccountService.getBankAccounts(),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minut
    refetchOnWindowFocus: false,
  });
};

export const useGetBankAccountById = (id: string) => {
  return useQuery({
    queryKey: ['bankAccount', id],
    queryFn: () => bankAccountService.getBankAccountById(id),
    retry: 1,
    enabled: !!id,
  });
};

export const useCreateBankAccount = () => {
  return useMutation({
    mutationFn: (data: CreateBankAccountRequest) => bankAccountService.createBankAccount(data),
  });
};

export const useUpdateBankAccount = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateBankAccountRequest }) => 
      bankAccountService.updateBankAccount(id, data),
  });
};

export const useDeleteBankAccount = () => {
  return useMutation({
    mutationFn: (id: string) => bankAccountService.deleteBankAccount(id),
  });
};

export default BankAccountService; 