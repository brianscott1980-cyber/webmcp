import React, { useState, useEffect, useRef } from 'react';
import { Menu, Clock } from 'lucide-react';

const ArticleActions = ({ onToggleToc, onSubscribe, onSave, onEmail, readingTime = '5' }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [remainingTime, setRemainingTime] = useState(readingTime);
  const actionRef = useRef(null);
  const initialPosRef = useRef(null);
  const articleEndRef = useRef(null);

  useEffect(() => {
    const calculatePositions = () => {
      if (actionRef.current) {
        const rect = actionRef.current.getBoundingClientRect();
        initialPosRef.current = rect.top + window.pageYOffset;

        // Find the article content end (using the prose class as reference)
        const articleContent = document.querySelector('.prose');
        if (articleContent) {
          const articleRect = articleContent.getBoundingClientRect();
          articleEndRef.current = articleRect.bottom + window.pageYOffset;
        }
      }
    };

    // Calculate positions after a short delay to ensure proper layout
    setTimeout(calculatePositions, 100);

    const handleScroll = () => {
      if (!initialPosRef.current || !articleEndRef.current) return;
      
      const scrollPosition = window.pageYOffset;
      const viewportHeight = window.innerHeight;
      const shouldBeSticky = scrollPosition > initialPosRef.current;

      // Calculate reading progress
      const totalReadableLength = articleEndRef.current - initialPosRef.current;
      const currentProgress = Math.min(
        Math.max(scrollPosition + viewportHeight - initialPosRef.current, 0),
        totalReadableLength
      );
      const progressPercentage = currentProgress / totalReadableLength;
      
      // Calculate remaining time based on progress
      const timeRemaining = Math.max(
        Math.ceil(readingTime * (1 - progressPercentage)),
        0
      );
      
      setRemainingTime(timeRemaining);
      if (shouldBeSticky !== isSticky) {
        setIsSticky(shouldBeSticky);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', calculatePositions);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculatePositions);
    };
  }, [isSticky, readingTime]);

  return (
    <div>
      <div 
        ref={actionRef}
        className={`flex space-x-4 mb-6 z-10 bg-gray-900 transition-all duration-200 ${
          isSticky 
            ? 'fixed top-0 left-0 right-0 px-6 shadow-lg border-b border-gray-800 py-2' 
            : 'py-4'
        }`}
      >
        <button
          onClick={onToggleToc}
          className={`flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 ${
            isSticky ? 'px-2.5 py-1.5' : 'px-4 py-2'
          }`}
          aria-label="Toggle Table of Contents"
        >
          <Menu className={`${isSticky ? 'h-4 w-4' : 'h-5 w-5'}`} />
          <span className={`${isSticky ? 'text-xs' : 'text-sm'}`}>
            {isSticky ? 'Contents' : 'Contents'}
          </span>
        </button>
        <button 
          onClick={onSubscribe}
          className={`flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 ${
            isSticky ? 'px-2.5 py-1.5' : 'px-4 py-2'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`${isSticky ? 'h-4 w-4' : 'h-5 w-5'}`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2-2v14h12V3H4z"/>
            <path d="M10 7a1 1 0 011 1v5a1 1 0 11-2 0V8a1 1 0 011-1z"/>
          </svg>
          <span className={`${isSticky ? 'text-xs' : 'text-sm'}`}>
            {isSticky ? 'Subscribe' : 'Subscribe'}
          </span>
        </button>
        <button 
          onClick={onSave}
          className={`flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 ${
            isSticky ? 'px-2.5 py-1.5' : 'px-4 py-2'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`${isSticky ? 'h-4 w-4' : 'h-5 w-5'}`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
          </svg>
          <span className={`${isSticky ? 'text-xs' : 'text-sm'}`}>
            {isSticky ? 'Save' : 'Save Article'}
          </span>
        </button>
        <button 
          onClick={onEmail}
          className={`flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 ${
            isSticky ? 'px-2.5 py-1.5' : 'px-4 py-2'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`${isSticky ? 'h-4 w-4' : 'h-5 w-5'}`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
          </svg>
          <span className={`${isSticky ? 'text-xs' : 'text-sm'}`}>
            {isSticky ? 'Email' : 'Email to Me'}
          </span>
        </button>
        
        {/* Remaining Time Info - Only visible when sticky */}
        <div className="flex-1" />
        {isSticky && (
          <div className="flex items-center space-x-1.5 text-gray-400 pr-2">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs whitespace-nowrap">
              {remainingTime === 0 
                ? 'Completed'
                : `${remainingTime} min${remainingTime === 1 ? '' : 's'} left`
              }
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleActions;