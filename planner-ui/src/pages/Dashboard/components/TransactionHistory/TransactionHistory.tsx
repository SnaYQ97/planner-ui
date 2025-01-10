import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { formatCurrency } from "@lib/utils";

interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  onFilterChange: (filter: string) => void;
}

const TransactionHistory = ({ transactions, onFilterChange }: TransactionHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between space-y-2">
          <div>
            <CardTitle>Historia Transakcji</CardTitle>
            <CardDescription>
              Ostatnie transakcje na Twoim koncie
            </CardDescription>
          </div>
          <Select onValueChange={onFilterChange} defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Wybierz okres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie</SelectItem>
              <SelectItem value="today">Dzisiaj</SelectItem>
              <SelectItem value="week">Ten tydzień</SelectItem>
              <SelectItem value="month">Ten miesiąc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {transaction.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.category}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString('pl-PL')}
                </div>
                <div className={`text-sm font-semibold ${transaction.amount < 0 ? 'text-destructive' : 'text-primary'}`}>
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory; 