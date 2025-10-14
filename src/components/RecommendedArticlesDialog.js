import React from 'react';
import ArticlePreviewCard from './ArticlePreviewCard';

const RecommendedArticlesDialog = ({ articles, onClose, searchContext }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-6 w-full max-w-3xl mx-4">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-100">Recommended Articles</h3>
          {searchContext && (
            <p className="text-sm text-gray-400 mt-1">
              Based on: {searchContext}
            </p>
          )}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {articles.map((article, index) => (
            <ArticlePreviewCard 
              key={index}
              article={article}
              onClick={() => {
                onClose();
                // Additional click handling can be added here
              }}
            />
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
          aria-label="Close dialog"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RecommendedArticlesDialog;