import React from 'react';

const ArticleSidePanel = ({ isOpen, onClose, tableOfContents, onItemClick }) => {
  const renderTocItem = (item, depth = 0) => {
    return (
      <div key={item.id} className={`mb-2 ${depth > 0 ? 'ml-4' : ''}`}>
        <button
          onClick={() => onItemClick(item.id)}
          className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors
                     ${depth === 0 ? 'text-sm font-medium text-blue-400' : 'text-sm text-gray-300'}`}
        >
          {item.title}
        </button>
        {item.children && (
          <div className="mt-1">
            {item.children.map(child => renderTocItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Backdrop - shown when drawer is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Side Panel */}
      <div
        className={`fixed left-0 top-0 h-full w-72 bg-gray-900 border-r border-gray-700 
                   shadow-xl z-50 transform transition-transform duration-300 ease-in-out
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-blue-400">Table of Contents</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Table of Contents */}
        <div className="h-full overflow-y-auto p-4">
          <div className="space-y-1">
            {tableOfContents.map(item => renderTocItem(item))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleSidePanel;