import React, { useContext, useEffect, useState } from 'react'
import useUserAuth from '../../hooks/useUserAuth'
import { UserContext } from '../../context/userContext'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import moment from 'moment'
import InfoCard from '../../components/Cards/InfoCard'
import { addThousandsSeparator } from '../../utils/helper'
import { LuArrowRight } from 'react-icons/lu'
import TaskListTable from '../../components/TaskListTable'
import CustomPieChart from '../../components/Charts/CustomPieChart'
import CustomBarChart from '../../components/Charts/CustomBarChart'

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // Prepare Chart Data
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {};
    const taskPriorityLevels = data?.taskPriorityLevels || {};

    // Task Distribution Data for Pie Chart
    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 }
    ];

    setPieChartData(taskDistributionData);

    // Task Priority Level Data for Bar Chart
    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 }
    ];

    setBarChartData(priorityLevelData);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);

      if (response.data) {
        console.log("Dashboard Data:", response.data);
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || {});
      }
    } catch (error) {
      console.error('Error fetching dashboard data: ', error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const onSeeMore = () => {
    navigate('/admin/tasks');
  };

  const taskDistribution = dashboardData?.charts?.taskDistribution || {};

  useEffect(() => {
    console.log("Task Distribution Data:", taskDistribution);
  }, [taskDistribution]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">Good Morning! {user?.name}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("dddd Do MM YYYY")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 md:gap-6 mt-5">
          <InfoCard
            label="Total Tasks"
            value={addThousandsSeparator(taskDistribution?.All || 0)}
            color="bg-blue-800"
          />
          <InfoCard
            label="Pending Tasks"
            value={addThousandsSeparator(taskDistribution?.Pending || 0)}
            color="bg-violet-500"
          />
          <InfoCard
            label="In Progress Tasks"
            value={addThousandsSeparator(taskDistribution?.InProgress || 0)}
            color="bg-cyan-800"
          />
          <InfoCard
            label="Completed Tasks"
            value={addThousandsSeparator(taskDistribution?.Completed || 0)}
            color="bg-lime-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">

        {/* custom pie chart */}
        <div>
          <div className='card'>
            <div className='flex items-center justify-between'>
              <h5 className='font-medium'>Task Distribution</h5>
            </div>
            <CustomPieChart data={pieChartData} colors={COLORS} />
          </div>
        </div>

        {/* customBarChart */}
        <div>
          <div className='card'>
            <div className='flex items-center justify-between'>
              <h5 className='font-medium'>Task Priority Level</h5>
            </div>
            <CustomBarChart data={barChartData} />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>
              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
import React from 'react'
import {
    BarChart, Bar, XAxis, YAxis
    , CartesianGrid, Tooltip,
    Legend, ResponsiveContainer
} from 'recharts';


const CustomBarChart = ({ data }) => {


    const getBarColor = (entry) => {
        switch (entry?.priority) {
            case 'Low':
                return '#00BC7D';
            case 'Medium':
                return '#FE9900';
            case 'High':
                return '#FF1F57';
            default:
                return '#00BC7D';
        }
    };

    // Custom Tooltip Component
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300 text-purple-800 mb-1">
                    <p className="text-xs font-semibold text-purple-800 mb-1">{payload[0].payload.priority}</p>
                    <p className="text-sm text-gray-600">
                        Count: <span className="text-sm font-medium text-gray-900">{payload[0].payload.count}</span>
                    </p>
                </div>
            );
        }
        return null;
    };




    return (


        <div className='bg-white mt-6'>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid stroke='none' />
                    <XAxis
                        dataKey='priority'
                        tick={{ fontSize: 12, fill: '#555' }}
                        stroke='none'
                    />
                    <YAxis
                        dataKey='priority'
                        tick={{ fontSize: 12, fill: '#555' }}
                        stroke='none'
                    />
                    <Tooltip content={CustomTooltip} cursor={{ fill: "transparent" }} />

                    <Bar
                        dataKey="count"
                        nameKey="priority"
                        fill="#FF8042"
                        radius={[10, 10, 0, 0]}
                        activeDot={{ r: 8, fill: "yellow" }}
                        activeStyle={{ fill: "green" }}



                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={getBarColor(entry)}
                            />
                        ))}

                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CustomBarChart
import React from 'react'

const CustomTooltip = ({ active, payload }) => {
    if (active && payload.length) {
        return (
            <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300 '>
                <p className='text-xs font-semibold text-purple-800 mb-1'>{payload[0].name}</p>
                <p className='text-sm text-gray-600'>
                    Count: <span className='text-sm font-medium text-gray-900'>
                        {payload[0].value}
                    </span>
                </p>
            </div>
        )
    }
    return null;

}

export default CustomTooltip
import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

const CustomPieChart = ({ data, colors }) => {
    if (!data || data.length === 0) return <div>No data available</div>; // Handle empty data

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    innerRadius={100}
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default CustomPieChart;
import React from 'react'

const CustomLegend = ({ payload }) => {
    return (
        <div className='flex flex-wrap justify-center gap-2 mt-4 space-x-6'>

            {payload.map((entry, index) => (
                <div key={`legend-${index}`} className='flex items-center space-x-2'>
                    <div className='w-2.5 h-2.5 rounded-full'
                        style={{ backgroundColor: entry.color }}
                    >

                    </div>
                    <span className='text-xs text-gray-700 font-medium'>
                        {entry.value}
                    </span>

                </div>

            ))}
        </div>
    )
}

export default CustomLegend
import React, { useContext, useEffect } from 'react'
import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom';

const useUserAuth = () => {
    const { user, loading, clearUser } = useContext(UserContext);
    const navigate = useNavigate();


    useEffect(() => {
        if (loading) return;
        if (user) return;

        if (!user) {
            clearUser();
            navigate('/login')
        }
    }, [user, loading, clearUser, navigate])
}

export default useUserAuth
import React from 'react'
import moment from 'moment';

const TaskListTable = ({ tableData = [] }) => {
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "Completed":
                return 'bg-green-100 text-green-500 border border-green-200';
            case "Pending":
                return 'bg-purple-100 text-purple-500 border border-purple-200';
            case "In Progress":
                return 'bg-cyan-100 text-cyan-500 border border-cyan-200';
            default:
                return 'bg-gray-100 text-gray-500 border border-gray-200';
        }
    };

    const getPriorityBadgeColor = (priority) => {
        switch (priority) {
            case "High":
                return 'bg-red-100 text-red-500 border border-red-200';
            case "Medium":
                return 'bg-orange-100 text-orange-500 border border-orange-200';
            case "Low":
                return 'bg-green-100 text-green-500 border border-green-200';
            default:
                return 'bg-gray-100 text-gray-500 border border-gray-200';
        }
    };

    return (
        <div className='overflow-x-auto p-0 rounded-lg mt-3'>
            <table className='min-w-full'>
                <thead>
                    <tr className='text-left'>
                        <th className='py-3 px-4 text-gray-800 text-[15px]'>Name</th>
                        <th className='py-3 px-4 text-gray-800 text-[15px]'>Status</th>
                        <th className='py-3 px-4 text-gray-800 text-[15px]'>Priority</th>
                        <th className='py-3 px-4 text-gray-800 text-[15px] hidden md:table-cell'>Created On</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((task) => (
                        <tr key={task._id} className='border-t border-gray-200'>
                            <td className='my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden'>{task.title}</td>
                            <td className='py-4 px-4'>
                                <span className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColor(task.status)}`}>
                                    {task.status}
                                </span>
                            </td>
                            <td className='py-4 px-4'>
                                <span className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                            </td>
                            <td className='py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell'>
                                {task.createdAt ? moment(task.createdAt).format('Do MMM YYYY') : 'NA'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskListTable;
