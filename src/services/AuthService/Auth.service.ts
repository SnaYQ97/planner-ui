import BaseService from "../BaseService/Base.service.ts";


interface UserCredentials {
  email: string;
  password: string;
}

const AuthService = () => {
  const Service = BaseService()
  const login = (data: UserCredentials) => {
    return Service.post("/auth/login", data)
  }

  return {
    login,
  }
}

export default AuthService;
