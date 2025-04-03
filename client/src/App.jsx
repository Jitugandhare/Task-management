import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import PrivateRoute from './routes/PrivateRoute';
import DashBoard from './pages/Admin/Dashboard';
import ManageTasks from './pages/Admin/ManageTasks';
import CreateTask from './pages/Admin/CreateTask';
import ManageUsers from './pages/Admin/ManageUsers';
import  UserDashboard from './pages/User/UserDashboard'
import MyTasks from './pages/User/MyTasks';
import ViewTaskDetails from './pages/User/ViewTaskDetails'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          {/* admin routes */}
          <Route element={<PrivateRoute allowedRoutes={['admin']} />}>
            <Route path='/admin/dashboard' element={<DashBoard />} />
            <Route path='/admin/tasks' element={<ManageTasks />} />
            <Route path='/admin/create-tasks' element={<CreateTask />} />
            <Route path='/admin/user' element={<ManageUsers />} />
          </Route>


          {/* user routes */}
          <Route element={<PrivateRoute allowedRoutes={['user']} />}>
            <Route path='/user/dashboard' element={<UserDashboard />} />
            <Route path='/user/mytasks' element={<MyTasks />} />
            <Route path='/user/task-details/:id' element={<ViewTaskDetails />} />
          </Route>

        </Routes>
      </Router>
    </div>
  );
};

export default App;