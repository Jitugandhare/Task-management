import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { UserContext } from '../../context/userContext';
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';
import HashLoader from 'react-spinners/HashLoader';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const Dashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      if (response.data) {
        const { data } = response.data;
        setDashboardData(data);

        // Example pie chart structure
        const pieData = [
          { name: 'Pending', value: data.pendingTasksCount || 0 },
          { name: 'In Progress', value: data.inProgressTasksCount || 0 },
          { name: 'Completed', value: data.completedTasksCount || 0 },
        ];
        setPieChartData(pieData);

        // You may modify this structure to suit your actual backend data
        const barData = [
          { name: 'Users with Tasks', value: data.usersWithTasksCount || 0 },
          { name: 'Total Users', value: data.allUsersCount || 0 },
        ];
        setBarChartData(barData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="flex justify-center items-center h-[400px]">
          <HashLoader color="#6366F1" size={80} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div className="col-span-3">
          <h2 className="text-xl md:text-2xl">
            Good Morning! {user?.name || 'User'}
          </h2>
          <p className="text-xs md:text-[13px] text-gray-400">
            {moment().format('dddd Do MMMM YYYY')}
          </p>
        </div>
      </div>

      {dashboardData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-2">Total Tasks</h3>
              <p>{dashboardData.allTasksCount || 0}</p>
            </div>
            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-2">Completed Tasks</h3>
              <p>{dashboardData.completedTasksCount || 0}</p>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="card p-4 mb-5">
            <h3 className="text-lg font-semibold mb-4">Task Status Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="card p-4 mb-5">
            <h3 className="text-lg font-semibold mb-4">Users Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
