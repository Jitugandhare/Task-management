import React, { useContext, useEffect, useState } from 'react';
import useUserAuth from '../../hooks/useUserAuth';
import { UserContext } from '../../context/userContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';
import InfoCard from '../../components/Cards/InfoCard';
import { addThousandsSeparator } from '../../utils/helper';
import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../components/TaskListTable';
import CustomPieChart from '../../components/Charts/CustomPieChart';
import CustomBarChart from '../../components/Charts/CustomBarChart';

const COLORS = ['#8D51FF', '#00B8DB', '#7BCE00'];

const UserDashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // Prepare chart data from API response
  const prepareChartData = (charts = {}) => {
    const taskDistribution = charts.taskDistribution || {};
    const taskPriorityLevels = charts.taskPriorityLevels || {};

    setPieChartData([
      { status: 'Pending', count: taskDistribution.Pending || 0 },
      { status: 'In Progress', count: taskDistribution.InProgress || 0 },
      { status: 'Completed', count: taskDistribution.Completed || 0 },
    ]);

    setBarChartData([
      { priority: 'Low', count: taskPriorityLevels.Low || 0 },
      { priority: 'Medium', count: taskPriorityLevels.Medium || 0 },
      { priority: 'High', count: taskPriorityLevels.High || 0 },
    ]);
  };

 const getDashboardData = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA);
    console.log('API Response:', response);  // <-- Add this
    const data = response.data.data; // usually axios response has { data: { ... } }
    if (data) {
      setDashboardData(data);
      prepareChartData(data.charts ?? {});
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};


  useEffect(() => {
    getDashboardData();
  }, []);

  const onSeeMore = () => {
    navigate('/user/tasks');
  };

  const taskDistribution = dashboardData?.charts?.taskDistribution || {};

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div className="col-span-3">
          <h2 className="text-xl md:text-2xl">
            Good Morning! {user?.name}
          </h2>
          <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
            {moment().format('dddd Do MM YYYY')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 md:gap-6 mt-5">
          <InfoCard
            label="Total Tasks"
            value={addThousandsSeparator(taskDistribution.All || 0)}
            color="bg-blue-800"
          />
          <InfoCard
            label="Pending Tasks"
            value={addThousandsSeparator(taskDistribution.Pending || 0)}
            color="bg-violet-500"
          />
          <InfoCard
            label="In Progress Tasks"
            value={addThousandsSeparator(taskDistribution.InProgress || 0)}
            color="bg-cyan-800"
          />
          <InfoCard
            label="Completed Tasks"
            value={addThousandsSeparator(taskDistribution.Completed || 0)}
            color="bg-lime-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        {/* Pie Chart */}
        <div className="card">
          <div className="flex items-center justify-between">
            <h5 className="font-medium">Task Distribution</h5>
          </div>
          <CustomPieChart data={pieChartData} colors={COLORS} />
        </div>

        {/* Bar Chart */}
        <div className="card">
          <div className="flex items-center justify-between">
            <h5 className="font-medium">Task Priority Level</h5>
          </div>
          <CustomBarChart data={barChartData} />
        </div>

        {/* Recent Tasks */}
        <div className="md:col-span-2 card">
          <div className="flex items-center justify-between">
            <h5 className="text-lg">Recent Tasks</h5>
            <button className="card-btn" onClick={onSeeMore}>
              See All <LuArrowRight className="text-base" />
            </button>
          </div>

          <TaskListTable tableData={dashboardData?.recentTasks || []} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
