import {Path} from "../../main.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const isLogged = false;

  useEffect(() => {
    if(!isLogged) {
      console.log('should redirect')
      navigate(Path.LOGIN);
    }
  }, [isLogged])


  return (
    <div>
      Dashboard
      <Outlet />
    </div>
  );
};

export default Dashboard;
