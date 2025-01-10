import { Button } from "@components/ui/button.tsx";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select.tsx";
import { Badge } from "@components/ui/badge.tsx";
import { useMemo } from "react";

interface MonthYearSelectorProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

export const MonthYearSelector = ({ selectedMonth, onMonthChange }: MonthYearSelectorProps) => {
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i.toString(),
      label: new Date(2000, i, 1).toLocaleDateString("pl-PL", { month: "long" })
    }));
  }, []);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 2 }, (_, i) => ({
      value: (currentYear - i).toString(),
      label: (currentYear - i).toString()
    }));
  }, []);

  const isCurrentMonthYear = useMemo(() => {
    const now = new Date();
    return (
      selectedMonth.getMonth() === now.getMonth() &&
      selectedMonth.getFullYear() === now.getFullYear()
    );
  }, [selectedMonth]);

  const handleMonthChange = (monthStr: string) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(parseInt(monthStr));
    onMonthChange(newDate);
  };

  const handleYearChange = (yearStr: string) => {
    const newDate = new Date(selectedMonth);
    newDate.setFullYear(parseInt(yearStr));
    onMonthChange(newDate);
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    onMonthChange(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Select
          value={selectedMonth.getMonth().toString()}
          onValueChange={handleMonthChange}
        >
          <SelectTrigger className="w-[140px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedMonth.getFullYear().toString()}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!isCurrentMonthYear && (
        <Button
          variant="outline"
          size="icon"
          onClick={handleCurrentMonth}
          title="Wróć do bieżącego miesiąca"
        >
          <Badge variant="secondary" className="px-1">
            Dziś
          </Badge>
        </Button>
      )}
    </div>
  );
};
