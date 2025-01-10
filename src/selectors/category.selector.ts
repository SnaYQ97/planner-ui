import { RootState } from '@store/index.store.ts';

export const getCategories = (state: RootState) => state.category.categories;
