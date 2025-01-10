export interface User {
  id: string;
  email: string;
}

export interface UserResponse {
  message: string;
  user?: User;
}

export interface DeleteUserResponse {
  message: string;
} 