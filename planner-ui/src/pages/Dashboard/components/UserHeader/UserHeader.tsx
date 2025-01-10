import { Button } from "@components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { User } from "@reducer/user.reducer";
import { MonthYearSelector } from "@components/MonthYearSelector/MonthYearSelector";

interface UserHeaderProps {
  user: User;
  onLogout: () => void;
  onSettings: () => void;
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

export const UserHeader = ({ 
  user, 
  onLogout, 
  onSettings,
  selectedMonth,
  onMonthChange 
}: UserHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-gray-600" />
          <div>
            <h2 className="text-lg font-semibold">Cześć, {user.email?.split('@')[0]}!</h2>
            <p className="text-sm text-muted-foreground">Miesięczny budżet</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost"
            size="icon"
            onClick={onSettings}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="w-full sm:w-[300px]">
        <MonthYearSelector
          selectedMonth={selectedMonth}
          onMonthChange={onMonthChange}
        />
      </div>
    </div>
  );
}; 