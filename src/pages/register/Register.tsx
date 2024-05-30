import UserService from "../../services/UserService/User.service.ts";
import {useEffect} from "react";

export enum RegisterTab {
  REGISTER = 'register',
  LOGIN = 'login',

}

interface RegisterProps {
  tab: RegisterTab;
}

const Register = (props: RegisterProps) => {
  const { tab } = props;

  useEffect(() => {
    UserService().get().then((response) => {
      console.log(response)
    })
  }, [])

  return (
    <div>
      {tab === RegisterTab.REGISTER ? (
        <div>
          Register
        </div>
      ) : (
        <div>
          Login
        </div>
      )}
    </div>
  );
};

export default Register;
