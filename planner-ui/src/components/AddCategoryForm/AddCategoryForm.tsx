import { useState, ChangeEvent, FocusEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useCreateCategory, useUpdateCategory } from '@services/CategoryService/Category.service';
import { addCategory, updateCategory } from '@reducer/category.reducer';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Alert, AlertDescription } from '@components/ui/alert';
import { ScrollArea } from "@components/ui/scroll-area";
import { useQueryClient } from '@tanstack/react-query';
import { Category } from '../../types/category';
import { ColorPicker } from '../ColorPicker/ColorPicker';
import Validation from '@validation/validation';

interface AddCategoryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Category;
}

enum InputName {
  NAME = 'name',
  COLOR = 'color',
  BUDGET = 'budget'
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

export const AddCategoryForm = ({ onSuccess, onCancel, initialData }: AddCategoryFormProps) => {
  const [form, setForm] = useState<Record<InputName, ValidationState>>({
    [InputName.NAME]: { ...INITIAL_VALIDATION_STATE, value: initialData?.name || '', isValid: !!initialData },
    [InputName.COLOR]: { ...INITIAL_VALIDATION_STATE, value: initialData?.color || '#000000', isValid: !!initialData },
    [InputName.BUDGET]: { ...INITIAL_VALIDATION_STATE, value: initialData?.budget?.toString() || '', isValid: !!initialData },
  });

  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategoryMutation, isPending: isUpdating } = useUpdateCategory();

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

    if (initialData?.id) {
      updateCategoryMutation(
        { id: initialData.id, data: categoryData },
        {
          onSuccess: (response) => {
            if (response.data.data && !Array.isArray(response.data.data)) {
              dispatch(updateCategory(response.data.data));
              queryClient.invalidateQueries({ queryKey: ['categories'] });
              onSuccess?.();
            }
          },
          onError: (error: any) => {
            setIsAlertVisible(true);
            setAlertMessage(error.response?.data?.error || 'Wystąpił błąd podczas aktualizacji kategorii');
          },
        }
      );
    } else {
      createCategory(categoryData, {
        onSuccess: (response) => {
          if (response.data.data && !Array.isArray(response.data.data)) {
            dispatch(addCategory(response.data.data));
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            onSuccess?.();
          }
        },
        onError: (error: any) => {
          setIsAlertVisible(true);
          setAlertMessage(error.response?.data?.error || 'Wystąpił błąd podczas tworzenia kategorii');
        },
      });
    }
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
            onClick={onCancel}
          >
            Anuluj
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid() || isCreating || isUpdating}
          >
            {initialData ? 'Zapisz' : 'Dodaj'}
          </Button>
        </div>
      </form>
    </div>
  );
}; 