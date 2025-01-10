export interface Category {
  id: string;
  name: string;
  color: string;
  budget: string | number;
  currentSpent: string | number;
  userId: string;
}

export interface CategoryResponse {
  data?: Category | Category[];
  message?: string;
  error?: string;
}

export interface CreateCategoryRequest {
  name: string;
  color: string;
  budget: number;
} 