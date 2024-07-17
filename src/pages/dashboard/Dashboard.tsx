import {Path} from "../../main.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  // get value form cookie
  const isLogged = false;

  useEffect(() => {
    if(!isLogged) {
      console.log('should redirect')
      navigate(Path.LOGIN);
    }
  }, [isLogged, navigate])


  return (
    <div>
      Dashboard
      <Outlet />
    </div>
  );
};

export default Dashboard;
