import axios from "axios";
import {getApiUrl} from "../../config/config.ts";

const BaseService = () => {
  return axios.create({
    baseURL: getApiUrl(),
  })
}

export default BaseService;
