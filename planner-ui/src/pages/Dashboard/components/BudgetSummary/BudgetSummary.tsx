import { Doughnut } from 'react-chartjs-2';
import { Category } from '../../../../types/category';
import { formatCurrency } from '@lib/utils';
import { Chart as ChartJS, ChartData } from 'chart.js';
import { useEffect, useRef } from 'react';
import { DateTime } from 'luxon';

interface BudgetSummaryProps {
  categories: Category[];
  totalBudget: number;
  remainingBudget: number;
  totalIncome: number;
  availableFunds: number;
  selectedMonth: Date;
}

export const BudgetSummary = ({ 
  categories, 
  totalBudget, 
  remainingBudget,
  totalIncome,
  availableFunds,
  selectedMonth
}: BudgetSummaryProps) => {
  const budgetUtilization = totalIncome > 0 ? (totalBudget / totalIncome) * 100 : 0;
  const chartRef = useRef<ChartJS<"doughnut">>(null);

  const formatMonthYear = (date: Date) => {
    return DateTime.fromJSDate(date)
      .setLocale('pl')
      .toFormat('LLLL yyyy');
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !chart.ctx) return;

    const gradients = categories.map(cat => {
      const gradient = chart.ctx.createLinearGradient(0, 0, 150, 0);
      gradient.addColorStop(0, cat.color);
      gradient.addColorStop(1, `${cat.color}99`);
      return gradient;
    });

    if (chart.data && chart.data.datasets) {
      chart.data.datasets[0].backgroundColor = gradients;
      chart.update();
    }
  }, [categories]);
  
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Zaplanowany budżet w {formatMonthYear(selectedMonth)}</p>
        <div className="flex items-center gap-16">
          <div>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-yellow-500">
              {remainingBudget > 0 
                ? `Możesz jeszcze zaplanować: ${formatCurrency(remainingBudget)}`
                : 'Przekroczono planowany budżet'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {budgetUtilization.toFixed(1)}% miesięcznych przychodów
            </p>
          </div>
          <div className="w-24 h-24 relative shrink-0">
            {categories.length > 0 ? (
              <Doughnut
                ref={chartRef}
                data={{
                  labels: categories.map((cat: Category) => cat.name),
                  datasets: [{
                    data: categories.map((cat: Category) => cat.budget),
                    backgroundColor: categories.map((cat: Category) => cat.color),
                    borderWidth: 0,
                    spacing: 2,
                  }]
                }}
                options={{
                  cutout: '70%',
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      enabled: true,
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const percentage = Math.round((Number(value) / totalBudget) * 100);
                          return `${label}: ${formatCurrency(Number(value))} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                Brak kategorii
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 