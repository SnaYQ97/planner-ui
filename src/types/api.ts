import { User } from "./user.ts";

export interface ApiResponse {
  user?: User;
  message?: string;
  data?: any;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
}
