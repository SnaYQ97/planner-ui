import { useNavigate} from "react-router-dom";
import {Path} from "../../../../main.tsx";
import AuthService from "../../../../services/AuthService/Auth.service.ts";
import {useEffect} from "react";

const Logout = () => {

  const navigate = useNavigate();

  const logout = () => AuthService().logout().then(
    () => {
      navigate(Path.LOGIN);
    }
  );

  useEffect(() => {
    logout();
  }, [])

  return (
    <>
      <div>Logout</div>
    </>
  );
};

export default Logout;
