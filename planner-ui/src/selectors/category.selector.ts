import { RootState } from '../store/index.store';

export const getCategories = (state: RootState) => state.category.categories; 