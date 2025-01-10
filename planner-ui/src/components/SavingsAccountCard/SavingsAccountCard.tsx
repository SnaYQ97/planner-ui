import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { Card } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Doughnut } from 'react-chartjs-2';
import { BankAccount } from '../../types/bankAccount';
import { removeBankAccount } from '@reducer/bankAccount.reducer';
import { useDeleteBankAccount } from '@services/BankAccountService/BankAccount.service';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { Button } from '@components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/dialog';
import { AddSavingsAccountForm } from '@components/AddSavingsAccountForm/AddSavingsAccountForm';

interface SavingsAccountCardProps {
  account: BankAccount;
}

export const SavingsAccountCard = ({ account }: SavingsAccountCardProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const deleteBankAccount = useDeleteBankAccount();

  const calculateProgress = (balance: number | string, targetAmount: number | string | null) => {
    if (!targetAmount) return 100;
    const balanceNum = typeof balance === 'string' ? parseFloat(balance) : balance;
    const targetNum = typeof targetAmount === 'string' ? parseFloat(targetAmount) : targetAmount;
    if (targetNum === 0) return 100;
    const progress = (balanceNum / targetNum) * 100;
    return Math.min(progress, 100);
  };

  const getDoughnutData = (percentage: number) => ({
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [
          'rgb(147, 51, 234)', // purple-600
          'rgb(39, 39, 42)' // zinc-800
        ],
        borderWidth: 0,
        spacing: 0,
      },
    ],
  });

  const getDoughnutOptions = (percentage: number) => ({
    cutout: '75%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: false
      }
    }
  });

  const handleDelete = async () => {
    try {
      await deleteBankAccount.mutateAsync(account.id);
      dispatch(removeBankAccount(account.id));
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
    } catch (error) {
      console.error('Błąd podczas usuwania konta:', error);
    }
  };

  const formatAccountNumber = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    const full = cleanNumber.replace(/(\d{2})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4 $5 $6 $7');
    const short = cleanNumber.replace(/^(\d{2})(\d{4})(.*)(\d{4})$/, '$1 $2 .... $4');
    return {
      full,
      short
    };
  };

  const formatNumber = (value: number | string | null) => {
    if (value === null) return '0';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toLocaleString('pl-PL');
  };

  return (
    <>
      <Card className="p-6 h-[234px] min-w-[200px] w-full bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm border-muted/20 hover:border-primary/20 transition-all duration-300"
        style={{ backgroundColor: account.color || "#9333ea" }}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-lg tracking-tight text-primary truncate">{account.name}</h4>
                {account.interestRate && (
                  <Badge variant="secondary" className="font-medium shrink-0">
                    {formatNumber(account.interestRate)}%
                  </Badge>
                )}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground font-mono cursor-help truncate">
                      {formatAccountNumber(account.accountNumber).short}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="font-mono">{formatAccountNumber(account.accountNumber).full}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-background/50 shrink-0">
                  <MoreHorizontal className="h-4 w-4 pointer-events-none" />
                  <span className="sr-only">Otwórz menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edytuj</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Usuń</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-28 h-28 relative">
              <Swiper
                modules={[Autoplay]}
                slidesPerView={1}
                speed={800}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: true,
                  pauseOnMouseEnter: true
                }}
                className="h-full"
                loop={true}
              >
                <SwiperSlide>
                  <div className="h-full flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Doughnut
                        data={getDoughnutData(calculateProgress(account.balance, account.targetAmount ?? null))}
                        options={getDoughnutOptions(calculateProgress(account.balance, account.targetAmount ?? null))}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">
                          {Math.round(calculateProgress(account.balance, account.targetAmount ?? null))}%
                        </span>
                        <span className="text-xs text-muted-foreground">ukończone</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="h-full flex flex-col items-center justify-center gap-2">
                    <span className="text-xs text-muted-foreground">Oprocentowanie</span>
                    <span className="text-3xl font-bold tracking-tight">{account.interestRate}%</span>
                    {account.interestRateLimit && (
                      <p className="text-xs text-muted-foreground text-center">
                        do {account.interestRateLimit.toLocaleString('pl-PL')} zł
                        {account.interestEndDate && (
                          <><br />do {new Date(account.interestEndDate).toLocaleDateString('pl-PL')}</>
                        )}
                      </p>
                    )}
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="h-full flex flex-col items-center justify-center gap-2">
                    <div className="text-center">
                      <span className="text-3xl font-bold tracking-tight">
                        {formatNumber(account.balance)} zł
                      </span>
                      {account.targetAmount && (
                        <p className="text-xs text-muted-foreground mt-1">
                          cel: {formatNumber(account.targetAmount)} zł
                        </p>
                      )}
                      {account.targetDate && (
                        <p className="text-xs text-muted-foreground">
                          do {new Date(account.targetDate).toLocaleDateString('pl-PL')}
                        </p>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj konto oszczędnościowe</DialogTitle>
          </DialogHeader>
          <AddSavingsAccountForm 
            onSuccess={() => {
              setShowEditDialog(false);
              queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
            }}
            onCancel={() => setShowEditDialog(false)}
            initialData={account}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}; 