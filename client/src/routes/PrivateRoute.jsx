import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoutes }) => {
  // const token = localStorage.getItem("token");
  // const userRole = localStorage.getItem("role"); 

  // if (!token) {
  //   return <Navigate to="/login" replace />;
  // }

  // if (allowedRoutes && !allowedRoutes.includes(userRole)) {
  //   return <Navigate to="/login" replace />;
  // }

  return <Outlet />;
};

export default PrivateRoute;
