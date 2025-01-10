import { Button } from "@components/ui/button";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { User } from "@reducer/user.reducer";
import { MonthYearSelector } from "@components/MonthYearSelector/MonthYearSelector";
import { motion } from "framer-motion";
import { cn } from "@lib/utils";

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
      <motion.div 
        className="flex items-center justify-between w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <motion.div 
            className={cn(
              "h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center",
              "shadow-lg shadow-primary/20"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserIcon className="h-6 w-6 text-primary-foreground" />
          </motion.div>
          <div>
            <motion.h2 
              className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Cześć, {user.email?.split('@')[0]}!
            </motion.h2>
            <motion.p 
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Miesięczny budżet
            </motion.p>
          </div>
        </div>
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button 
            variant="ghost"
            size="icon"
            onClick={onSettings}
            className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-colors"
          >
            <Settings className="h-5 w-5 text-primary" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onLogout}
            className="h-10 w-10 rounded-xl hover:bg-accent transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
      <motion.div 
        className="w-full sm:w-[300px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <MonthYearSelector
          selectedMonth={selectedMonth}
          onMonthChange={onMonthChange}
        />
      </motion.div>
    </div>
  );
}; 