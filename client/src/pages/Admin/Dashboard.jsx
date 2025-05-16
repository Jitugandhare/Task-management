import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { UserContext } from '../../context/userContext';
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';
import HashLoader from 'react-spinners/HashLoader'; 

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
        setDashboardData(response.data);
        setPieChartData(response.data.pieChartData || []);
        setBarChartData(response.data.barChartData || []);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4">
            <h3 className="text-lg font-semibold mb-2">Total Tasks</h3>
            <p>{dashboardData.totalTasks || 0}</p>
          </div>
          <div className="card p-4">
            <h3 className="text-lg font-semibold mb-2">Completed Tasks</h3>
            <p>{dashboardData.completedTasks || 0}</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
