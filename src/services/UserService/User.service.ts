import BaseService from "../BaseService/Base.service.ts";

const UserService = () => {
  const Service = BaseService()
  const get = () => {
    return Service.get("/users")
  }
  return {
    get,
  }
}

export default UserService;
