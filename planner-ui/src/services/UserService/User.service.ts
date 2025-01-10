import BaseService from "../BaseService/Base.service";
import { useMutation } from '@tanstack/react-query';
import { DeleteUserResponse } from '../../types/user';

export interface UserCreation {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  loginAfterCreate?: boolean;
}

const UserService = () => {
  const Service = BaseService()

  const createUser = (data: UserCreation) => Service.post("/user", data, {
    withCredentials: true,
  });
  const deleteUser = (userId: string) => Service.delete<DeleteUserResponse>(`/user/${userId}`, {
    withCredentials: true,
  });

  return {
    createUser,
    deleteUser
  }
}

export const userService = UserService();

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (data: UserCreation) => userService.createUser(data),
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
  });
};

export default UserService;
