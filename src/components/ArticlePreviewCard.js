import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const ArticlePreviewCard = ({ article, onClick }) => {
  return (
    <div 
      onClick={() => onClick?.(article)}
      className="group bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
    >
      <div className="p-4">
        {/* Category & Reading Time */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-blue-400 font-medium">{article.category || article.type}</span>
          {article.readingTime && (
            <span className="text-xs text-gray-400">{article.readingTime} min read</span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>
        
        {/* Summary */}
        {article.summary && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
            {article.summary}
          </p>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{article.date}</span>
            {article.authors && article.authors.length > 0 && (
              <>
                <span className="text-gray-500">•</span>
                <span className="text-xs text-gray-500">{article.authors[0]}</span>
              </>
            )}
          </div>
          <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default ArticlePreviewCard;