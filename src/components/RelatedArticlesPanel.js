import React from 'react';
import { ArrowRight } from 'lucide-react';
import ArticlePreviewCard from './ArticlePreviewCard';

const RelatedArticlesPanel = ({ articles = [], onArticleClick, currentUser }) => {
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
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {/* OpenAI Research */}
        <div className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-800/70 transition-colors group cursor-pointer"
             onClick={() => onArticleClick('viewOpenAI')}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                View all OpenAI Research
              </h3>
              <p className="text-sm text-gray-400 mb-3 leading-relaxed">
                Explore our comprehensive collection of OpenAI market analysis, research papers, 
                and technical insights. Updated daily with the latest developments.
              </p>
              <div className="text-xs text-gray-500">
                247 articles • Updated 2 hours ago
              </div>
            </div>
            <ArrowRight className="h-8 w-8 text-gray-500 group-hover:text-blue-400 transition-colors" />
          </div>
        </div>

        {/* Author Research */}
        <div className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-800/70 transition-colors group cursor-pointer"
             onClick={() => onArticleClick('viewAuthor')}>
          <div className="flex items-start justify-between">
            <div>
                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                View all by Brenda Duverce
              </h3>
              <p className="text-sm text-gray-400 mb-3 leading-relaxed">
                Lead AI & Technology Analyst specializing in OpenAI, AGI developments, and emerging AI markets. 
                Regular coverage of AI infrastructure, market dynamics, and competitive analysis.
              </p>
              <div className="text-xs text-gray-500">
                183 articles • Latest: OpenAI Q3 Market Analysis
              </div>
            </div>
            <ArrowRight className="h-8 w-8 text-gray-500 group-hover:text-blue-400 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedArticlesPanel;