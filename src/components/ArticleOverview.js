import React from 'react';
import { Clock, UserCircle, Tag, Calendar, Menu } from 'lucide-react';

const ArticleOverview = ({ article, onToggleToc }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      {/* Article Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onToggleToc}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            aria-label="Toggle Table of Contents"
          >
            <Menu className="w-5 h-5 text-gray-400 hover:text-blue-400" />
          </button>
          <h2 className="text-2xl font-bold text-white">{article.title}</h2>
        </div>
        <p className="text-gray-400">{article.subtitle}</p>
      </div>

      {/* Meta Information */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center space-x-2 text-gray-400">
          <Calendar size={16} />
          <span className="text-sm">{article.date}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Clock size={16} />
          <span className="text-sm">{article.readingTime} min read</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <UserCircle size={16} />
          <span className="text-sm">{article.author}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Tag size={16} />
          <span className="text-sm">{article.category}</span>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {article.keyStats.map((stat, index) => (
          <div 
            key={index}
            className="bg-gray-700/50 p-4 rounded-lg"
          >
            <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
            <div className={`text-lg font-semibold ${
              stat.trend === 'up' ? 'text-green-400' : 
              stat.trend === 'down' ? 'text-red-400' : 
              'text-blue-400'
            }`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Summary */}
      {article.summary && (
        <div className="mt-6 bg-gray-700/30 p-4 rounded-lg border border-gray-700">
          <h3 className="text-sm font-semibold text-blue-400 mb-2">Quick Summary</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {article.summary}
          </p>
        </div>
      )}
    </div>
  );
};

export default ArticleOverview;