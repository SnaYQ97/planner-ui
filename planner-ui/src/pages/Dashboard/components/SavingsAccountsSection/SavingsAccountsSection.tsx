import { CardTitle } from "@components/ui/card";
import { SavingsAccountCard } from "@components/SavingsAccountCard/SavingsAccountCard";
import { BankAccount } from "../../../../types/bankAccount";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Mousewheel, Pagination, Keyboard } from 'swiper/modules';
import { AddSavingsGoalButton } from '../AddSavingsGoalButton/AddSavingsGoalButton';
import 'swiper/css';
import 'swiper/css/pagination';

interface SavingsAccountsSectionProps {
  accounts: BankAccount[];
  isLoading: boolean;
  onAddAccount: () => void;
}

export const SavingsAccountsSection = ({ accounts, isLoading, onAddAccount }: SavingsAccountsSectionProps) => {
  const savingsAccounts = accounts.filter(account => account.accountType === 'SAVINGS');
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Konta oszczędnościowe</p>
      </div>
      <div className="flex gap-4">
        <AddSavingsGoalButton onClick={onAddAccount} />
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="w-full h-[234px] flex items-center justify-center border rounded-lg">
              <div>Ładowanie...</div>
            </div>
          ) : savingsAccounts.length === 0 ? (
            <div className="w-full h-[234px] flex items-center justify-center border rounded-lg">
              <div className="text-sm text-muted-foreground">
                Brak kont oszczędnościowych
              </div>
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Mousewheel, Pagination, Keyboard]}
              slidesPerView="auto"
              spaceBetween={16}
              speed={800}
              keyboard={{
                enabled: true,
              }}
              mousewheel
              pagination={{
                clickable: true,
                dynamicBullets: false
              }}
              loop={false}
              className="savings-account-swiper pb-8"
            >
              {savingsAccounts.map((account) => (
                <SwiperSlide key={account.id} className="!w-auto">
                  <SavingsAccountCard account={account} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
}; 