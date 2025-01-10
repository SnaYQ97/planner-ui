import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form.tsx";
import { Input } from "@components/ui/input.tsx";
import { Button } from "@components/ui/button.tsx";
import { Transaction } from "@types/transaction.ts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select.tsx";
import { useSelector } from "react-redux";
import { getCategories } from "@selectors/category.selector.ts";
import { getBankAccounts } from "@selectors/bankAccount.selector.ts";
import { DateTime } from "luxon";
import { Label } from "@components/ui/label.tsx";
import { useGetCategories } from "@services/CategoryService/Category.service.ts";
import { useGetBankAccounts } from "@services/BankAccountService/BankAccount.service.ts";
import { useUpdateTransaction } from "@services/TransactionService/Transaction.service.ts";
import { useCreateTransaction } from "@services/TransactionService/Transaction.service.ts";
import { useQueryClient } from "@tanstack/react-query";
import { transactionSchema } from "@schemas/transaction.schema.ts";
import { useState, useEffect } from "react";
import { ValidationError } from "yup";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/dialog.tsx";
import { AddCategoryForm } from "@components/AddCategoryForm/AddCategoryForm.tsx";
import { Plus } from "lucide-react";

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSuccess: () => void;
  defaultType?: 'EXPENSE' | 'INCOME';
}

interface FormState {
  amount: string;
  description: string;
  categoryId: string;
  accountId: string;
  date: string;
  type: 'EXPENSE' | 'INCOME';
}

interface FormErrors {
  amount?: string;
  description?: string;
  categoryId?: string;
  accountId?: string;
  date?: string;
  type?: string;
}

export const TransactionForm = ({ transaction, onSuccess, defaultType = 'EXPENSE' }: TransactionFormProps) => {
  const [form, setForm] = useState<FormState>({
    amount: transaction?.amount.toString() || '',
    description: transaction?.description || '',
    categoryId: transaction?.categoryId || '',
    accountId: transaction?.accountId || '',
    date: transaction ? DateTime.fromISO(transaction.date).toFormat('yyyy-MM-dd\'T\'HH:mm') :
      DateTime.now().toFormat('yyyy-MM-dd\'T\'HH:mm'),
    type: transaction?.type || defaultType
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const queryClient = useQueryClient();
  const { data: categoriesResponse } = useGetCategories();
  const { data: accountsResponse } = useGetBankAccounts();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();

  useEffect(() => {
    if (accountsResponse?.data?.accounts && !transaction) {
      const dailyAccount = accountsResponse.data.accounts.find(
        account => account.accountType === 'DAILY'
      );
      if (dailyAccount) {
        setForm(prev => ({
          ...prev,
          accountId: dailyAccount.id
        }));
      }
    }
  }, [accountsResponse, transaction]);

  useEffect(() => {
    const validateFormFields = async () => {
      try {
        const formData = {
          ...form,
          amount: parseFloat(form.amount) || 0,
          date: new Date(form.date)
        };

        if (form.type === 'INCOME') {
          delete formData.categoryId;
        }

        const result = transactionSchema.safeParse(formData);
        console.log('Validation result:', {
          success: result.success,
          data: formData,
          errors: !result.success ? result.error.errors : null
        });

        if (result.success) {
          setIsFormValid(true);
          setErrors({});
        } else {
          setIsFormValid(false);
          const newErrors: FormErrors = {};
          result.error.errors.forEach((error) => {
            if (error.path) {
              newErrors[error.path[0] as keyof FormErrors] = error.message;
            }
          });
          setErrors(newErrors);
        }
      } catch (err) {
        console.log('Validation error:', err);
        setIsFormValid(false);
      }
    };
    validateFormFields();
  }, [form]);

  const validateField = async (name: string, value: any) => {
    try {
      let parsedValue = value;
      if (name === 'amount') {
        parsedValue = parseFloat(value) || 0;
      } else if (name === 'date') {
        parsedValue = new Date(value);
      }

      if (name === 'categoryId' && form.type === 'INCOME') {
        setErrors(prev => ({ ...prev, [name]: undefined }));
        return true;
      }

      const schema = name === 'categoryId' ?
        transactionSchema.pick({ [name]: true, type: true }) :
        transactionSchema.pick({ [name]: true });

      const dataToValidate = name === 'categoryId' ?
        { [name]: parsedValue, type: form.type } :
        { [name]: parsedValue };

      const result = schema.safeParse(dataToValidate);
      if (result.success) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
        return true;
      } else {
        setErrors(prev => ({ ...prev, [name]: result.error.errors[0]?.message }));
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const validateForm = async () => {
    const formData = {
      ...form,
      amount: parseFloat(form.amount) || 0,
      date: new Date(form.date)
    };

    if (form.type === 'INCOME') {
      delete formData.categoryId;
    }

    const result = transactionSchema.safeParse(formData);
    console.log('Form validation result:', {
      success: result.success,
      data: formData,
      errors: !result.success ? result.error.errors : null
    });

    if (result.success) {
      setErrors({});
      return result.data;
    } else {
      const newErrors: FormErrors = {};
      result.error.errors.forEach((error) => {
        if (error.path) {
          newErrors[error.path[0] as keyof FormErrors] = error.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validatedData = await validateForm();
    if (validatedData) {
      try {
        if (transaction) {
          await updateTransaction.mutateAsync({
            id: transaction.id,
            data: {
              ...validatedData,
              amount: parseFloat(validatedData.amount)
            }
          });
        } else {
          await createTransaction.mutateAsync({
            ...validatedData,
            amount: parseFloat(validatedData.amount)
          });
        }

        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        onSuccess();
      } catch (error) {
        console.error('Błąd podczas zapisywania transakcji:', error);
      }
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsDirty(true);
    setForm(prev => ({ ...prev, [name]: value }));
    await validateField(name, value);
  };

  const handleSelectChange = async (name: string, value: string) => {
    setIsDirty(true);
    if (name === 'type' && value === 'INCOME') {
      setForm(prev => ({
        ...prev,
        [name]: value,
        categoryId: ''
      }));
      setErrors(prev => ({
        ...prev,
        categoryId: undefined
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    await validateField(name, value);
  };

  const handleAddCategorySuccess = () => {
    setShowAddCategoryDialog(false);
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  const categories = Array.isArray(categoriesResponse?.data?.data)
    ? categoriesResponse.data.data
    : [];

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="type">Typ</Label>
          <Select
            value={form.type}
            onValueChange={(value) => handleSelectChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wybierz typ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Przychód</SelectItem>
              <SelectItem value="EXPENSE">Wydatek</SelectItem>
            </SelectContent>
          </Select>
          {isDirty && errors.type && (
            <p className="text-sm font-medium text-destructive">{errors.type}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Nazwa</Label>
          <Input
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder={form.type === 'INCOME' ? "Nazwa przychodu" : "Nazwa wydatku"}
            error={isDirty && !!errors.description}
          />
          {isDirty && errors.description && (
            <p className="text-sm font-medium text-destructive">{errors.description}</p>
          )}
        </div>

        <div>
          <Label htmlFor="amount">Kwota</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            error={isDirty && !!errors.amount}
          />
          {isDirty && errors.amount && (
            <p className="text-sm font-medium text-destructive">{errors.amount}</p>
          )}
        </div>

        {form.type === 'EXPENSE' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="categoryId">Kategoria</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddCategoryDialog(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Dodaj kategorię
              </Button>
            </div>
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Brak kategorii. Dodaj pierwszą kategorię, aby móc dodać wydatek.
              </p>
            ) : (
              <>
                <Select
                  value={form.categoryId}
                  onValueChange={(value) => handleSelectChange('categoryId', value)}
                >
                  <SelectTrigger error={isDirty && !!errors.categoryId}>
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isDirty && errors.categoryId && (
                  <p className="text-sm font-medium text-destructive">{errors.categoryId}</p>
                )}
              </>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            name="date"
            type="datetime-local"
            value={form.date}
            onChange={handleChange}
            error={isDirty && !!errors.date}
          />
          {isDirty && errors.date && (
            <p className="text-sm font-medium text-destructive">{errors.date}</p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={!isDirty || createTransaction.isPending || updateTransaction.isPending || !isFormValid}
          >
            {createTransaction.isPending || updateTransaction.isPending ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {transaction ? 'Zapisywanie...' : 'Dodawanie...'}
              </span>
            ) : (
              transaction ? 'Zapisz zmiany' : form.type === 'INCOME' ? 'Dodaj przychód' : 'Dodaj wydatek'
            )}
          </Button>
        </div>
      </form>

      <Dialog open={showAddCategoryDialog} onOpenChange={setShowAddCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dodaj nową kategorię</DialogTitle>
          </DialogHeader>
          <AddCategoryForm onSuccess={handleAddCategorySuccess} onCancel={() => setShowAddCategoryDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
