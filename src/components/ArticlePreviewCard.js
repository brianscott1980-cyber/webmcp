import React from 'react';

const ArticlePreviewCard = ({ article, onClick }) => {
  return (
    <div 
      onClick={() => onClick?.(article)}
      className="group bg-gray-700/30 hover:bg-gray-700/50 p-3 rounded-lg cursor-pointer transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="text-sm text-gray-200 group-hover:text-blue-400 font-medium line-clamp-2 transition-colors duration-200">
            {article.title}
          </h4>
          {article.date && (
            <div className="text-xs text-gray-400 mt-1">
              {article.date}
            </div>
          )}
          {article.authors && article.authors.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(article.authors[0])}&background=random&color=fff&size=24`}
                alt={article.authors[0]}
                className="w-5 h-5 rounded-full"
              />
              <span className="text-xs text-gray-400">
                {article.authors[0]}
              </span>
            </div>
          )}
        </div>
        {article.type && (
          <span className="text-[11px] px-2 py-0.5 bg-gray-600 text-gray-300 rounded-full whitespace-nowrap">
            {article.type}
          </span>
        )}
      </div>
    </div>
  );
};

export default ArticlePreviewCard;