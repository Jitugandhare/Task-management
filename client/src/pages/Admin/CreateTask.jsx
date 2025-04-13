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

  // Reset form
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

  // Create task
  const createTask = async () => {
    setLoading(true);

    try {
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });
      toast.success("Task Created Successfully");
      clearData();
      navigate('/tasks'); // Navigate to task list after creation
    } catch (error) {
      setLoading(false);
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

      const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Task Updated Successfully");
    } catch (error) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    // Input validation
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
    if (taskId) {
      updateTask();
    } else {
      createTask();
    }
  };

  const getTaskDetailsById = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      if (response.data) {
        setCurrentTask(response.data);

        setTaskData((prevState) => ({
          title: response.data.title,
          description: response.data.description,
          priority: response.data.priority,
          dueDate: response.data.dueDate ? moment(response.data.dueDate).format('YYYY-MM-DD') : null,
          assignedTo: response.data?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist: response.data?.todoChecklist?.map((item) => item.text) || [],
          attachments: response.data?.attachments || [],
        }));
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
      setOpenDeleteAlert(false)
      toast.success("Task deleted successfully");
      navigate('/admin/tasks');
    } catch (error) {
      setLoading(false);
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
    return () => { };
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className='mt-5'>
        <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
          <div className='form-card col-span-3'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl md:text-xl font-medium'>
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border-rose-100 hover:border-rose-300 cursor-pointer'
                  onClick={() => setOpenDeleteAlert(true)}
                  disabled={loading}
                >
                  <LuTrash2 className='text-base' />
                  {loading ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
            {openDeleteAlert && (
              <div className="delete-confirmation-modal">
                <p>Are you sure you want to delete this task?</p>
                <button onClick={deleteTask} disabled={loading}>Yes, Delete</button>
                <button onClick={() => setOpenDeleteAlert(false)} disabled={loading}>Cancel</button>
              </div>
            )}

            <div className='mt-4'>
              <label className='text-xs font-medium text-slate-600'>Task Title</label>
              <input
                placeholder='Create App UI'
                className='form-input '
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className='mt-3'>
              <label className="text-sm font-medium text-slate-600">Description</label>
              <textarea
                placeholder='Describe task'
                className='form-input'
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange('description', target.value)
                }
              />
            </div>

            <div className='grid grid-rows-12 gap-4 mt-2'>
              <div className='col-span-6 md:col-span-4'>
                <label className="text-xs font-medium text-slate-600">Priority</label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange('priority', value)}
                  placeholder="Select Priority"
                />
              </div>

              <div className='col-span-6 md:col-span-4'>
                <label className='text-xs font-medium text-slate-600'>Due Date</label>
                <input
                  placeholder='Create App UI'
                  className='form-input'
                  value={taskData.dueDate}
                  onChange={({ target }) => handleValueChange("dueDate", target.value)}
                  type='date'
                />
              </div>

              <div className='col-span-6 md:col-span-3'>
                <label className='text-xs font-medium text-slate-600'>Assign To</label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => handleValueChange('assignedTo', value)}
                />
              </div>
            </div>

            <div className='mt-3'>
              <label className='text-xs font-medium text-slate-600'>TODO Checklist</label>
              <TodoListInput
                todoList={taskData?.todoChecklist}
                setTodoList={(value) =>
                  handleValueChange("todoChecklist", value)
                }
              />
            </div>

            <div className='mt-3'>
              <label className="text-xs font-medium text-slate-600">Add Attachments</label>
              <AddAttachmentsInput
                attachments={taskData?.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>

            {error && (
              <p className='text-xs font-medium text-red-500 mt-5'>{error}</p>
            )}

            <div className='flex justify-end mt-7'>
              <button
                className='add-btn'
                onClick={handleSubmit}
                disabled={loading}>
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
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
          onDelete={() => deleteTask()}
        />
      </Modal>

    </DashboardLayout>
  );
};

export default CreateTask;
