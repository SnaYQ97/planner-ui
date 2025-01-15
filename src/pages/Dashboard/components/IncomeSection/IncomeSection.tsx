import { useState } from 'react';
import { Card } from "@components/ui/card.tsx";
import { Button } from "@components/ui/button.tsx";
import { TrendingUp, Plus, Pencil, Trash2, MoreVertical } from "lucide-react";
import { formatCurrency } from "@lib/utils.ts";
import { Transaction } from '@types/transaction.ts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/dialog.tsx";
import { TransactionForm } from '../TransactionForm/TransactionForm.tsx';
import { DateTime } from 'luxon';
import { useQueryClient } from '@tanstack/react-query';
import { useGetTransactions, useDeleteTransaction } from '@services/TransactionService/Transaction.service.ts';
import { useGetBankAccounts } from '@services/BankAccountService/BankAccount.service.ts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu.tsx";

interface IncomeSectionProps {
  selectedMonth: Date;
}

export const IncomeSection = ({ selectedMonth }: IncomeSectionProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const queryClient = useQueryClient();

  const { data: transactionsResponse } = useGetTransactions({
    month: selectedMonth.getMonth(),
    year: selectedMonth.getFullYear()
  });
  const { data: accountsResponse } = useGetBankAccounts();
  const deleteTransaction = useDeleteTransaction();

  const transactions = Array.isArray(transactionsResponse?.data?.data)
    ? transactionsResponse.data.data.filter(transaction => transaction.type === 'INCOME')
    : [];

  // Znajdź konto typu DAILY
  const dailyAccount = accountsResponse?.data?.accounts?.find(
    account => account.accountType === 'DAILY'
  );

  const totalIncome = transactions.reduce((sum, transaction) =>
    sum + parseFloat(transaction.amount), 0);

  const handleAddClick = () => {
    setShowAddDialog(true);
  };

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleDialogClose = () => {
    setShowAddDialog(false);
    setSelectedTransaction(null);
  };

  const handleTransactionSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
    handleDialogClose();
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await deleteTransaction.mutateAsync(id);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
    } catch (error) {
      console.error('Błąd podczas usuwania transakcji:', error);
    }
  };

  const formatDate = (date: string) => {
    return DateTime.fromISO(date)
      .setLocale('pl')
      .toFormat('HH:mm · dd.MM.yyyy');
  };

  const formatMonthYear = (date: Date) => {
    return DateTime.fromJSDate(date)
      .setLocale('pl')
      .toFormat('LLLL yyyy');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Przychody</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">{formatCurrency(totalIncome)}</p>
          {dailyAccount && (
            <p className="text-sm text-muted-foreground mt-1">
              Saldo: {formatCurrency(dailyAccount.balance)}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleAddClick}>
            <Plus className="h-3 w-3 mr-1" />
            Dodaj
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Przychody w {formatMonthYear(selectedMonth)}
        </p>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Brak przychodów w tym miesiącu
            </p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: transaction.category?.color || '#475569' }}
                  />
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-green-600">{formatCurrency(transaction.amount)}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <span className="sr-only">Otwórz menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(transaction)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edytuj
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(transaction.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Usuń
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={showAddDialog || !!selectedTransaction} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedTransaction ? 'Edytuj przychód' : 'Dodaj nowy przychód'}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm
            transaction={selectedTransaction}
            onSuccess={handleTransactionSuccess}
            defaultType="INCOME"
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};