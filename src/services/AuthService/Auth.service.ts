import BaseService from "../BaseService/Base.service.ts";
import { useMutation } from '@tanstack/react-query';
import type { AuthSchema } from "@schemas/auth.schema.ts";

interface UserCredentials {
  email: string;
  password: string;
}

interface AuthStatusResponse {
  message: string;
  user: {
    id: string;
    email: string;
  }
}

const AuthService = () => {
  const Service = BaseService()

  const login = (data: UserCredentials) => Service.post("/auth", data, {
    withCredentials: true,
  })

  const register = (data: AuthSchema) => Service.post("/auth/register", data, {
    withCredentials: true,
  })

  const logout = () => Service.get("/auth/logout", {
    withCredentials: true,
  })

  const status = () => Service.get<AuthStatusResponse>("/auth/status", {
    withCredentials: true,
  })

  return {
    login,
    register,
    logout,
    status,
  }
}

export const authService = AuthService();

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: UserCredentials) => authService.login(credentials),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: AuthSchema) => authService.register(data),
  });
};

export default AuthService;
