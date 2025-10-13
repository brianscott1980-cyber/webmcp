import React from 'react';

const ArticleSidePanel = ({ 
  isOpen, 
  onClose, 
  tableOfContents, 
  onItemClick, 
  snippets, 
  onSnippetClick,
  annotations,
  currentUser,
  onAnnotationClick
}) => {
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

        {/* Content Container */}
        <div className="h-full overflow-y-auto">
          {/* Table of Contents Section */}
          <div className="p-4">
            <div className="space-y-1">
              {tableOfContents.map(item => renderTocItem(item))}
            </div>
          </div>

          {/* Annotations Section */}
          <div className="mt-2 border-t border-gray-700">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Annotations</h3>
              <div className="space-y-2">
                {Object.entries(annotations).length === 0 ? (
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-400">
                      No annotations yet. Select text and use the Annotate option to add notes.
                    </p>
                  </div>
                ) : (
                  Object.entries(annotations).map(([id, annotationData]) => {
                    const data = typeof annotationData === 'string'
                      ? { text: annotationData, user: currentUser, timestamp: new Date().toISOString() }
                      : annotationData;

                    const formattedDate = new Date(data.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <button
                        key={id}
                        onClick={() => onAnnotationClick(id)}
                        className="w-full text-left p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 
                                 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start gap-2">
                          <div className="shrink-0 w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
                            <span className="text-blue-400 text-xs font-medium">
                              {data.user.avatar}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-300 line-clamp-2 group-hover:text-blue-400 transition-colors">
                              {data.text}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">{formattedDate}</span>
                              <span className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-400">
                                {data.user.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Snippets Section */}
          <div className="mt-2 border-t border-gray-700">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Saved Snippets</h3>
              <div className="space-y-2">
                {snippets.length === 0 ? (
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-400">
                      No snippets saved yet. Select text from the article and use the Save Snippet option to create snippets.
                    </p>
                  </div>
                ) : (
                  snippets.map(snippet => {
                    const formattedDate = new Date(snippet.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <button
                        key={snippet.id}
                        onClick={() => onSnippetClick(snippet)}
                        className="w-full text-left p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 
                                 transition-colors group cursor-pointer"
                      >
                        <div className="text-sm text-gray-300 line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {snippet.text}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{formattedDate}</span>
                          <span className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-400">
                            {snippet.user?.name || 'Unknown'}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleSidePanel;