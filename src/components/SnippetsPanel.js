import React from 'react';

const SnippetsPanel = ({ snippets, currentUser, onSnippetClick }) => {
  return (
    <div className="border-t border-gray-700 pt-6">
  <h3 className="text-xl font-semibold mb-4 text-blue-400">My Snippets</h3>
      <div className="space-y-2">
        {snippets.length === 0 ? (
          <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
            <div className="text-sm text-gray-300 font-medium">
              No snippets saved yet. Select text from the article and use the Save Snippet option to create snippets.
            </div>
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
              <div 
                key={snippet.id} 
                className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg group hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                onClick={() => onSnippetClick(snippet)}
              >
                {/* User Avatar */}
                <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 text-sm font-medium">
                    {snippet.user?.avatar || 'U'}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{snippet.text}</p>
                  <span className="block text-[10px] text-gray-400 mt-1.5">
                    {formattedDate}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SnippetsPanel;