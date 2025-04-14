import React, { useState, useEffect } from 'react';
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from '../../utils/apiPaths';
import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { useLocation, useNavigate } from 'react-router-dom';
import { LuTrash2 } from 'react-icons/lu';
import moment from 'moment';
import toast from 'react-hot-toast';
import SelectDropdown from '../../customcomponent/SelectDropdown';
import SelectUsers from '../../customcomponent/SelectUsers';
import TodoListInput from '../../customcomponent/TodoListInput';
import AddAttachmentsInput from '../../customcomponent/AddAttachmentsInput';
import Modal from '../../components/layouts/Modal';
import DeleteAlert from '../../customcomponent/DeleteAlert';

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Task Created Successfully");
      clearData();
      navigate('/admin/tasks');
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist?.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist || [];
        const matchedTask = prevTodoChecklist.find((task) => task.text === item);
        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Task Updated Successfully");
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);

    if (!taskData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!taskData.dueDate?.trim()) {
      setError("Due Date is required.");
      return;
    }
    if (taskData.assignedTo?.length === 0) {
      setError("Task is not assigned to any member.");
      return;
    }
    if (taskData.todoChecklist?.length === 0) {
      setError("Add at least one todo task.");
      return;
    }

    taskId ? updateTask() : createTask();
  };

  const getTaskDetailsById = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      if (response.data) {
        setCurrentTask(response.data);
        setTaskData({
          title: response.data.title,
          description: response.data.description,
          priority: response.data.priority,
          dueDate: response.data.dueDate ? moment(response.data.dueDate).format('YYYY-MM-DD') : null,
          assignedTo: response.data?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist: response.data?.todoChecklist?.map((item) => item.text) || [],
          attachments: response.data?.attachments || [],
        });
      }
    } catch (error) {
      setError("Error fetching task details.");
      console.error("Error fetching task:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      setOpenDeleteAlert(false);
      toast.success("Task deleted successfully");
      navigate('/admin/tasks');
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsById(taskId);
    }
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-8 max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {taskId ? "Update Task" : "Create Task"}
          </h2>
          {taskId && (
            <button
              className="flex items-center gap-1 text-sm font-medium text-red-600 border border-red-100 bg-red-50 px-3 py-1.5 rounded-md hover:bg-red-100 hover:border-red-300 transition-all disabled:opacity-50"
              onClick={() => setOpenDeleteAlert(true)}
              disabled={loading}
            >
              <LuTrash2 className="text-base" />
              {loading ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Task Title</label>
            <input
              className="form-input w-full mt-1 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Create App UI"
              value={taskData.title}
              onChange={({ target }) => handleValueChange("title", target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="form-input w-full mt-1 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Describe task"
              value={taskData.description}
              onChange={({ target }) => handleValueChange("description", target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Priority</label>
              <SelectDropdown
                options={PRIORITY_DATA}
                value={taskData.priority}
                onChange={(value) => handleValueChange("priority", value)}
                placeholder="Select Priority"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                className="form-input w-full mt-1 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                value={taskData.dueDate}
                onChange={({ target }) => handleValueChange("dueDate", target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Assign To</label>
              <SelectUsers
                selectedUsers={taskData.assignedTo}
                setSelectedUsers={(value) => handleValueChange("assignedTo", value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">TODO Checklist</label>
            <TodoListInput
              todoList={taskData.todoChecklist}
              setTodoList={(value) => handleValueChange("todoChecklist", value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Add Attachments</label>
            <AddAttachmentsInput
              attachments={taskData.attachments}
              setAttachments={(value) => handleValueChange("attachments", value)}
            />
          </div>

          {error && <p className="text-sm text-red-600 font-medium mt-2">{error}</p>}

          <div className="flex justify-end pt-4">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading}
            >
              {taskId ? "UPDATE TASK" : "CREATE TASK"}
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={deleteTask}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
