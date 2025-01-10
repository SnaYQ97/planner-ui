import { useMutation, useQuery } from '@tanstack/react-query';
import BaseService from '../BaseService/Base.service.ts';
import { Category, CategoryResponse, CreateCategoryRequest } from '@types/category.ts';

const CategoryService = () => {
  const Service = BaseService();

  const getCategories = () =>
    Service.get<CategoryResponse>('/category', {
      withCredentials: true,
    });

  const getCategoryById = (id: string) =>
    Service.get<CategoryResponse>(`/category/${id}`, {
      withCredentials: true,
    });

  const createCategory = (data: CreateCategoryRequest) =>
    Service.post<CategoryResponse>('/category', data, {
      withCredentials: true,
    });

  const updateCategory = (id: string, data: CreateCategoryRequest) =>
    Service.put<CategoryResponse>(`/category/${id}`, data, {
      withCredentials: true,
    });

  const deleteCategory = (id: string) =>
    Service.delete<CategoryResponse>(`/category/${id}`, {
      withCredentials: true,
    });

  return {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export const categoryService = CategoryService();

// React Query hooks
export const useGetCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minut
    refetchOnWindowFocus: false,
  });
};

export const useGetCategoryById = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getCategoryById(id),
    retry: 1,
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryService.createCategory(data),
  });
};

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCategoryRequest }) =>
      categoryService.updateCategory(id, data),
  });
};

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
  });
};

export default CategoryService;
