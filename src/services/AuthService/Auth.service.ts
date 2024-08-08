import BaseService from "../BaseService/Base.service.ts";


interface UserCredentials {
  email: string;
  password: string;
}

const AuthService = () => {
  const Service = BaseService()
  const login = (data: UserCredentials) => Service.post("/auth", data, {
    withCredentials: true,
  })
  const logout = () => Service.get("/auth/logout", {
    withCredentials: true,
  })

  const status = () => Service.get("/auth/status", {
    withCredentials: true,
  })

  return {
    login,
    logout,
    status,
  }
}

export default AuthService;
