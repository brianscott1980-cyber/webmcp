import React, { useState, useEffect, useRef } from 'react';
import { Menu, Clock } from 'lucide-react';

const ArticleActions = ({ 
  onToggleToc, 
  onSubscribe, 
  onSave, 
  onEmail, 
  readingTime = '5',
  activeCompany = null,
  activeMarketNews = null,
  onSubscribeCompany = () => {},
  onSubscribeAnalyst = () => {},
  onOpenMarketNews = () => {}
}) => {
  const [isSticky, setIsSticky] = useState(false);
  const [remainingTime, setRemainingTime] = useState(readingTime);
  const [subscriptionAlert, setSubscriptionAlert] = useState(null);
  const actionRef = useRef(null);
  const initialPosRef = useRef(null);
  const articleEndRef = useRef(null);
  
  const handleSubscribe = (type, name) => {
    setSubscriptionAlert({ type, name });
    if (type === 'company') {
      onSubscribeCompany(activeCompany);
    } else {
      onSubscribeAnalyst(activeCompany.analysts[0]);
    }
    // Clear alert after 3 seconds
    setTimeout(() => setSubscriptionAlert(null), 3000);
  };

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
      {/* Spacer div that takes up space when the actions bar is sticky */}
      {isSticky && <div className="h-[88px]" />} {/* 24px (my-6) + 32px (py-4) = 56px + extra for content */}
      <div 
        ref={actionRef}
        className={`flex space-x-4 z-10 bg-gray-900 transition-all duration-200 ${
          isSticky 
            ? 'fixed top-0 left-0 right-0 px-6 shadow-lg border-b border-gray-800 py-4' 
            : 'py-4 my-6'
        }`}
      >
          <button onClick={() => {
            window.trackGAEvent && window.trackGAEvent('toc_open', { component: 'ArticleActions' });
            onToggleToc();
          }} className={`flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 ${
            isSticky ? 'px-2.5 py-1.5' : 'px-4 py-2'
          }`} aria-label="Toggle Table of Contents">
          <Menu className={`${isSticky ? 'h-4 w-4' : 'h-5 w-5'}`} />
          {!isSticky && (
            <span className="text-sm">Contents</span>
          )}
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
          {!isSticky && (
            <span className="text-sm">Subscribe</span>
          )}
        </button>
        <button 
              <button onClick={() => {
                window.trackGAEvent && window.trackGAEvent('subscribe_author', { component: 'ArticleActions' });
                onSubscribe();
              }} className={`flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 ${
                isSticky ? 'px-2.5 py-1.5' : 'px-4 py-2'
              }`}>
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
          </svg>
          {!isSticky && (
            <span className="text-sm">Save Article</span>
          )}
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
          {!isSticky && (
            <span className="text-sm">Email to Me</span>
          )}
        </button>
        
              <button onClick={() => {
                window.trackGAEvent && window.trackGAEvent('save_article', { component: 'ArticleActions' });
                onSave();
              }} className={`flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 ${
                isSticky ? 'px-2.5 py-1.5' : 'px-4 py-2'
              }`}>
                ? 'translate-y-0 opacity-100' 
                : '-translate-y-full opacity-0'}`}
          >
            {activeCompany && (
              <>
                {subscriptionAlert && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-gray-200 px-3 py-1.5 rounded-lg text-xs shadow-lg transition-opacity duration-300">
                    Subscribed to {subscriptionAlert.name} {subscriptionAlert.type === 'analyst' ? 'analysis' : 'updates'}
                  </div>
                )}
                <div className="flex items-center">
                  <span className="text-xs font-medium">{activeCompany.name}</span>
                  <button 
                    onClick={() => handleSubscribe('company', activeCompany.name)}
                      <button onClick={() => {
                        window.trackGAEvent && window.trackGAEvent('email_article', { component: 'ArticleActions' });
                        onEmail();
                      }} className={`flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 ${
                        isSticky ? 'px-2.5 py-1.5' : 'px-4 py-2'
                      }`}>
                    </svg>
                  </button>
                </div>
                {activeCompany.targetPrice && (
                  <>
                    <span className="text-gray-500">•</span>
                    <span className="text-xs">Target: {activeCompany.targetPrice}</span>
                  </>
                )}
                {activeCompany.analysts && activeCompany.analysts[0] && (
                  <>
                    <span className="text-gray-500">•</span>
                    <div className="flex items-center">
                      <span className="text-xs">{activeCompany.analysts[0].name}</span>
                      <button 
                        onClick={() => handleSubscribe('analyst', activeCompany.analysts[0].name)}
                        className="ml-1.5 p-0.5 hover:bg-gray-700 rounded transition-colors"
                        aria-label={`Subscribe to ${activeCompany.analysts[0].name} updates`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400 hover:text-gray-200" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          
          {/* Market Competition News */}
          <div 
            className={`flex items-center space-x-3 text-gray-300 transform transition-all duration-300 ease-in-out absolute inset-0 justify-center
              ${isSticky && activeMarketNews && !activeCompany
                ? 'translate-y-0 opacity-100' 
                : '-translate-y-full opacity-0'}`}
          >
            {activeMarketNews && (
              <div className="flex items-center space-x-3 flex-shrink-0">
                <span className="text-xs text-gray-400">In the news:</span>
                <span className="text-xs font-medium">{activeMarketNews.title}</span>
                <button 
                  onClick={() => onOpenMarketNews(activeMarketNews)}
                  className="p-0.5 hover:bg-gray-700 rounded transition-colors"
                  aria-label="Open market news article"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400 hover:text-gray-200" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Remaining Time Info - Only visible when sticky */}
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