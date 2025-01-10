export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface CreateCategoryRequest {
  name: string;
  icon: string;
}

export interface CategoryResponse {
  message?: string;
  error?: string;
  data?: Category | Category[];
} 