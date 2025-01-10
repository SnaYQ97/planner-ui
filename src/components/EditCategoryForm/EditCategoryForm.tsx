import { useState, ChangeEvent, FocusEvent} from 'react';
import { useUpdateCategory, useDeleteCategory } from '@services/CategoryService/Category.service.ts';
import { Category } from '@types/category.ts';
import { Button } from '@components/ui/button.tsx';
import { Input } from '@components/ui/input.tsx';
import { Label } from '@components/ui/label.tsx';
import { Alert, AlertDescription } from '@components/ui/alert.tsx';
import { ScrollArea } from "@components/ui/scroll-area.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog.tsx";
import { ColorPicker } from '../ColorPicker/ColorPicker.tsx';
import Validation from '@validation/validation.ts';

interface EditCategoryFormProps {
  category: Category;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ValidationState {
  isValid: boolean;
  error: string;
  value: string;
  isDirty: boolean;
}

const INITIAL_VALIDATION_STATE: ValidationState = {
  isValid: false,
  error: '',
  value: '',
  isDirty: false,
};

enum InputName {
  NAME = 'name',
  COLOR = 'color',
  BUDGET = 'budget'
}

export const EditCategoryForm = ({ category, onSuccess, onCancel }: EditCategoryFormProps) => {
  const [form, setForm] = useState<Record<InputName, ValidationState>>({
    [InputName.NAME]: { ...INITIAL_VALIDATION_STATE, value: category.name, isValid: true },
    [InputName.COLOR]: { ...INITIAL_VALIDATION_STATE, value: category.color, isValid: true },
    [InputName.BUDGET]: { ...INITIAL_VALIDATION_STATE, value: String(category.budget), isValid: true },
  });

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const FormValidation = {
    [InputName.NAME]: (value: string) => {
      return new Validation(value)
        .isRequired('Nazwa kategorii jest wymagana')
        .hasMinLength(2, 'Nazwa kategorii musi mieć co najmniej 2 znaki')
        .hasMaxLength(50, 'Nazwa kategorii nie może być dłuższa niż 50 znaków');
    },
    [InputName.COLOR]: (value: string) => {
      return new Validation(value)
        .isRequired('Kolor jest wymagany')
        .matches(/^#[0-9A-Fa-f]{6}$/, 'Nieprawidłowy format koloru. Format: #RRGGBB');
    },
    [InputName.BUDGET]: (value: string) => {
      const validation = new Validation(value)
        .isRequired('Budżet jest wymagany');

      if (value) {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          validation.error = 'Budżet musi być liczbą';
          validation.isValid = false;
        } else if (numValue < 0) {
          validation.error = 'Budżet nie może być ujemny';
          validation.isValid = false;
        }
      }

      return validation;
    },
  };

  const isFormValid = () => {
    return Object.values(form).every(field => field.isValid);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dirtyForm = Object.entries(form).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: {
        ...value,
        isDirty: true,
      },
    }), {} as Record<InputName, ValidationState>);
    setForm(dirtyForm);

    if (!isFormValid()) {
      return;
    }

    const categoryData = {
      name: form[InputName.NAME].value,
      color: form[InputName.COLOR].value,
      budget: parseFloat(form[InputName.BUDGET].value),
    };

    updateCategory(
      { id: category.id, data: categoryData },
      {
        onSuccess: (response) => {
          if (response.data.data && !Array.isArray(response.data.data)) {
            onSuccess?.();
          }
        },
        onError: (error: any) => {
          setIsAlertVisible(true);
          setAlertMessage(error.response?.data?.error || 'Wystąpił błąd podczas aktualizacji kategorii');
        },
      }
    );
  };

  const handleDelete = () => {
    deleteCategory(category.id, {
      onSuccess: (response) => {
        if (response.data.message) {
          onSuccess?.();
        }
      },
      onError: (error: any) => {
        setIsAlertVisible(true);
        setAlertMessage(error.response?.data?.error || 'Wystąpił błąd podczas usuwania kategorii');
      },
    });
  };

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const validation = FormValidation[name as InputName](value);

    setForm(prev => ({
      ...prev,
      [name]: {
        ...validation,
        value,
        isDirty: true,
        error: validation.error || '',
      },
    }));
  };

  const onBlurInput = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const validation = FormValidation[name as InputName](value);

    setForm(prev => ({
      ...prev,
      [name]: {
        ...validation,
        value,
        isDirty: true,
        error: validation.error || '',
      },
    }));
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      {isAlertVisible && (
        <Alert variant="destructive">
          <AlertDescription>
            {alertMessage}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <div>
              <Label>Nazwa kategorii</Label>
              <Input
                name={InputName.NAME}
                value={form[InputName.NAME].value}
                onChange={onChangeInput}
                onBlur={onBlurInput}
              />
              {form[InputName.NAME].isDirty && form[InputName.NAME].error && (
                <p className="text-sm font-medium text-destructive">{form[InputName.NAME].error}</p>
              )}
            </div>

            <div>
              <Label>Kolor</Label>
              <ColorPicker
                selectedColor={form[InputName.COLOR].value}
                onSelect={(color) => {
                  const validation = FormValidation[InputName.COLOR](color);
                  setForm(prev => ({
                    ...prev,
                    [InputName.COLOR]: {
                      ...validation,
                      value: color,
                      isDirty: true,
                      error: validation.error || '',
                    },
                  }));
                }}
              />
              {form[InputName.COLOR].isDirty && form[InputName.COLOR].error && (
                <p className="text-sm font-medium text-destructive">{form[InputName.COLOR].error}</p>
              )}
            </div>

            <div>
              <Label>Budżet</Label>
              <Input
                name={InputName.BUDGET}
                value={form[InputName.BUDGET].value}
                onChange={onChangeInput}
                onBlur={onBlurInput}
                type="number"
                min="0"
                step="0.01"
              />
              {form[InputName.BUDGET].isDirty && form[InputName.BUDGET].error && (
                <p className="text-sm font-medium text-destructive">{form[InputName.BUDGET].error}</p>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="pt-4 space-x-2 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowDeleteConfirmation(true)}
            disabled={isDeleting}
          >
            Usuń
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Anuluj
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid() || isUpdating}
          >
            Zapisz
          </Button>
        </div>
      </form>

      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Czy na pewno chcesz usunąć tę kategorię?</DialogTitle>
            <DialogDescription>
              Ta operacja jest nieodwracalna. Wszystkie wydatki przypisane do tej kategorii zostaną usunięte.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteConfirmation(false)}
            >
              Anuluj
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Usuń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
