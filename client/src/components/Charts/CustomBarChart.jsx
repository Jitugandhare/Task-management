import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const CustomBarChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const priorityColorMap = {
    Low: '#00BC7D',
    Medium: '#FE9900',
    High: '#FF1F57',
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300 text-purple-800 mb-1">
          <p className="text-xs font-semibold">{payload[0].payload.priority}</p>
          <p className="text-sm text-gray-600">
            Count: <span className="font-medium text-gray-900">{payload[0].payload.count}</span>
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
          <XAxis dataKey="priority" tick={{ fontSize: 12 }} stroke="none" />
          <YAxis tick={{ fontSize: 12 }} stroke="none" allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Bar
            dataKey="count"
            radius={[10, 10, 0, 0]}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={activeIndex === index ? '#22C55E' : priorityColorMap[entry.priority] || '#00BC7D'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
