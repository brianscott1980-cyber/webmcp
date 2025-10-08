import React from 'react';

const SelectionPopup = ({ text, x, y, onSearch, onSave, onRelated, onClose }) => {
  return (
    <div 
      className="fixed z-50 transform -translate-x-1/2 bg-gray-800 rounded-xl shadow-2xl border-2 border-blue-500/50 p-3 backdrop-blur-sm bg-opacity-95"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <div className="mb-2 px-1">
        <div className="text-sm text-gray-300 font-medium truncate max-w-[200px]">
          "{text}"
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onSearch}
          className="flex items-center space-x-1 text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-500/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Search</span>
        </button>
        <button
          onClick={onSave}
          className="flex items-center space-x-1 text-sm px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all duration-200 shadow-lg hover:shadow-green-500/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span>Save</span>
        </button>
        <button
          onClick={onRelated}
          className="flex items-center space-x-1 text-sm px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all duration-200 shadow-lg hover:shadow-purple-500/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Related</span>
        </button>
        <button
          onClick={onClose}
          className="flex items-center text-sm p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="absolute w-4 h-4 bg-gray-800 rotate-45 left-1/2 -bottom-2 -translate-x-1/2 border-b-2 border-r-2 border-blue-500/50"></div>
    </div>
  );
};

export default SelectionPopup;