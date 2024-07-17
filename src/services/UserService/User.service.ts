import BaseService from "../BaseService/Base.service.ts";

export interface UserCreation {
  email: string;
  password: string;
}

const UserService = () => {
  const Service = BaseService()
  const getUsers = () => {
    return Service.get("/users")
  }

  const createUser = (data: UserCreation) => {
    return Service.post<UserCreation, string>("/users", data)
  }

  return {
    getUsers,
    createUser
  }
}

export default UserService;
