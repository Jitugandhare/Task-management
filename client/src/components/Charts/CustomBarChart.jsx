import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const CustomBarChart = ({ data }) => {
  // Use a color map for priority levels to make it more scalable
  const priorityColorMap = {
    Low: '#00BC7D',
    Medium: '#FE9900',
    High: '#FF1F57',
  };

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
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />
          <XAxis
            dataKey="priority"
            tick={{ fontSize: 12, fill: '#555' }}
            stroke="none"
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#555' }}
            stroke="none"
          />
          <Tooltip content={CustomTooltip} cursor={{ fill: "transparent" }} />
          <Bar
            dataKey="count"
            fill="#FF8042"
            radius={[10, 10, 0, 0]}
            activeDot={{ r: 8, fill: "yellow" }}
            activeStyle={{ fill: "green" }}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={priorityColorMap[entry.priority] || '#00BC7D'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
