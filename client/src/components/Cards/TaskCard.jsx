import React from 'react';
import moment from 'moment';
import Progress from '../layouts/Progress';
import AvatarGroup from '../layouts/AvatarGroup';
import { LuPaperclip } from 'react-icons/lu';

const TaskCard = ({
    title, description, priority,
    status, progress, createdAt,
    dueDate, assignedTo, attachmentCount,
    completedTodoCount, todoChecklist, onClick
}) => {

    const getStatusTagColor = (status) => {
        switch (status) {
            case "In Progress":
                return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
            case "Completed":
                return "text-lime-500 bg-lime-50 border border-lime-500/20";
            default:
                return "text-violet-500 bg-violet-50 border border-violet-500/10";
        }
    };

    const getPriorityTagColor = (priority) => {
        switch (priority) {
            case "Low":
                return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";
            case "Medium":
                return "text-amber-500 bg-amber-50 border border-amber-500/10";
            default:
                return "text-rose-500 bg-rose-50 border border-rose-500/10";
        }
    };

    const formattedStartDate = createdAt ? moment(createdAt).format("Do MMM YYYY") : 'N/A';
    const formattedDueDate = dueDate ? moment(dueDate).format("Do MMM YYYY") : 'N/A';
    const totalTodoChecklistLength = todoChecklist?.length || 0;

    return (
        <div 
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-4"
            onClick={onClick}
        >
            <div className="flex justify-between p-4">
                <div className="flex space-x-2">
                    <div className={`text-[11px] font-medium ${getStatusTagColor(status)} px-4 py-0.5 rounded`}>
                        {status}
                    </div>
                    <div className={`text-[11px] font-medium ${getPriorityTagColor(priority)} px-4 py-0.5 rounded`}>
                        {priority} Priority
                    </div>
                </div>
            </div>

            <div className={`px-4 py-3 border-l-4 ${status === "In Progress"
                ? 'border-cyan-500'
                : status === 'Completed'
                    ? 'border-lime-500'
                    : 'border-violet-500'
                }`}>
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-600 mt-2">{description}</p>
                <p className="text-sm text-gray-600 mt-2">
                    Task Done {' '}
                    <span className="font-bold">{completedTodoCount}/{totalTodoChecklistLength}</span>
                </p>
                <Progress progress={progress} status={status} />
            </div>

            <div className="flex justify-between p-4 bg-gray-50">
                <div className="space-y-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-500">Start date</label>
                        <p className="text-sm font-semibold text-gray-700">{formattedStartDate}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500">Due date</label>
                        <p className="text-sm font-semibold text-gray-700">{formattedDueDate}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <AvatarGroup avatars={assignedTo || []} />
                    {attachmentCount > 0 && (
                        <div className="flex items-center space-x-1">
                            <LuPaperclip className="text-gray-600" />
                            <span className="text-sm text-gray-700">{attachmentCount}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
