import React from 'react';
import { ArrowRight } from 'lucide-react';
import ArticlePreviewCard from './ArticlePreviewCard';

const RelatedArticlesPanel = ({ articles = [], onArticleClick }) => {
  return (
    <div className="border-t border-gray-700 mt-12 pt-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Related Articles</h2>
        <p className="text-gray-400 text-sm">Continue exploring market insights</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <ArticlePreviewCard
            key={article.id}
            article={article}
            onClick={() => onArticleClick(article)}
          />
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