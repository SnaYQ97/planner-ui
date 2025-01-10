import * as yup from 'yup';

export const bankAccountSchema = yup.object().shape({
  accountType: yup
    .string()
    .oneOf(['SAVINGS', 'DAILY'], 'Nieprawidłowy typ konta')
    .required('Typ konta jest wymagany'),
  name: yup
    .string()
    .min(3, 'Nazwa konta musi mieć co najmniej 3 znaki')
    .max(50, 'Nazwa konta nie może być dłuższa niż 50 znaków')
    .required('Nazwa konta jest wymagana'),
  balance: yup
    .string()
    .matches(/^\d+(\.\d{1,2})?$/, 'Nieprawidłowy format salda')
    .test('min', 'Saldo nie może być mniejsze niż 0', value => 
      !value || value === '' || parseFloat(value) >= 0
    )
    .required('Saldo jest wymagane'),
  accountNumber: yup
    .string()
    .transform((value) => value.replace(/\s/g, ''))
    .matches(/^[0-9]{26}$/, 'Nieprawidłowy format numeru konta')
    .required('Numer konta jest wymagany'),
  interestRate: yup
    .string()
    .matches(/^\d+(\.\d{1,2})?$/, 'Nieprawidłowy format oprocentowania')
    .test('min', 'Oprocentowanie nie może być mniejsze niż 0', value => 
      !value || value === '' || parseFloat(value) >= 0
    )
    .nullable(),
  interestRateLimit: yup
    .string()
    .matches(/^\d+(\.\d{1,2})?$/, 'Nieprawidłowy format limitu oprocentowania')
    .test('min', 'Limit oprocentowania nie może być mniejszy niż 0', value => 
      !value || value === '' || parseFloat(value) >= 0
    )
    .nullable(),
  interestStartDate: yup
    .string()
    .nullable(),
  interestEndDate: yup
    .string()
    .nullable(),
  targetAmount: yup
    .string()
    .matches(/^\d+(\.\d{1,2})?$/, 'Nieprawidłowy format kwoty docelowej')
    .nullable(),
  targetDate: yup
    .string()
    .nullable(),
  color: yup
    .string()
    .matches(/^#[0-9A-Fa-f]{6}$/, 'Nieprawidłowy format koloru')
    .required('Kolor jest wymagany'),
}); 