import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import { Category } from "../../../../types/category";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  totalBudget: number;
}

export const CategoryCard = ({ category, onEdit, onDelete, totalBudget }: CategoryCardProps) => {
  const budget = typeof category.budget === 'string' ? parseFloat(category.budget) : category.budget;
  const currentSpent = typeof category.currentSpent === 'string' ? parseFloat(category.currentSpent) : category.currentSpent;
  const percentage = totalBudget > 0 ? Math.round((budget / totalBudget) * 100) : 0;

  return (
    <Card 
      className="relative p-4 h-24 w-[200px] flex flex-col justify-between overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}99 100%)`,
        position: 'relative'
      }}
    >
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%)',
      }} />
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-background/20">
              <MoreVertical className="h-4 w-4 pointer-events-none text-white" />
              <span className="sr-only">Otwórz menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edytuj</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(category.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Usuń</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="text-white">
        <div className="text-lg font-bold">{budget.toLocaleString('pl-PL')} zł</div>
        <div className="text-sm">{category.name}</div>
        <div className="text-xs opacity-80">{percentage}%</div>
      </div>
    </Card>
  );
}; 