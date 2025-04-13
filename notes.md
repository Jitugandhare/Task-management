import React, { useState, useEffect } from 'react';
import DashboardLayout from "../../components/layouts/DashboardLayout"
import { API_PATHS } from '../../utils/apiPaths';
import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { useLocation, useNavigate } from 'react-router-dom';
import { LuTrash2 } from 'react-icons/lu';
import moment from 'moment';
import toast from 'react-hot-toast'
import SelectDropdown from '../../customcomponent/SelectDropdown'
import SelectUsers from '../../customcomponent/SelectUsers';
import TodoListInput from '../../customcomponent/TodoListInput';
import AddAttachmentsInput from '../../customcomponent/AddAttachmentsInput';

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

  // reset form
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
        const matchedTask = prevTodoChecklist.find((task) => task.text == item);

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

      toast.success("Task Updated Successfully")

    } catch (error) {
      setLoading(false);
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
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format('YYYY-MM-DD') : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist: taskInfo?.todoChecklist?.map((item) => item.text) || [],
          attachments: taskInfo?.attachments || [],
        }));



      }


    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    
  };


  useEffect(() => {
    if (taskId) {
      getTaskDetailsById(taskId)
    }

    return () => { }
  }, [taskId])

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className='mt-5 '>
        <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
          <div className='form-card col-span-3'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl md:text-xl font-medium'>
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border-rose-100 hover:border-rose-300 cursor-pointer'
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className='text-base' />
                  Delete
                </button>
              )}
            </div>
            <div className='mt-4'>
              <label className='text-xs font-medium text-slate-600'>
                Task Title
              </label>
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
              <label className="text-sm font-medium text-slate-600">
                Description
              </label>

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
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>
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
                <label className='text-xs font-medium text-slate-600'>
                  Assign To
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => handleValueChange('assignedTo', value)}
                />
              </div>
            </div>

            <div className='mt-3'>
              <label className='text-xs font-medium text-slate-600'>
                TODO Checklist
              </label>
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
              <p className='text-xs font-medium text-red-500 mt-5'>{error} </p>
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
    </DashboardLayout>
  );
};

export default CreateTask;
