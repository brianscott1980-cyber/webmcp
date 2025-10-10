import React from 'react';

const IndicesPanel = ({ indices }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {indices.map((index) => (
        <div key={index.name} className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400 flex items-center">
              <span className="mr-2 text-lg">{index.flag}</span>
              {index.name}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${index.color === 'green' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {index.change > 0 ? '+' : ''}{index.change}%
            </span>
          </div>
          <div className="text-2xl font-bold">{index.value.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};

export default IndicesPanel;