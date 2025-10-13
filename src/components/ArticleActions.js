import React from 'react';
import { Menu } from 'lucide-react';

const ArticleActions = ({ onToggleToc, onSubscribe, onSave, onEmail }) => {
  return (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={onToggleToc}
        className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        aria-label="Toggle Table of Contents"
      >
        <Menu className="h-5 w-5" />
        <span>Contents</span>
      </button>
      <button 
        onClick={onSubscribe}
        className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2-2v14h12V3H4z"/>
          <path d="M10 7a1 1 0 011 1v5a1 1 0 11-2 0V8a1 1 0 011-1z"/>
        </svg>
        <span>Subscribe</span>
      </button>
      <button 
        onClick={onSave}
        className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
        </svg>
        <span>Save Article</span>
      </button>
      <button 
        onClick={onEmail}
        className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
        </svg>
        <span>Email to Me</span>
      </button>
    </div>
  );
};

export default ArticleActions;