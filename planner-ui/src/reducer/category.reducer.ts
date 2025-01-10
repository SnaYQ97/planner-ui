import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../types/category';

interface CategoryState {
  categories: Category[];
  error: string | null;
  loading: boolean;
}

const initialState: CategoryState = {
  categories: [],
  error: null,
  loading: false,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.error = null;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      const category = {
        ...action.payload,
        budget: typeof action.payload.budget === 'string' 
          ? parseFloat(action.payload.budget) 
          : action.payload.budget,
        currentSpent: typeof action.payload.currentSpent === 'string'
          ? parseFloat(action.payload.currentSpent)
          : action.payload.currentSpent
      };
      state.categories.push(category);
      state.error = null;
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        const category = {
          ...action.payload,
          budget: typeof action.payload.budget === 'string'
            ? parseFloat(action.payload.budget)
            : action.payload.budget,
          currentSpent: typeof action.payload.currentSpent === 'string'
            ? parseFloat(action.payload.currentSpent)
            : action.payload.currentSpent
        };
        state.categories[index] = category;
      }
      state.error = null;
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  setError,
  clearError,
} = categorySlice.actions;

export default categorySlice.reducer; 