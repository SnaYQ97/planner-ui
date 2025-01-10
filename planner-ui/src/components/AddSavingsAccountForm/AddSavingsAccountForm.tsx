import { useState, useEffect } from 'react';
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateBankAccount, useUpdateBankAccount } from '@services/BankAccountService/BankAccount.service';
import type { BankAccount, CreateBankAccountRequest, AccountType } from '../../types/bankAccount';
import { ValidationError } from "yup";
import { bankAccountSchema } from "../../schemas/bankAccount.schema";
import { useDispatch } from 'react-redux';
import { updateBankAccount as updateBankAccountAction } from '../../reducer/bankAccount.reducer';
import { ColorPicker } from '../ColorPicker/ColorPicker';
import './AddSavingsAccountForm.module.css';

interface AddSavingsAccountFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: BankAccount;
}

interface FormState {
  accountType: string;
  name: string;
  balance: string;
  accountNumber: string;
  interestRate: string;
  interestRateLimit: string;
  interestStartDate: string;
  interestEndDate: string;
  targetAmount: string;
  targetDate: string;
  color: string;
}

interface FormErrors {
  accountType?: string;
  name?: string;
  balance?: string;
  accountNumber?: string;
  interestRate?: string;
  interestRateLimit?: string;
  interestStartDate?: string;
  interestEndDate?: string;
  targetAmount?: string;
  targetDate?: string;
  color?: string;
}

export const AddSavingsAccountForm = ({ onSuccess, onCancel, initialData }: AddSavingsAccountFormProps) => {
  const [form, setForm] = useState<FormState>({
    accountType: initialData?.accountType || 'SAVINGS',
    name: initialData?.name || '',
    balance: initialData?.balance.toString() || '',
    accountNumber: initialData?.accountNumber || '',
    interestRate: initialData?.interestRate?.toString() || '',
    interestRateLimit: initialData?.interestRateLimit?.toString() || '',
    interestStartDate: initialData?.interestStartDate || '',
    interestEndDate: initialData?.interestEndDate || '',
    targetAmount: initialData?.targetAmount?.toString() || '',
    targetDate: initialData?.targetDate || '',
    color: initialData?.color || '#9333ea',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const createBankAccount = useCreateBankAccount();
  const updateBankAccount = useUpdateBankAccount();

  useEffect(() => {
    const validateFormFields = async () => {
      try {
        await bankAccountSchema.validate(form, { abortEarly: false });
        setIsFormValid(true);
      } catch (err) {
        setIsFormValid(false);
      }
    };
    validateFormFields();
  }, [form]);

  const validateField = async (name: string, value: any) => {
    try {
      await bankAccountSchema.validateAt(name, { [name]: value });
      setErrors(prev => ({ ...prev, [name]: undefined }));
      return true;
    } catch (err) {
      if (err instanceof ValidationError) {
        setErrors(prev => ({ ...prev, [name]: err.message }));
      }
      return false;
    }
  };

  const validateForm = async () => {
    try {
      const validatedData = await bankAccountSchema.validate(form, { abortEarly: false });
      setErrors({});
      return validatedData;
    } catch (err) {
      if (err instanceof ValidationError) {
        const newErrors: FormErrors = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path as keyof FormErrors] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    try {
      const formData: CreateBankAccountRequest = {
        accountType: form.accountType as AccountType,
        name: form.name,
        balance: parseFloat(form.balance),
        accountNumber: form.accountNumber.replace(/\s/g, ''),
        interestRate: form.interestRate ? parseFloat(form.interestRate) : null,
        interestRateLimit: form.interestRateLimit ? parseFloat(form.interestRateLimit) : null,
        interestStartDate: form.interestStartDate || null,
        interestEndDate: form.interestEndDate || null,
        targetAmount: form.targetAmount ? parseFloat(form.targetAmount) : null,
        targetDate: form.targetDate || null,
        color: form.color || "#9333ea",
      };

      if (initialData) {
        const response = await updateBankAccount.mutateAsync({
          id: initialData.id,
          data: formData
        });
        if (response.data.account) {
          dispatch(updateBankAccountAction(response.data.account));
        }
      } else {
        await createBankAccount.mutateAsync(formData);
      }

      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
      onSuccess?.();
    } catch (error) {
      console.error('Błąd podczas zapisywania konta:', error);
    }
  };

  const formatAccountNumber = (value: string) => {
    const number = value.replace(/\s/g, '');
    return number.replace(/(\d{2})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4 $5 $6 $7');
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'accountNumber') {
      const rawValue = value.replace(/\s/g, '');
      if (rawValue.length <= 26 && /^\d*$/.test(rawValue)) {
        const formatted = formatAccountNumber(rawValue);
        setForm(prev => ({ ...prev, [name]: formatted }));
        await validateField(name, formatted);
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
      await validateField(name, value);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <ScrollArea className="flex-grow pr-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nazwa konta</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nazwa konta oszczędnościowego"
              error={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm font-medium text-destructive">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="balance">Saldo początkowe</Label>
            <Input
              id="balance"
              name="balance"
              type="number"
              step="1"
              min="0"
              value={form.balance}
              onChange={handleChange}
              placeholder="0.00"
              error={!!errors.balance}
            />
            {errors.balance && (
              <p className="text-sm font-medium text-destructive">{errors.balance}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Numer konta</Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              placeholder="XX XXXX XXXX XXXX XXXX XXXX XXXX"
              error={!!errors.accountNumber}
            />
            {errors.accountNumber && (
              <p className="text-sm font-medium text-destructive">{errors.accountNumber}</p>
            )}
          </div>

          <div>
            <Label htmlFor="interestRate">Oprocentowanie (%)</Label>
            <Input
              id="interestRate"
              name="interestRate"
              type="number"
              step="0.01"
              min="0"
              value={form.interestRate}
              onChange={handleChange}
              placeholder="np. 3.5"
              error={!!errors.interestRate}
            />
            {errors.interestRate && (
              <p className="text-sm font-medium text-destructive">{errors.interestRate}</p>
            )}
          </div>

          <div>
            <Label htmlFor="interestRateLimit">Limit oprocentowania</Label>
            <Input
              id="interestRateLimit"
              name="interestRateLimit"
              type="number"
              step="1"
              min="0"
              value={form.interestRateLimit}
              onChange={handleChange}
              placeholder="Maksymalna kwota objęta oprocentowaniem"
              error={!!errors.interestRateLimit}
            />
            {errors.interestRateLimit && (
              <p className="text-sm font-medium text-destructive">{errors.interestRateLimit}</p>
            )}
          </div>

          <div>
            <Label htmlFor="interestStartDate">Data rozpoczęcia oprocentowania</Label>
            <Input
              id="interestStartDate"
              name="interestStartDate"
              type="date"
              value={form.interestStartDate}
              onChange={handleChange}
              error={!!errors.interestStartDate}
            />
            {errors.interestStartDate && (
              <p className="text-sm font-medium text-destructive">{errors.interestStartDate}</p>
            )}
          </div>

          <div>
            <Label htmlFor="interestEndDate">Data zakończenia oprocentowania</Label>
            <Input
              id="interestEndDate"
              name="interestEndDate"
              type="date"
              value={form.interestEndDate}
              onChange={handleChange}
              error={!!errors.interestEndDate}
            />
            {errors.interestEndDate && (
              <p className="text-sm font-medium text-destructive">{errors.interestEndDate}</p>
            )}
          </div>

          <div>
            <Label htmlFor="targetAmount">Kwota docelowa</Label>
            <Input
              id="targetAmount"
              name="targetAmount"
              type="number"
              step="1"
              value={form.targetAmount}
              onChange={handleChange}
              placeholder="Cel oszczędnościowy"
              error={!!errors.targetAmount}
            />
            {errors.targetAmount && (
              <p className="text-sm font-medium text-destructive">{errors.targetAmount}</p>
            )}
          </div>

          <div>
            <Label htmlFor="targetDate">Data osiągnięcia celu</Label>
            <Input
              id="targetDate"
              name="targetDate"
              type="date"
              value={form.targetDate}
              onChange={handleChange}
              error={!!errors.targetDate}
            />
            {errors.targetDate && (
              <p className="text-sm font-medium text-destructive">{errors.targetDate}</p>
            )}
          </div>

          <div>
            <Label>Kolor tła</Label>
            <ColorPicker
              selectedColor={form.color}
              onSelect={(color) => {
                setForm(prev => ({
                  ...prev,
                  color
                }));
                validateField('color', color);
              }}
            />
            {errors.color && (
              <p className="text-sm font-medium text-destructive">{errors.color}</p>
            )}
          </div>
        </form>
      </ScrollArea>

      <div className="flex justify-end gap-2 pt-4 border-t mt-4">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Anuluj
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={createBankAccount.isPending || updateBankAccount.isPending || !isFormValid}
          onClick={handleSubmit}
        >
          {createBankAccount.isPending || updateBankAccount.isPending ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {initialData ? 'Zapisywanie...' : 'Dodawanie...'}
            </span>
          ) : (
            initialData ? 'Zapisz zmiany' : 'Dodaj konto'
          )}
        </Button>
      </div>
    </div>
  );
}; 