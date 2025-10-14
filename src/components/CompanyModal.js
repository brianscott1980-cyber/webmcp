import React from 'react';
import MarketPerformance from './MarketPerformance';

const CompanyModal = ({ company, onClose, articleContent, showAlert }) => {
  React.useEffect(() => {
    if (window.trackGAEvent) {
      window.trackGAEvent('component_launch', { component: 'CompanyModal', company: company?.name });
    }
  }, [company]);

  // Function to generate relevant article titles based on company info
  const generateRelatedArticles = (company) => {
    const topics = [
      'earnings', 'strategy', 'market share', 'innovation', 
      'partnerships', 'expansion', 'technology', 'sustainability'
    ];
    const timeframes = [
      'Q3 2025', 'H2 2025', '2026 Outlook', 'Next 5 Years'
    ];
    
    return [
      {
        id: 1,
        title: `${company.name} ${topics[Math.floor(Math.random() * topics.length)]}: ${timeframes[Math.floor(Math.random() * timeframes.length)]} Analysis`,
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      }
    ];
  };

  const scrollToSentence = (sentence) => {
    // Create a temporary container to find the sentence in the article
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = articleContent;
    
    const walker = document.createTreeWalker(
      tempDiv,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const articleWalker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    // Find and highlight the sentence in the actual article
    let found = false;
    let articleNode;
    while (articleNode = articleWalker.nextNode()) {
      if (articleNode.textContent.includes(sentence)) {
        // Create a wrapper span for the sentence
        const span = document.createElement('span');
        span.className = 'bg-yellow-500/50 animate-pulse transition-colors duration-500';
        const range = document.createRange();
        range.setStart(articleNode, articleNode.textContent.indexOf(sentence));
        range.setEnd(articleNode, articleNode.textContent.indexOf(sentence) + sentence.length);
        range.surroundContents(span);

        // Scroll the sentence into view
        span.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove the highlight after animation
        setTimeout(() => {
          const parent = span.parentNode;
          parent.replaceChild(document.createTextNode(span.textContent), span);
        }, 2000);

        break;
      }
    }

    // Close the modal
    onClose();
  };

  return (
    <div className="relative bg-gray-800 rounded-lg shadow-2xl border border-blue-500/50 p-2.5 backdrop-blur-sm bg-opacity-95 max-w-sm space-y-4">
      <div className="space-y-2.5">
        <div className="flex justify-between items-start">
          <h3 className="text-xs font-semibold text-blue-400">{company.name} Mentions</h3>
          <button
            onClick={onClose}
            className="text-[11px] text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
          <button
            onClick={() => {
              showAlert(`Now following ${company.name}`, 'success');
              if (window.trackGAEvent) {
                window.trackGAEvent('subscribe_action', { company: company.name });
              }
            }}
            className="px-2 py-1 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-400/10 hover:bg-blue-400/20 rounded transition-colors"
          >
            Subscribe
          </button>
              className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors cursor-pointer"
            >
              <div 
                className="text-xs text-gray-200"
                dangerouslySetInnerHTML={{
                  __html: sentence.trim()
                }}
              />
            </div>
          ))}
        </div>

        {/* Lead Analyst Section */}
        {company.analysts && company.analysts[0] && (
          <div className="border-t border-gray-700 pt-2.5">
            <h4 className="text-xs font-semibold text-blue-400 mb-2">Lead Analyst</h4>
            <div className="flex items-center gap-2.5 p-2 bg-gray-700/50 rounded-lg group hover:bg-gray-600/50 transition-colors">
              <div className="relative">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(company.analysts[0].name)}&background=random&color=fff&size=32`}
                  alt={company.analysts[0].name}
                  className="w-8 h-8 rounded-lg"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border border-gray-800 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h5 className="text-xs font-medium text-gray-200">{company.analysts[0].name}</h5>
                <p className="text-[11px] text-gray-400 mt-0.5">Coverage: {company.type}</p>
              </div>
            </div>
          </div>
        )}

        {/* Related Articles Section */}
        <div className="border-t border-gray-700 pt-2.5">
          <h4 className="text-xs font-semibold text-blue-400 mb-2">Related Articles</h4>
          <div className="space-y-2">
            {generateRelatedArticles(company).map(article => (
              <div 
                key={article.id}
                className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors cursor-pointer group"
              >
                {/* Article Icon */}
                <div className="shrink-0 w-8 h-8 bg-gray-700 rounded-lg overflow-hidden relative group-hover:bg-gray-600 transition-colors">
                  {/* Document Preview Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-700 group-hover:from-blue-500/20 group-hover:to-gray-600 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs text-gray-200 font-medium truncate group-hover:text-white transition-colors">
                    {article.title}
                  </h5>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-gray-400">{article.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Performance */}
        {company.rating && <MarketPerformance company={company} />}

        {/* Subscription Options Section */}
        <div className="border-t border-gray-700 pt-2.5 space-y-2">
          <h4 className="text-xs font-semibold text-blue-400 mb-2">Subscriptions</h4>
          
          {/* Company Subscription */}
          <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg group hover:bg-gray-600/50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.707.707L10 12.414l-4.293 4.293A1 1 0 014 16V4zm5 0a1 1 0 10-2 0v2a1 1 0 102 0V4zm5 0a1 1 0 10-2 0v2a1 1 0 102 0V4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-200">Follow {company.name}</div>
                <div className="text-xs text-gray-400">Approx. 13 article p/month</div>
              </div>
            </div>
            <button
              onClick={() => {
                showAlert(`Now following ${company.name}`, 'success');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-xs ml-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Follow
            </button>
          </div>

          {/* Analyst Subscription */}
          {company.analysts && company.analysts[0] && (
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg group hover:bg-gray-600/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(company.analysts[0].name)}&background=random&color=fff&size=32`}
                    alt={company.analysts[0].name}
                    className="w-8 h-8 rounded-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border border-gray-800 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-200">Follow {company.analysts[0].name}</div>
                  <div className="text-[11px] text-gray-400">Approx. 4 articles p/month</div>
                </div>
              </div>
              <button
                onClick={() => {
                  showAlert(`Now following ${company.analysts[0].name}`, 'success');
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-xs ml-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Follow
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;
