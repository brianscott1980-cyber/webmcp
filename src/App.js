import React, { useState, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Menu, TrendingUp, TrendingDown } from 'lucide-react';
import { TabServerTransport } from '@mcp-b/transports';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import initialArticleContent from './initialArticleContent';
import companies from './companies';

const TradingDashboard = () => {
  // Alert state
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  // Show alert message function
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    // Auto hide after 5 seconds
    setTimeout(() => {
      setAlert({ show: false, message: '', type: 'success' });
    }, 5000);
  };

  // Article content state
  const [articleContent, setArticleContent] = useState(() => {
    // Initialize with the content and immediately highlight company names
    const content = initialArticleContent.html;
    return content;
  });
  const [annotations, setAnnotations] = useState({});
  const [snippets, setSnippets] = useState([]);
  
  // Effect to highlight company names whenever article content changes
  React.useEffect(() => {
    highlightTermInArticle();
  }, []); // Run once on mount
  const [annotationPrompt, setAnnotationPrompt] = useState({ show: false, text: '', range: null });
  const [selectionPopup, setSelectionPopup] = useState({
    show: false,
    text: '',
    summary: '',
    x: 0,
    y: 0
  });
  
  const [companyModal, setCompanyModal] = useState({
    show: false,
    company: null,
    x: 0,
    y: 0
  });
  const activeCardRef = useRef(null);

  // Function to highlight text in the article
  const annotateText = (text, annotation) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(articleContent, 'text/html');
    
    // Create a unique ID for this annotation
    const annotationId = `annotation-${Date.now()}`;
    
    // Find and annotate the text
    const highlightInNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const nodeText = node.textContent;
        const index = nodeText.indexOf(text);
        if (index !== -1) {
          // Split the text node into three parts: before, selected, and after
          const before = nodeText.substring(0, index);
          const after = nodeText.substring(index + text.length);
          
          // Create text nodes for before and after
          if (before) {
            node.parentNode.insertBefore(document.createTextNode(before), node);
          }
          
          // Create the annotated span around the original text node
          const span = document.createElement('span');
          span.className = 'relative group cursor-help border-b border-dotted border-blue-400';
          span.setAttribute('data-annotation-id', annotationId);
          // Move the original text node into the span
          const textNode = document.createTextNode(text);
          span.appendChild(textNode);
          node.parentNode.insertBefore(span, node);
          
          if (after) {
            node.parentNode.insertBefore(document.createTextNode(after), node);
          }
          
          // Remove the original text node
          node.parentNode.removeChild(node);
          
          // Store the annotation
          setAnnotations(prev => ({
            ...prev,
            [annotationId]: annotation
          }));
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(highlightInNode);
      }
    };

    Array.from(doc.body.childNodes).forEach(highlightInNode);
    const newContent = doc.body.innerHTML;
    setArticleContent(newContent);
    
    return `Added annotation to "${text}"`;
  };

  const highlightTermInArticle = (term) => {
    // Create a DOM parser to work with the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(articleContent, 'text/html');
    
    // Function to find and highlight text in a node
    const highlightInNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.textContent;
        let fragment = document.createDocumentFragment();
        
        // Check if term is defined before using replace
        if (!term) return;
        
        // Create a regex that escapes special characters in the term
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedTerm, 'gi');
        
        if (regex.test(text)) {
          // Find sentence boundaries
          const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
          let lastIndex = 0;
          
          sentences.forEach(sentence => {
            const sentenceStart = text.indexOf(sentence, lastIndex);
            const sentenceEnd = sentenceStart + sentence.length;
            
            // Check if this sentence contains the term
            if (new RegExp(escapedTerm, 'gi').test(sentence)) {
              // Add text before this sentence
              if (sentenceStart > lastIndex) {
                fragment.appendChild(
                  document.createTextNode(text.substring(lastIndex, sentenceStart))
                );
              }
              
              // Add the highlighted sentence
              const span = document.createElement('span');
              span.className = `${highlightColors[Math.floor(Math.random() * highlightColors.length)]} text-white px-1 rounded`;
              span.textContent = sentence;
              fragment.appendChild(span);
            } else {
              // Add non-matching sentence as plain text
              fragment.appendChild(
                document.createTextNode(sentence)
              );
            }
            
            lastIndex = sentenceEnd;
          });
          
          // Add any remaining text
          if (lastIndex < text.length) {
            fragment.appendChild(
              document.createTextNode(text.substring(lastIndex))
            );
          }
          
          node.parentNode.replaceChild(fragment, node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Recursively process child nodes
        Array.from(node.childNodes).forEach(highlightInNode);
      }
    };

    // Process all nodes
    Array.from(doc.body.childNodes).forEach(highlightInNode);
    
    // Get the updated HTML content
    const newContent = doc.body.innerHTML;
    setArticleContent(newContent);
  };
  
  // Array of highlight colors
  const highlightColors = [
    'bg-blue-600',
    'bg-green-600',
    'bg-purple-600',
    'bg-red-600',
    'bg-yellow-600',
    'bg-pink-600',
    'bg-indigo-600',
    'bg-orange-600',
    'bg-teal-600',
    'bg-cyan-600'
  ];
  
  const [stroke, setStroke] = useState('#3B82F6');
  const [data, setData] = useState([
    { time: '19:00', value: 5458 },
    { time: '20:00', value: 5462 },
    { time: '21:00', value: 5470 },
    { time: '22:00', value: 5460 },
    { time: '23:00', value: 5468 },
  ]);

  const indices = [
    { name: 'S&P 500', value: 5464.61, change: -0.16, color: 'red', flag: '🇺🇸' },
    { name: 'Nasdaq 100', value: 19700.43, change: -0.26, color: 'red', flag: '🇺🇸' },
    { name: 'Dow 30', value: 39150.34, change: 0.04, color: 'green', flag: '🇺🇸' },
    { name: 'Nikkei 225', value: 38596.40, change: -0.09, color: 'red', flag: '🇯🇵' },
  ];
  const [title, setTitle] = useState('Market Summary');
  const [chartTitle, setChartTitle] = useState('BTCUSD');
  const [watchlistItems, setWatchlistItems] = useState([
    { symbol: 'BTCUSD', price: 64444, change: 0.33, color: 'green' },
    { symbol: 'VIX', price: 13.2, change: -0.6, color: 'red' },
    { symbol: 'XAUUSD', price: 2321.875, change: -1.62, color: 'red' },
    { symbol: 'USDJPY', price: 159.76, change: 0.54, color: 'green' },
  ]);
  // Server and transport initialization
  const server = new McpServer({
    name: 'trading-server',
    version: '1.0.0'
  });
  // Register the tools available on this page.

  server.tool('updateGraphForTicker', 'Update the graph data and stroke color for a ticker', {
    ticker: z.string()
  }, async ({ ticker }) => {
    // Generate new random data for the chart
    const newData = data.map(d => ({
      ...d,
      value: Math.round(Math.random() * 10000)
    }));
    // Generate a random color for the stroke
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6,'0')}`;
    setData(newData);
    setStroke(randomColor);
    setChartTitle(ticker);
    return { content: [{ type: 'text', text: `Graph updated for ${ticker} with color ${randomColor}.` }] };
  });
  server.tool('changeTitle', 'Change the title of the page', {
    title: z.string()
  }, async ({ title }) => {
    setTitle(title);
    showAlert('Title has been updated successfully', 'success');
    return { content: [{ type: 'text', text: "Title has been updated."}] };
  });

  // Function to generate random price data for a ticker
  const generateTickerData = (basePrice) => {
    const hourlyData = [];
    let currentPrice = basePrice;
    
    for (let i = 19; i <= 23; i++) {
      currentPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.02); // 2% max change
      hourlyData.push({
        time: `${i}:00`,
        value: Math.round(currentPrice * 100) / 100
      });
    }
    return hourlyData;
  };

  server.tool('addToWatchlist', 'Add a new stock ticker to the watchlist', {
    ticker: z.string()
  }, async ({ ticker }) => {
    console.log('addToWatchlist called with ticker:', ticker);
    
    // Generate new ticker data
    const price = Math.round(Math.random() * 100000) / 100;
    const change = Math.round((Math.random() * 4 - 2) * 100) / 100;
    const color = change >= 0 ? 'green' : 'red';
    
    // Generate new chart data based on the price
    const newChartData = generateTickerData(price);
    setData(newChartData);
    
    // Generate a new color for the chart
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6,'0')}`;
    setStroke(randomColor);
    
    // Update chart title
    setChartTitle(ticker);
    
    // Remove any existing instance and add the new one
    setWatchlistItems(prev => {
      // Filter out any existing instance of this ticker
      const filtered = prev.filter(item => item.symbol !== ticker);
      // Add the new ticker data
      return [
        ...filtered,
        { symbol: ticker, price, change, color }
      ];
    });
    
    showAlert(`Added ${ticker} to watchlist and updated chart`, 'success');
    return { content: [{ type: 'text', text: `Added ${ticker} to watchlist and updated chart display.` }] };
  });

  server.tool('removeFromWatchlist', 'Remove a stock ticker from the watchlist', {
    ticker: z.string()
  }, async ({ ticker }) => {
    setWatchlistItems(prev => prev.filter(item => item.symbol !== ticker));
    return { content: [{ type: 'text', text: `Removed ${ticker} from watchlist.` }] };
  });

  server.tool('clearWatchlist', 'Remove all stock tickers from the watchlist', {
  }, async () => {
    setWatchlistItems([]);
    return { content: [{ type: 'text', text: 'Successfully cleared watchlist.' }] };
  });

  server.tool('subscribeToAuthor', 'Subscribe to the article author', {
  }, async () => {
    showAlert('You have now been subscribed to the author of this article', 'success');
    return { content: [{ type: 'text', text: 'Successfully subscribed to author.' }] };
  });

  server.tool('saveArticle', 'Save article to Read Later collection', {
  }, async () => {
    showAlert('This article has been added to your Read Later collection', 'success');
    return { content: [{ type: 'text', text: 'Article saved to Read Later collection.' }] };
  });

  server.tool('emailArticle', 'Email article to user', {
  }, async () => {
    showAlert('This article has been delivered to your inbox', 'success');
    return { content: [{ type: 'text', text: 'Article sent to email.' }] };
  });

    const generateTextSummary = (text) => {
    const summary = `Selected Text Summary: ${text.slice(0, 50)}...`;
    return summary;
  };

  // Function to detect companies in text
  // Function to find all sentences containing a company name with HTML preserved
  const findCompanySentences = (htmlContent, companyName) => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const sentences = [];
    const walker = document.createTreeWalker(
      tempDiv,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let currentNode;
    let currentSentence = '';
    let currentHtml = '';
    
    while (currentNode = walker.nextNode()) {
      const text = currentNode.textContent;
      const sentenceParts = text.match(/[^.!?]+[.!?]+/g) || [text];
      
      sentenceParts.forEach(part => {
        // Get the HTML context for this text node
        const range = document.createRange();
        range.selectNodeContents(currentNode.parentElement);
        const contextHtml = range.cloneContents().parentElement?.outerHTML || part;
        
        if (part.toLowerCase().includes(companyName.toLowerCase())) {
          sentences.push(contextHtml);
        }
      });
    }
    
    return sentences;
  };

  const detectCompanies = (text) => {
    const detectedCompanies = [];
    companies.forEach(company => {
      if (text.toLowerCase().includes(company.name.toLowerCase())) {
        const sentences = findCompanySentences(text, company.name);
        detectedCompanies.push({
          name: company.name,
          type: company.type,
          rating: company.rating,
          targetPrice: company.targetPrice,
          sentences: sentences
        });
      }
    });
    return detectedCompanies;
  };

  // Handle text selection in the article

  server.tool('highlightArticleContent', 'Highlight terms and surrounding context in the article content', {
    term: z.string()
  }, async ({ term }) => {
    highlightTermInArticle(term);
    const message = `Highlighted "${term}" in the article`;
     
    return { 
      content: [{ 
        type: 'text', 
        text: message
      }] 
    };
  });

  // Handle text selection in the article
  const handleTextSelection = async (e) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Generate summary using the MCP tool
      const summary = generateTextSummary(selectedText);
      
      // Detect companies in the selected text
      const detectedCompanies = detectCompanies(selectedText);
      
      // Position the popup above the selection, accounting for scroll
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setSelectionPopup({
        show: true,
        text: selectedText,
        summary: summary,
        detectedCompanies: detectedCompanies,
        x: rect.x + (rect.width / 2), // Center horizontally
        y: rect.y + scrollTop // Add scroll position to get absolute position
      });
    } else {
      setSelectionPopup(prev => ({ ...prev, show: false }));
    }
  };

  // Selection Popup Component
  const SelectionPopup = ({ text, x, y }) => {
    const [popupY, setPopupY] = useState(y);
    const popupRef = useRef(null);

    useEffect(() => {
      const handleScroll = () => {
        if (!popupRef.current) return;
        
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newY = y - scrollTop;
        
        // Keep popup within viewport bounds
        const popupHeight = popupRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        const minY = popupHeight + 20; // minimum distance from top
        const maxY = viewportHeight - 20; // maximum distance from top
        
        const boundedY = Math.max(minY, Math.min(newY, maxY));
        setPopupY(boundedY);
      };

      handleScroll(); // Initial position
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [y]);

    return (
      <div 
        ref={popupRef}
        className="fixed z-50 transform -translate-x-1/2 -translate-y-full bg-gray-800 rounded-lg shadow-2xl border border-blue-500/50 p-2.5 backdrop-blur-sm bg-opacity-95 max-w-md"
        style={{ left: `${x}px`, top: `${popupY}px`, transition: 'top 0.1s ease-out' }}
      >
        <div className="space-y-2.5">
          {/* Selected Text */}
          <div className="px-0.5">
            <div className="text-blue-400 text-[11px] font-medium uppercase tracking-wide mb-0.5">
              Selected Text
            </div>
            <div className="text-xs text-gray-300 font-medium truncate">
              "{text}"
            </div>
          </div>
          
          {/* AI Summary */}
          <div className="px-1">
            <div className="text-blue-400 text-xs font-medium uppercase tracking-wide mb-1">
              AI Generated Summary
            </div>
            <div className="text-sm text-gray-300 font-medium leading-relaxed">
              {selectionPopup.summary}
            </div>
          </div>

          {/* Companies Detected */}
          {selectionPopup.detectedCompanies && selectionPopup.detectedCompanies.length > 0 && (
            <div className="px-1">
              <div className="text-blue-400 text-xs font-medium uppercase tracking-wide mb-1">
                Companies Detected
              </div>
              <div className="space-y-2">
                {selectionPopup.detectedCompanies.map((company, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-2">

                    <div className="text-sm font-medium text-white">{company.name}</div>
                    <div className="text-xs text-gray-400">{company.type}</div>
                    <div className="flex items-center justify-between mt-2">

                      <div>
                        {company.rating && (
                          <div className="text-xs text-gray-400">Rating: {company.rating}</div>
                        )}
                        {company.targetPrice && (
                          <div className="text-xs text-gray-400">Target Price: ${company.targetPrice}</div>
                        )}

                      <div className="w-24 h-12 mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={[
                              { time: '1', value: Math.random() * 100 },
                              { time: '2', value: Math.random() * 100 },
                              { time: '3', value: Math.random() * 100 },
                              { time: '4', value: Math.random() * 100 },
                              { time: '5', value: Math.random() * 100 }
                            ]}
                          >
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke={company.rating === "Overweight" ? "#22c55e" : 
                                     company.rating === "Underweight" ? "#ef4444" : 
                                     "#3b82f6"}
                              strokeWidth={1.5}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                        {/* Related Research Section */}
                        <div className="mt-2">
                          <div className="text-xs text-blue-400 font-medium uppercase tracking-wide mb-1">Related Research</div>
                          <ul className="space-y-1">
                            <li className="text-xs text-gray-400 hover:text-blue-400 cursor-pointer transition-colors">
                              {`${company.name} Q3 2025 Market Analysis: Growth Prospects and Strategic Initiatives`}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => {
                highlightTermInArticle(text)
                showAlert(`Term "${text}" highlighted`, 'success');
                setSelectionPopup(prev => ({ ...prev, show: false }));
              }}
              className="flex items-center space-x-1 text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-500/20"
            >
              Highlight Terms
            </button>
            <button
              onClick={() => {
                const newSnippet = {
                  id: Date.now(),
                  text: text,
                  summary: selectionPopup.summary,
                  timestamp: new Date().toISOString()
                };
                setSnippets(prev => [newSnippet, ...prev]);
                showAlert('Snippet saved successfully', 'success');
                setSelectionPopup(prev => ({ ...prev, show: false }));
              }}
              className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Save Snippet
            </button>
            <button
              onClick={() => {
                setAnnotationPrompt({
                  show: true,
                  text: '',
                  selectedText: selectionPopup.text
                });
                setSelectionPopup(prev => ({ ...prev, show: false }));
              }}
              className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Annotate this Text
            </button>
            <button
              onClick={() => setSelectionPopup(prev => ({ ...prev, show: false }))}
              className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="absolute w-3 h-3 bg-gray-800 rotate-45 left-1/2 -bottom-1.5 -translate-x-1/2 border-b border-r border-blue-500/50"></div>
      </div>
    );
  };

  server.connect(new TabServerTransport({ 
    allowedOrigins: ["*"] 
  }));
  // Annotation Prompt Component
  // Company Modal Component
  const CompanyModal = ({ company, x, y }) => {
    const modalRef = useRef(null);

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

    useEffect(() => {
      if (!modalRef.current || !activeCardRef.current) return;
      
      // Get the card's bounding rect
      const cardRect = activeCardRef.current.getBoundingClientRect();
      const modalRect = modalRef.current.getBoundingClientRect();
      
      // Calculate center position
      const centerY = cardRect.top + (cardRect.height / 2) - (modalRect.height / 2);
      
      // Set the modal's position directly through style
      modalRef.current.style.top = `${centerY}px`;
      modalRef.current.style.left = `${cardRect.left - modalRect.width - 16}px`; // 16px gap
      
    }, [x, y]);

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

      let node;
      while (node = walker.nextNode()) {
        if (node.textContent.includes(sentence)) {
          // Find the actual node in the document
          const articleContainer = document.querySelector('.prose');
          const articleWalker = document.createTreeWalker(
            articleContainer,
            NodeFilter.SHOW_TEXT,
            null,
            false
          );

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
          break;
        }
      }

      // Close the modal
      setCompanyModal(prev => ({ ...prev, show: false }));
    };

    return (
      <div
        ref={modalRef}
        className="fixed z-50 bg-gray-800 rounded-lg shadow-2xl border border-blue-500/50 p-2.5 backdrop-blur-sm bg-opacity-95 max-w-sm"
        style={{
          transition: 'all 0.2s ease-out',
          transform: 'translateY(-50%)'
        }}
      >
        <div className="space-y-2.5">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-semibold text-blue-400">{company.name} Mentions</h3>
            <button
              onClick={() => setCompanyModal(prev => ({ ...prev, show: false }))}
              className="text-[11px] text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Mentions Section */}
          <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
            {company.sentences.map((sentence, index) => (
              <div
                key={index}
                onClick={() => scrollToSentence(sentence)}
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
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-medium text-gray-200">{company.analysts[0].name}</h5>
                  <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">Lead Analyst</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">Coverage: {company.type}</p>
                <div className="mt-2">
                  <a 
                    href="#"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      showAlert('Research portal access requested', 'success');
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    View Latest Research
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles Section */}
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-sm font-semibold text-blue-400 mb-3">Related Articles</h4>
            <div className="space-y-3">
              {generateRelatedArticles(company).map(article => (
                <div 
                  key={article.id}
                  className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors cursor-pointer group"
                >
                  {/* Article Icon */}
                  <div className="shrink-0 w-8 h-8 bg-gray-700 rounded-lg overflow-hidden relative group-hover:bg-gray-600 transition-colors">
                    {/* Document Preview Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-700 group-hover:from-blue-500/20 group-hover:to-gray-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute top-1.5 left-1.5 text-gray-500/50 group-hover:text-blue-400/50 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    {/* Text Lines */}
                    <div className="absolute bottom-1.5 left-2 right-2 space-y-1">
                      <div className="h-0.5 w-6 bg-gray-500/50 group-hover:bg-blue-400/50 transition-colors rounded"></div>
                      <div className="h-0.5 w-4 bg-gray-500/30 group-hover:bg-blue-400/30 transition-colors rounded"></div>
                    </div>
                  </div>
                  
                  {/* Article Content */}
                  <div className="flex-1">
                    <h5 className="text-xs text-gray-200 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {article.title}
                    </h5>
                    <span className="text-[11px] text-gray-400 mt-0.5 block">
                      {article.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
          </div>
        </div>
      </div>
    );
  };

  const AnnotationPrompt = () => {
    const [draftText, setDraftText] = React.useState(annotationPrompt.text);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border-2 border-blue-500/50 max-w-md w-full mx-4">
          <h3 className="text-lg font-medium text-white mb-4">Add Annotation</h3>
          <textarea
            className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your annotation here..."
            rows="3"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setAnnotationPrompt({ show: false, text: '', range: null })}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (draftText.trim()) {
                  annotateText(annotationPrompt.selectedText, draftText.trim());
                  showAlert('Annotation added successfully', 'success');
                  setAnnotationPrompt({ show: false, text: '', range: null });
                }
              }}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              Add Annotation
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col" >
      {/* Alert Message */}
      {alert.show && (
        <div className="fixed top-4 right-4 z-50">
          <div id="alert-additional-content" className="p-4 mb-4 border rounded-lg shadow-lg max-w-sm bg-green-600 text-white border-green-700" role="alert">
            <div className="flex items-center">
              <svg className="shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
              </svg>
              <span className="sr-only">Info</span>
              <h3 className="text-lg font-medium">{alert.message}</h3>
            </div>
            <div className="flex mt-4">
              <button 
                onClick={() => setAlert({ show: false, message: '', type: 'success' })}
                className="text-xs px-3 py-1.5 bg-transparent border border-white text-white font-medium rounded-lg text-center hover:bg-white hover:text-green-600 transition-colors duration-200"
                data-dismiss-target="#alert-additional-content"
                aria-label="Close"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      <header className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <span className="text-2xl font-bold text-blue-500">TY</span>
          <nav className="hidden md:flex space-x-6">
            {['Products', 'Community', 'Markets', 'News', 'Brokers'].map((item) => (
              <a key={item} href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">{item}</a>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input type="text" placeholder="Search" className="bg-gray-700 text-white rounded-full py-2 px-4 pl-10 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <button className="bg-blue-600 rounded-full p-2 hover:bg-blue-700 transition-colors duration-200">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      <main className="flex-grow p-6 overflow-hidden flex">
        <div className="flex-grow mr-4">
          <h2 className="text-2xl font-semibold mb-6 text-blue-400">{title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {indices.map((index) => (
              <div key={index.name} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400 flex items-center">
                    <span className="mr-2 text-lg">{index.flag}</span>
                    {index.name}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${index.color === 'green' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {index.change > 0 ? '+' : ''}{index.change}%
                  </span>
                </div>
                <div className="text-2xl font-bold">{index.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-64 sm:h-96">
            <h3 className="text-lg font-medium text-blue-400 mb-4">{chartTitle}</h3>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={data}>
                <XAxis dataKey="time" stroke="#6B7280" />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Line type="monotone" dataKey="value" stroke={stroke} strokeWidth={2} dot={false} />
              </LineChart>
              
            </ResponsiveContainer>
          </div>
              {/* New reading area with summary */}
              <div className="mt-8 bg-gray-800 rounded-lg shadow-lg p-6">
                {/* Article action buttons */}
                <div className="flex space-x-4 mb-6">
                  <button 
                    onClick={() => showAlert('You have now been subscribed to the author of this article', 'success')}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2-2v14h12V3H4z"/>
                      <path d="M10 7a1 1 0 011 1v5a1 1 0 11-2 0V8a1 1 0 011-1z"/>
                    </svg>
                    <span>Subscribe</span>
                  </button>
                  <button 
                    onClick={() => showAlert('This article has been added to your Read Later collection', 'success')}
                    className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
                    </svg>
                    <span>Save Article</span>
                  </button>
                  <button 
                    onClick={() => showAlert('This article has been delivered to your inbox', 'success')}
                    className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <span>Email to Me</span>
                  </button>
                </div>
                <div 
                  onMouseUp={handleTextSelection}
                  dangerouslySetInnerHTML={{ __html: articleContent }}
                  className="prose prose-invert max-w-none relative"
                  onMouseMove={e => {
                    const annotationId = e.target.getAttribute('data-annotation-id');
                    if (annotationId && annotations[annotationId]) {
                      // Remove existing tooltip if any
                      const target = e.target;
                      const existingTooltip = document.getElementById('annotation-tooltip');
                      if (existingTooltip) existingTooltip.remove();
                      
                      const tooltip = document.createElement('div');
                      tooltip.className = 'fixed z-50 bg-gray-800/95 backdrop-blur-sm text-white p-4 rounded-xl shadow-2xl border-2 border-blue-500 text-sm max-w-xs animate-in fade-in duration-200';
                      
                      // Position tooltip relative to cursor
                      const padding = 15; // Space between cursor and tooltip
                      tooltip.style.left = `${e.clientX}px`;
                      tooltip.style.top = `${e.clientY - padding}px`;
                      tooltip.style.transform = 'translate(-50%, -100%)';
                      
                      // Create and style the content
                      const content = document.createElement('div');
                      content.className = 'flex flex-col gap-2';
                      
                      // Add a "Note" label
                      const label = document.createElement('div');
                      label.className = 'text-blue-400 text-xs font-medium uppercase tracking-wide';
                      label.textContent = 'Note';
                      content.appendChild(label);
                      
                      // Add the annotation text
                      const text = document.createElement('div');
                      text.className = 'text-white/90 font-medium leading-relaxed';
                      text.textContent = annotations[annotationId];
                      content.appendChild(text);
                      
                      // Add a decorative pointer that follows the cursor
                      const pointer = document.createElement('div');
                      pointer.className = 'absolute bottom-0 left-1/2 w-4 h-4 bg-gray-800/95 border-b-2 border-r-2 border-blue-500 transform rotate-45 translate-y-2 -translate-x-1/2 -z-10';
                      
                      tooltip.appendChild(content);
                      tooltip.appendChild(pointer);
                      tooltip.id = 'annotation-tooltip';
                      target.parentNode.appendChild(tooltip);
                    }
                  }}
                  onMouseOut={e => {
                    const tooltip = document.getElementById('annotation-tooltip');
                    if (tooltip) {
                      tooltip.remove();
                    }
                  }}
                />
                {annotationPrompt.show && <AnnotationPrompt />}
                {selectionPopup.show && (
                  <SelectionPopup 
                    text={selectionPopup.text}
                    x={selectionPopup.x}
                    y={selectionPopup.y}
                  />
                )}
              </div>
        </div>
        
  <aside className="w-1/4 bg-gray-800 p-4 rounded-lg overflow-y-auto min-w-[250px] flex flex-col" >
          {/* Watchlist Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Watchlist</h3>
            <ul className="space-y-2">
              {watchlistItems.map((item) => (
                <li 
                  key={item.symbol} 
                  className="flex justify-between items-center p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                  onClick={() => {
                    // Update chart data when watchlist item is clicked
                    const newChartData = generateTickerData(item.price);
                    setData(newChartData);
                    setChartTitle(item.symbol);
                    
                    // Generate a new color based on the trend
                    const strokeColor = item.color === 'green' ? '#22c55e' : '#ef4444';
                    setStroke(strokeColor);
                    
                    showAlert(`Updated chart to show ${item.symbol}`, 'success');
                  }}
                >
                  <div>
                    <span className="font-medium">{item.symbol}</span>
                    <span className="block text-sm text-gray-400">{item.price.toLocaleString()}</span>
                  </div>
                  <div className={`flex items-center ${item.color === 'green' ? 'text-green-400' : 'text-red-400'}`}>
                    {item.color === 'green' ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                    <span>{item.change > 0 ? '+' : ''}{item.change}%</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Annotations Section */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Annotations</h3>
            <div className="space-y-2">
              {Object.entries(annotations).length === 0 ? (
                <div className="p-3 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-300 font-medium mb-2">
                    No annotations yet. Select text and use the Annotate option to add notes.
                  </div>
                </div>
              ) : (
                Object.entries(annotations).map(([id, text]) => (
                  <div 
                    key={id}
                    className="p-3 bg-gray-700 rounded-lg group hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                    onClick={() => {
                      // Find and scroll to the annotated text
                      const annotatedElement = document.querySelector(`[data-annotation-id="${id}"]`);
                      if (annotatedElement) {
                        // Add keyframe animation style if it doesn't exist
                        if (!document.getElementById('annotation-highlight-style')) {
                          const style = document.createElement('style');
                          style.id = 'annotation-highlight-style';
                          style.textContent = `
                            @keyframes annotation-pulse {
                              0% { 
                                background-color: rgba(59, 130, 246, 0.2);
                                box-shadow: 0 0 0 rgba(59, 130, 246, 0.4);
                              }
                              50% { 
                                background-color: rgba(59, 130, 246, 0.4);
                                box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
                              }
                              100% { 
                                background-color: rgba(59, 130, 246, 0.2);
                                box-shadow: 0 0 0 rgba(59, 130, 246, 0.4);
                              }
                            }
                          `;
                          document.head.appendChild(style);
                        }

                        // Add highlight and animation effect
                        annotatedElement.className = 'relative group cursor-help border-b border-dotted border-blue-400 bg-blue-500/30';
                        annotatedElement.style.animation = 'annotation-pulse 2s ease-in-out infinite';
                        annotatedElement.style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
                        annotatedElement.style.borderRadius = '4px';
                        annotatedElement.style.padding = '0 4px';
                        annotatedElement.style.margin = '0 -4px';
                        
                        // Scroll into view with offset for better visibility
                        annotatedElement.scrollIntoView({
                          behavior: 'smooth',
                          block: 'center'
                        });
                        
                        // Remove animation and restore original style after delay
                        setTimeout(() => {
                          annotatedElement.style.animation = '';
                          annotatedElement.className = 'relative group cursor-help border-b border-dotted border-blue-400';
                          annotatedElement.style.backgroundColor = '';
                          annotatedElement.style.borderRadius = '';
                          annotatedElement.style.padding = '';
                          annotatedElement.style.margin = '';
                        }, 4000); // Extended duration for more visibility
                      }
                    }}
                  >
                    <div className="text-sm text-gray-300 font-medium line-clamp-2">
                      {text}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Snippets Section */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Snippets</h3>
            <div className="space-y-2">
              {snippets.length === 0 ? (
                <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                  <div className="text-sm text-gray-300 font-medium mb-2">
                    No snippets saved yet. Select text from the article and use the Save Snippet option to create snippets.
                  </div>
                </div>
              ) : (
                snippets.map(snippet => (
                  <div 
                    key={snippet.id} 
                    className="p-3 bg-gray-700 rounded-lg group hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                    onClick={() => {
                      // Find the text in the article
                      const articleDiv = document.querySelector('.prose');
                      if (articleDiv) {
                        const textNodes = [];
                        const walkNodes = (node) => {
                          if (node.nodeType === Node.TEXT_NODE) {
                            textNodes.push(node);
                          } else {
                            node.childNodes.forEach(walkNodes);
                          }
                        };
                        walkNodes(articleDiv);
                        
                        // Find the node containing our text
                        for (let node of textNodes) {
                          const text = node.textContent;
                          const index = text.indexOf(snippet.text);
                          if (index !== -1) {
                            // Create a highlight span
                            const span = document.createElement('span');
                            span.textContent = snippet.text;
                            span.className = 'relative animate-pulse bg-yellow-500/40 transition-all duration-300';
                            // Add a glowing effect
                            span.style.animation = 'highlight-pulse 2s ease-in-out';
                            // Add the keyframe animation
                            const style = document.createElement('style');
                            style.textContent = `
                              @keyframes highlight-pulse {
                                0% { background-color: rgba(234, 179, 8, 0.4); box-shadow: 0 0 10px rgba(234, 179, 8, 0.4); }
                                50% { background-color: rgba(234, 179, 8, 0.6); box-shadow: 0 0 20px rgba(234, 179, 8, 0.6); }
                                100% { background-color: rgba(234, 179, 8, 0.4); box-shadow: 0 0 10px rgba(234, 179, 8, 0.4); }
                              }
                            `;
                            document.head.appendChild(style);
                            
                            // Split the text node and insert our highlight
                            const before = text.substring(0, index);
                            const after = text.substring(index + snippet.text.length);
                            
                            const fragment = document.createDocumentFragment();
                            if (before) fragment.appendChild(document.createTextNode(before));
                            fragment.appendChild(span);
                            if (after) fragment.appendChild(document.createTextNode(after));
                            
                            node.parentNode.replaceChild(fragment, node);
                            
                            // Scroll the span into view
                            span.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            
                            // Remove the highlight after a delay
                            setTimeout(() => {
                              // Only remove if the span still exists
                              if (span.parentNode) {
                                const text = span.textContent;
                                span.parentNode.replaceChild(document.createTextNode(text), span);
                              }
                            }, 2000);
                            
                            break;
                          }
                        }
                      }
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-gray-300 font-medium line-clamp-2 flex-1">
                        {snippet.text}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent snippet click when deleting
                          setSnippets(prev => prev.filter(s => s.id !== snippet.id));
                        }}
                        className="opacity-0 group-hover:opacity-100 ml-2 text-gray-500 hover:text-red-400 transition-all"
                      >
                        ×
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(snippet.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Companies Section */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Companies</h3>
            <div className="space-y-3">
              {companies.map((company) => (
                <div 
                  key={company.name} 
                  ref={el => {
                    // Only set the ref for the currently hovered company
                    if (companyModal.company?.name === company.name) {
                      activeCardRef.current = el;
                    }
                  }}
                  className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  onMouseEnter={(e) => {
                    const sentences = findCompanySentences(articleContent, company.name);
                    setCompanyModal({
                      show: true,
                      company: { ...company, sentences },
                      x: e.currentTarget.offsetLeft,
                      y: e.currentTarget.offsetTop
                    });
                  }}
                  onMouseLeave={() => {
                    // Add a small delay to allow moving cursor to modal
                    setTimeout(() => {
                      const modalElement = document.querySelector('.modal-hover-zone');
                      if (!modalElement?.matches(':hover')) {
                        setCompanyModal(prev => ({ ...prev, show: false }));
                      }
                    }, 100);
                  }}>
                  {/* Header with Name and Rating */}
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-white text-base text-sm">{company.name}</h4>
                    {company.rating !== "Not Rated" && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        company.rating === "Overweight" ? 'bg-green-900 text-green-300' : 
                        company.rating === "Underweight" ? 'bg-red-900 text-red-300' : 
                        'bg-gray-600 text-gray-300'
                      }`}>
                        {company.rating}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 mb-3">{company.type}</div>
                  
                  {/* Target Price and Chart */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm">
                      <span className="text-gray-400">Target: </span>
                      <span className="text-blue-400">{company.targetPrice || 'Not Rated'}</span>
                    </div>
                    <div className="w-24 h-12">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={(() => {
                            // Use company name as seed for consistent randomization
                            let seedValue = company.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                            const rand = (min, max) => {
                              seedValue = (seedValue * 9301 + 49297) % 233280;
                              const x = seedValue / 233280;
                              return min + x * (max - min);
                            };
                            
                            // Generate different patterns based on company type
                            const baseValue = rand(50, 150);
                            const volatility = company.type.includes('AI') ? 0.15 : 0.08;
                            const trend = company.rating === "Overweight" ? 0.05 : 
                                        company.rating === "Underweight" ? -0.05 : 0;
                            
                            let value = baseValue;
                            return [...Array(10)].map((_, i) => {
                              value *= (1 + (rand(-1, 1) * volatility) + trend);
                              return {
                                name: i,
                                value: value
                              };
                            });
                          })()}
                        >
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={company.rating === "Overweight" ? "#22c55e" : 
                                   company.rating === "Underweight" ? "#ef4444" : 
                                   "#3b82f6"}
                            strokeWidth={1.5}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Key Products */}
                  {(company.products || company.keyProducts) && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-400 mb-1">Products</div>
                      <div className="flex flex-wrap gap-2">
                        {(company.products || company.keyProducts || []).map((product, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-gray-600 rounded-full text-gray-300">
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Analyst Section */}
                  {company.analysts && company.analysts[0] && (
                    <div className="text-xs border-t border-gray-600 pt-2">
                      <div className="flex items-center gap-2">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(company.analysts[0].name)}&background=random&color=fff&size=32`}
                          alt={company.analysts[0].name}
                          className="w-6 h-6 rounded-full"
                        />
                        <div className="text-gray-300">{company.analysts[0].name}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
      
      {/* Company Modal */}
      {companyModal.show && companyModal.company && (
        <div className="modal-hover-zone">
          <CompanyModal 
            company={companyModal.company}
            x={companyModal.x}
            y={companyModal.y}
          />
        </div>
      )}
    </div>
  );
};

export default TradingDashboard;