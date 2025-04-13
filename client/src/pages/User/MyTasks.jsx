import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import TaskStatusTab from '../../components/layouts/TaskStatusTab';
import TaskCard from '../../components/Cards/TaskCard';
import toast from 'react-hot-toast';

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const navigate = useNavigate();

  const getAllTasks = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === 'All' ? '' : filterStatus,
        },
      });

      const tasks = data?.tasks || [];
      const statusSummary = data?.statusSummary || {};

      setAllTasks(tasks);

      const statusArray = [
        { label: 'All', count: statusSummary.all || 0 },
        { label: 'Pending', count: statusSummary.pendingTasks || 0 },
        { label: 'In Progress', count: statusSummary.inProgressTasks || 0 },
        { label: 'Completed', count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks.');
    }
  }, [filterStatus]);

  useEffect(() => {
    getAllTasks();
  }, [getAllTasks]);

  const handleClick = (taskId) => {
    if (taskId) navigate(`/user/task-details/${taskId}`);
  };

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="text-xl font-medium">My Tasks</h2>

          {tabs.length > 0 && (
            <TaskStatusTab
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks.length > 0 ? (
            allTasks.map((task) => (
              <TaskCard
                key={task._id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                status={task.status}
                progress={task.progress}
                createdAt={task.createdAt}
                dueDate={task.dueDate}
                assignedTo={task.assignedTo?.map((a) => a?.profileImageUrl) || []}
                attachmentCount={task.attachments?.length || 0}
                completedTodoCount={task.completedTodoCount || 0}
                todoChecklist={task.todoChecklist || []}
                onClick={() => handleClick(task._id)}
              />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center mt-10">
              No tasks found.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
