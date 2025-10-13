import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const RelatedArticlesPanel = ({ articles = [], onArticleClick }) => {
  return (
    <div className="border-t border-gray-700 mt-12 pt-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Related Articles</h2>
        <p className="text-gray-400 text-sm">Continue exploring market insights</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article, index) => (
          <div
            key={article.id}
            className="group bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
            onClick={() => onArticleClick(article)}
          >
            {/* Article Preview Card */}
            <div className="p-4">
              {/* Category & Reading Time */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-blue-400 font-medium">{article.category}</span>
                <span className="text-xs text-gray-400">{article.readingTime} min read</span>
              </div>
              
              {/* Title */}
              <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                {article.title}
              </h3>
              
              {/* Summary */}
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {article.summary}
              </p>
              
              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{article.date}</span>
                <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* View All Links */}
      <div className="mt-6 flex justify-center space-x-8">
        <button 
          className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
          onClick={() => onArticleClick('viewOpenAI')}
        >
          <span>View all OpenAI Research</span>
          <ArrowRight className="h-4 w-4" />
        </button>
        <button 
          className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
          onClick={() => onArticleClick('viewAuthor')}
        >
          <span>View all Author Research</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default RelatedArticlesPanel;