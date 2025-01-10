import * as yup from 'yup';

export const categorySchema = yup.object().shape({
  name: yup
    .string()
    .required('Nazwa kategorii jest wymagana')
    .min(2, 'Nazwa musi mieć minimum 2 znaki'),
  icon: yup
    .string()
    .required('Ikona jest wymagana'),
  budget: yup
    .number()
    .typeError('Budżet musi być liczbą')
    .min(0, 'Budżet nie może być ujemny')
    .required('Budżet jest wymagany'),
  color: yup
    .string()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Nieprawidłowy format koloru')
    .required('Kolor jest wymagany'),
}); 