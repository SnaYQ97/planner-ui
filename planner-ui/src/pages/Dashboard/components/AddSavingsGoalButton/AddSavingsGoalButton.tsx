import { Card } from "@components/ui/card";

interface AddSavingsGoalButtonProps {
  onClick: () => void;
}

export const AddSavingsGoalButton = ({ onClick }: AddSavingsGoalButtonProps) => {
  return (
    <Card 
      className="p-6 flex flex-col justify-center items-center gap-2 cursor-pointer hover:bg-accent transition-colors border-2 border-dashed border-muted h-[234px] text-center"
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-8 h-8 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center mb-2">
          <span className="text-xl text-muted-foreground">+</span>
        </div>
        <span className="text-sm text-muted-foreground text-center">Dodaj konto</span>
      </div>
    </Card>
  );
}; 