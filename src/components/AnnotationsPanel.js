import React from 'react';

const AnnotationsPanel = ({ annotations, currentUser, onAnnotationClick, onAnnotationEdit }) => {
  return (
    <div className="border-t border-gray-700 pt-6">
      <h3 className="text-xl font-semibold mb-4 text-blue-400">Annotations</h3>
      <div className="space-y-2">
        {Object.entries(annotations).length === 0 ? (
          <div className="p-3 bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-300 font-medium mb-2">
              No annotations yet. Select text and use the Annotate option to add notes.
            </div>
          </div>
        ) : (
          Object.entries(annotations).map(([id, annotationData]) => {
            // Handle both old string format and new object format
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
              <div 
                key={id}
                className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg group hover:bg-gray-600 transition-colors duration-200"
              >
                {/* User Avatar */}
                <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 text-sm font-medium">
                    {data.user.avatar}
                  </span>
                </div>

                {/* Content */}
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onAnnotationClick(id)}
                >
                  <p className="text-sm text-gray-300">{data.text}</p>
                  <span className="block text-[10px] text-gray-400 mt-1.5">
                    {formattedDate}
                  </span>
                </div>

                {/* Edit Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAnnotationEdit(id, data.text);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs text-blue-400 hover:text-blue-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AnnotationsPanel;