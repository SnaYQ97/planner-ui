import {Outlet} from "react-router-dom";
import {useEffect} from "react";

const Dashboard = () => {
  // get value form cookie

  useEffect(() => {
    // console log cookies

  }, [])


  return (
    <div>
      Dashboard
      <Outlet />
    </div>
  );
};

export default Dashboard;
