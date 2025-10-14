import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const CompanyPerformanceChart = ({ company }) => {
  const { rating, targetPrice } = company;

  // Generate mock performance data
  const performanceData = Array.from({ length: 10 }).map((_, i) => ({
    name: i,
    value: Math.random() * 100
  }));

  // Determine chart color based on rating
  const getChartColor = (rating) => {
    switch (rating) {
      case "Overweight":
        return "#22c55e";
      case "Underweight":
        return "#ef4444";
      default:
        return "#3b82f6";
    }
  };

  return (
    <div className="p-2 bg-gray-700/50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-gray-200">Rating: {rating}</div>
        <div className="text-xs text-gray-200">Target: {targetPrice}</div>
      </div>
      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={getChartColor(rating)}
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CompanyPerformanceChart;
