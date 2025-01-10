import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { AddSavingsAccountForm } from "../AddSavingsAccountForm/AddSavingsAccountForm";

interface AddMainAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddMainAccountDialog = ({ open, onOpenChange }: AddMainAccountDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj główne konto</DialogTitle>
        </DialogHeader>
        <AddSavingsAccountForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}; 