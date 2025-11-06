import InTheNewsPanel from './components/InTheNewsPanel';
import React, { useState, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TabServerTransport } from '@mcp-b/transports';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Sun, Moon, Search } from 'lucide-react';
import initialArticleContent from './initialArticleContent';
import realisticArticleContent from './realisticArticleContent';
import companies from './companies';
import AnnotationsPanel from './components/AnnotationsPanel';
import AnnotationPrompt from './components/AnnotationPrompt';
import SnippetsPanel from './components/SnippetsPanel';
import WatchlistPanel from './components/WatchlistPanel';
import ArticleOverview from './components/ArticleOverview';
import ArticleActions from './components/ArticleActions';
import ArticleSidePanel from './components/ArticleSidePanel';
import RelatedArticlesPanel from './components/RelatedArticlesPanel';
import CompanyModal from './components/CompanyModal';
import ArticlePreviewCard from './components/ArticlePreviewCard';
import RecommendedArticlesDialog from './components/RecommendedArticlesDialog';
import CompanyPerformanceChart from './components/CompanyPerformanceChart';
import useReadSections from './hooks/useReadSections';
import MarketsGraph from "./components/MarketsGraph";
import './theme.css';

const TradingDashboard = () => {
 

  // Helper to scroll to annotation from sidebar
  function scrollToAnnotationSidebar(id) {
    const element = document.querySelector(`[data-annotation-id="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('bg-blue-500/20');
      setTimeout(() => {
        element.classList.remove('bg-blue-500/20');
      }, 2000);
    }
  }

  // Google Analytics event utility
  const trackGAEvent = (event, params = {}) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, params);
    }
  };
  // Google Analytics Tracking
  useEffect(() => {
    // Only inject once
    if (!window.gtagScriptInjected) {
      const scriptTag = document.createElement('script');
      scriptTag.async = true;
      scriptTag.src = 'https://www.googletagmanager.com/gtag/js?id=G-H401YQY16V';
      document.head.appendChild(scriptTag);

      const inlineScript = document.createElement('script');
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-H401YQY16V');
      `;
      document.head.appendChild(inlineScript);
      window.gtagScriptInjected = true;
    }
  }, []);
  // Current user
  const currentUser = {
    id: 1,
    name: 'Brian Scott',
    avatar: 'BS',
    role: 'Analyst'
  };
  // Related articles state
  const [relatedArticles] = useState([
    {
      id: 1,
      title: "NVIDIA's AI Infrastructure Expansion: Impact on Market Dynamics",
      summary: "Analysis of NVIDIA's strategic infrastructure investments and their implications for AI chip market leadership.",
      category: "Technology",
      readingTime: 8,
      date: "October 12, 2025"
    },
    {
      id: 2,
      title: "Anthropic's Claude 3: A New Era in Language Models",
      summary: "Examining Anthropic's latest LLM release and its competitive positioning against GPT-4.",
      category: "AI Research",
      readingTime: 10,
      date: "October 11, 2025"
    },
    {
      id: 3,
      title: "Meta's AI Strategy: Balancing Open Source and Proprietary Models",
      summary: "Deep dive into Meta's dual-track approach to AI development and market implications.",
      category: "Strategy",
      readingTime: 15,
      date: "October 9, 2025"
    }
  ]);

  // Market news state
  const [activeMarketNews, setActiveMarketNews] = useState(null);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Apply theme changes when isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  // Alert state
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [recommendedArticles, setRecommendedArticles] = useState({ show: false, articles: [], searchContext: '' });

  // Show alert message function
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    // Auto hide after 5 seconds
    setTimeout(() => {
      setAlert({ show: false, message: '', type: 'success' });
    }, 2500);
  };

  // Article content state
  const processArticleContent = (content, readSections = {}) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    // Market competition news examples
    const marketNews = [
      {
        id: 'claude-competition',
        title: "Claude Opus 4.1 achieves 47.6% win rate against human experts",
        section: 'market-competition',
        content: "Notable competition from Anthropic's Claude Opus 4.1 (47.6% win/tie rate)",
        url: '#market-competition'
      },
      {
        id: 'nvidia-partnership',
        title: "OpenAI signs $100bn NVIDIA partnership for computing expansion",
        section: 'infrastructure-expansion',
        content: "$100bn strategic partnership with NVIDIA for 10GW computing systems deployment",
        url: '#infrastructure-expansion'
      }
    ];

    // Function to check if section is in view
    const checkMarketNewsVisibility = () => {
      const sections = marketNews.map(news => doc.getElementById(news.section));
      const visibleSection = sections.find(section => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight;
      });
      
      if (visibleSection) {
        const relevantNews = marketNews.find(news => news.section === visibleSection.id);
        setActiveMarketNews(relevantNews);
      } else {
        setActiveMarketNews(null);
      }
    };

    // Add scroll event listener for market news detection
    window.addEventListener('scroll', checkMarketNewsVisibility);

    // Find all h3 and h4 titles and add indicators
    const titles = doc.querySelectorAll('h3:not(.text-4xl), h4');
    titles.forEach(title => {
      // Skip the main article title
      if (title.textContent.trim() === "OpenAI Market Analysis Report") return;
      
      // Find the section ID from the parent div
      const sectionDiv = title.closest('div[id]');
      const sectionId = sectionDiv ? sectionDiv.id : '';
      const isRead = readSections[sectionId] || false;
      
      const iconSpan = doc.createElement('span');
      iconSpan.className = 'inline-flex items-center ml-2';
      iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${isRead ? 'text-green-400' : 'text-gray-500/50'} transition-colors duration-300"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
      title.appendChild(iconSpan);
    });

    return doc.body.innerHTML;
  };

    // Table of Contents state
  const [tableOfContents, setTableOfContents] = useState([
    { id: 'executive-summary', title: 'Executive Summary', level: 1 },
    { id: 'infrastructure-expansion', title: 'Infrastructure Expansion', level: 1 },
    { id: 'product-innovation', title: 'Product Innovation', level: 1 },
    { id: 'market-competition', title: 'Market Competition', level: 1 },
    { id: 'financial-projections', title: 'Financial Projections', level: 1 },
    { id: 'market-position-strategy', title: 'Market Position & Strategy', level: 1 },
    { id: 'risks-challenges', title: 'Risks & Challenges', level: 1 }
  ]);
  
  
  const [isTocOpen, setIsTocOpen] = useState(false);


  // Toggle for article type
  const [articleType, setArticleType] = useState('original'); // 'summarised' or 'original'
  const [articleContent, setArticleContent] = useState(() => {
    return processArticleContent(realisticArticleContent.html, {});
  });


  // Track read sections
  const readSections = useReadSections(tableOfContents);

  // Update article content when sections are read
  useEffect(() => {
    const contentSource = articleType === 'summarised' ? initialArticleContent.html : realisticArticleContent.html;
    setArticleContent(processArticleContent(contentSource, readSections));
  }, [readSections, articleType]);
  const [annotations, setAnnotations] = useState({});
  const [snippets, setSnippets] = useState([]);

  
  // Effect to highlight company names whenever article content changes
  React.useEffect(() => {
    highlightTermInArticle();
  }, []); // Run once on mount
  const [annotationPrompt, setAnnotationPrompt] = useState({ show: false, text: '', range: null });

  // Related articles state

  const handleArticleClick = (article) => {
    if (article === 'viewOpenAI') {
      showAlert('Redirecting to OpenAI research collection...', 'info');
      return;
    }
    if (article === 'viewAuthor') {
      showAlert(`Redirecting to ${articleOverview.author}'s research...`, 'info');
      return;
    }
    showAlert(`Opening article: ${article.title}`, 'info');
  };

  // Article overview state
  const [articleOverview] = useState({
    title: "Key Details",
    subtitle: "Comprehensive review of OpenAI's market position and future outlook",
    date: "October 10, 2025",
    readingTime: 12,
  author: "Brenda Duverce",
    category: "Technology",
    keyStats: [
      { label: "2030 Revenue Target", value: "$200B", trend: "up" },
      { label: "5 Year CAGR", value: "73%", trend: "up" },
      { label: "4 Year Burn", value: "$115B", trend: "down" }
    ]
  });
  const [selectionPopup, setSelectionPopup] = useState({
    show: false,
    text: '',
    summary: '',
    x: 0,
    y: 0
  });
  
  const [companyModal, setCompanyModal] = useState({
    show: false,
    company: null
  });
  const activeCardRef = useRef(null);
  const closeTimerRef = useRef(null);

  // Function to clear any existing close timer
  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  // Function to start close timer
  const startCloseTimer = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setCompanyModal(prev => ({ ...prev, show: false }));
    }, 1000);
  };

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
          span.className = 'relative group cursor-pointer bg-blue-500/20 rounded-md px-1 transition-all duration-200 ring-2 ring-blue-400/40 hover:bg-blue-500/30';
          span.setAttribute('data-annotation-id', annotationId);
          span.setAttribute('role', 'button');
          span.setAttribute('tabindex', '0');
          span.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Get the annotation data
            const annotation = annotations[annotationId];
            // Show annotation prompt with existing text
            setAnnotationPrompt({
              show: true,
              text: typeof annotation === 'string' ? annotation : annotation.text,
              selectedText: text,
              editingId: annotationId
            });
          };
          // Add author avatar icon absolutely to the left
          const avatar = document.createElement('img');
          avatar.src = `https://ui-avatars.com/api/?name=Brian+Scott&background=0D8ABC&color=fff&size=20`;
          avatar.alt = 'Brian Scott';
          avatar.className = 'absolute -left-8 top-0 w-5 h-5 rounded-full border-2 border-blue-400 shadow pointer-events-none';
          span.appendChild(avatar);
          // No padding on the span, let avatar overlay
          const textNode = document.createTextNode(text);
          span.appendChild(textNode);
          node.parentNode.insertBefore(span, node);
          
          if (after) {
            node.parentNode.insertBefore(document.createTextNode(after), node);
          }
          
          // Remove the original text node
          node.parentNode.removeChild(node);
          
          // Store the annotation with metadata, including viewType
          setAnnotations(prev => ({
            ...prev,
            [annotationId]: {
              text: annotation,
              user: currentUser,
              timestamp: new Date().toISOString(),
              viewType: articleType
            }
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
  
  const [data, setData] = useState([
    { time: '19:00', value: 5458 },
    { time: '20:00', value: 5462 },
    { time: '21:00', value: 5470 },
    { time: '22:00', value: 5460 },
    { time: '23:00', value: 5468 },
  ]);

  // const indices = [
  //   { name: 'S&P 500', value: 5464.61, change: -0.16, color: 'red', flag: '🇺🇸' },
  //   { name: 'Nasdaq 100', value: 19700.43, change: -0.26, color: 'red', flag: '🇺🇸' },
  //   { name: 'Dow 30', value: 39150.34, change: 0.04, color: 'green', flag: '🇺🇸' },
  //   { name: 'Nikkei 225', value: 38596.40, change: -0.09, color: 'red', flag: '🇯🇵' },
  // ];
  const [title, setTitle] = useState('OpenAI Market Analysis Report');
  // Set initial watchlist to 3 non-private companies with their target prices
  const nonPrivateCompanies = companies.filter(c => !c.isPrivate).slice(0, 3);
  const initialWatchlist = nonPrivateCompanies.map(company => ({
    symbol: company.name.toUpperCase(),
    price: parseFloat((company.targetPrice || '').replace(/[^\d.]/g, '')) || 0,
    change:
      company.rating === 'Overweight' ? 10 :
      company.rating === 'Underweight' ? -10 :
      (Math.round((Math.random() * 4 - 2) * 100) / 100), // Neutral: random between -2 and +2
    color:
      company.rating === 'Overweight' ? 'green' :
      company.rating === 'Underweight' ? 'red' : 'amber'
  }));
  const [watchlistItems, setWatchlistItems] = useState(initialWatchlist);
  // Set initial stroke color based on first company trend
  let initialStroke = '#f59e42'; // amber
  if (initialWatchlist.length > 0) {
    const firstCompany = companies.find(c => c.name.toUpperCase() === initialWatchlist[0].symbol);
    let trend = 'neutral';
    if (firstCompany) {
      if (firstCompany.trend) trend = firstCompany.trend;
      else if (firstCompany.rating === 'Overweight') trend = 'up';
      else if (firstCompany.rating === 'Underweight') trend = 'down';
    }
    if (trend === 'up') initialStroke = '#22c55e';
    else if (trend === 'down') initialStroke = '#ef4444';
  }
  const [stroke, setStroke] = useState(initialStroke);
  const [chartTitle, setChartTitle] = useState(watchlistItems.length > 0 ? watchlistItems[0].symbol : '');

  // Keep chartTitle in sync with watchlistItems
  useEffect(() => {
    if (watchlistItems.length === 0) {
      setChartTitle('');
    } else if (!watchlistItems.find(item => item.symbol === chartTitle)) {
      setChartTitle(watchlistItems[0].symbol);
    }
  }, [watchlistItems]);
  // Server and transport initialization
  const server = new McpServer({
    name: 'trading-server',
    version: '1.0.0'
  });
  // Register the tools available on this page.
  server.tool('toggleDayNightMode', 'Toggle day/night reading mode for comfortable reading and visual impairment', {}, async () => {
    // Instantly update body class for immediate feedback
    if (isDarkMode) {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    }
    setIsDarkMode(prev => !prev);
    return { content: [{ type: 'text', text: `Day/Night mode toggled for comfortable reading.` }] };
  });
  server.tool('setNightMode', 'Set night dark reading mode for comfortable reading and visual impairment', {}, async () => {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    setIsDarkMode(true);
    return { content: [{ type: 'text', text: `Night mode toggled for comfortable reading.` }] };
  });
  server.tool('setDayMode', 'Set day light reading mode for comfortable reading and visual impairment', {}, async () => {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    setIsDarkMode(false);
    return { content: [{ type: 'text', text: `Day mode toggled for comfortable reading.` }] };
  });

  server.tool('updateGraphForTicker', 'Update the graph data and stroke color for a ticker', {
    ticker: z.string()
  }, async ({ ticker }) => {
      trackGAEvent('server_tool_execution', { tool: 'updateGraphForTicker', ticker });
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
      trackGAEvent('server_tool_execution', { tool: 'changeTitle', title });
    setTitle(title);
    showAlert('Title has been updated successfully', 'success');
    return { content: [{ type: 'text', text: "Title has been updated."}] };
  });

  // Function to generate random price data for a ticker
  // Modified: Accepts rating, makes x axis data green and ends with an increase if overweight
  const generateTickerData = (basePrice, rating) => {
    const hourlyData = [];
    let currentPrice = basePrice;
    for (let i = 19; i <= 23; i++) {
      let change = 0;
      if (rating === 'Overweight') {
        if (i === 23) {
          // Ensure last value is higher than base
          change = Math.abs(Math.random() * 0.03 * basePrice) + 0.01 * basePrice;
        } else {
          change = (Math.random() - 0.3) * 0.02 * basePrice; // bias up
        }
      } else {
        change = (Math.random() - 0.5) * 0.02 * basePrice;
      }
      currentPrice += change;
      if (i === 23 && rating === 'Overweight' && currentPrice <= basePrice) {
        currentPrice = basePrice + Math.abs(Math.random() * 0.03 * basePrice) + 0.01 * basePrice;
      }
      hourlyData.push({
        time: `${i}:00`,
        value: Math.round(currentPrice * 100) / 100,
        color: rating === 'Overweight' ? '#22c55e' : undefined // green for overweight
      });
    }
    return hourlyData;
  };

// Tool to scroll up or down a full page
  server.tool('scrollPage', 'Scroll the page up or down by one viewport height', {
    direction: z.enum(['up', 'down'])
  }, async ({ direction }) => {
    const scrollAmount = window.innerHeight;
    if (direction === 'down') {
      window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
    }
    return { content: [{ type: 'text', text: `Scrolled ${direction} by one page.` }] };
  });
  // Tool for auto-scroll with adjustable speed
  server.tool('autoScroll', 'Automatically scroll the page up or down at a specified speed (slow, normal, fast)', {
    direction: z.enum(['up', 'down']),
    speed: z.enum(['slow', 'normal', 'fast'])
  }, async ({ direction, speed }) => {
    // Speed mapping in pixels per interval
    const speedMap = {
      slow: 2,
      normal: 6,
      fast: 16
    };
    const scrollStep = speedMap[speed] || 6;
    const intervalMs = 16; // ~60fps
    let stopped = false;
    // Stop any previous auto-scroll
    if (window.__autoScrollInterval) {
      clearInterval(window.__autoScrollInterval);
      window.__autoScrollInterval = null;
    }
    // Start auto-scroll
    window.__autoScrollInterval = setInterval(() => {
      if (stopped) return;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      let nextScroll;
      if (direction === 'down') {
        nextScroll = Math.min(currentScroll + scrollStep, maxScroll);
        window.scrollTo({ top: nextScroll, behavior: 'auto' });
        if (nextScroll >= maxScroll) {
          stopped = true;
          clearInterval(window.__autoScrollInterval);
          window.__autoScrollInterval = null;
        }
      } else {
        nextScroll = Math.max(currentScroll - scrollStep, 0);
        window.scrollTo({ top: nextScroll, behavior: 'auto' });
        if (nextScroll <= 0) {
          stopped = true;
          clearInterval(window.__autoScrollInterval);
          window.__autoScrollInterval = null;
        }
      }
    }, intervalMs);
    // Provide a way to stop auto-scroll externally
    window.__stopAutoScroll = () => {
      stopped = true;
      if (window.__autoScrollInterval) {
        clearInterval(window.__autoScrollInterval);
        window.__autoScrollInterval = null;
      }
    };
    return { content: [{ type: 'text', text: `Auto-scroll started (${direction}, ${speed}). Call window.__stopAutoScroll() to stop.` }] };
  });

   // Tool to stop auto-scroll
  server.tool('stopAutoScroll', 'Stop any ongoing auto-scroll on the page', {}, async () => {
    if (typeof window.__stopAutoScroll === 'function') {
      window.__stopAutoScroll();
      return { content: [{ type: 'text', text: 'Auto-scroll stopped.' }] };
    } else {
      return { content: [{ type: 'text', text: 'No auto-scroll in progress.' }] };
    }
  });
  // Helper to highlight snippet from sidebar
  function highlightSnippetSidebar(snippet) {
    const content = document.querySelector('.prose');
    if (content) {
      const textNodes = [];
      const walk = document.createTreeWalker(
        content,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      let node;
      while (node = walk.nextNode()) {
        textNodes.push(node);
      }
      for (let node of textNodes) {
        if (node.textContent.includes(snippet.text)) {
          node.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          node.parentElement.classList.add('bg-blue-500/20');
          setTimeout(() => {
            node.parentElement.classList.remove('bg-blue-500/20');
          }, 2000);
          break;
        }
      }
    }
  }

  server.tool('addToWatchlist', 'Add a new stock ticker to the watchlist', {
    ticker: z.string()
  }, async ({ ticker }) => {
      trackGAEvent('server_tool_execution', { tool: 'addToWatchlist', ticker });
    console.log('addToWatchlist called with ticker:', ticker);
    // Generate new ticker data
    const price = Math.round(Math.random() * 100000) / 100;
    const change = Math.round((Math.random() * 4 - 2) * 100) / 100;
    const color = change >= 0 ? 'green' : 'red';
    // Find company rating and trend if available
    let rating = 'Neutral';
    let trend = 'neutral';
    const company = companies.find(c => c.name.toUpperCase() === ticker.toUpperCase());
    if (company) {
      if (company.rating) rating = company.rating;
      if (company.trend) trend = company.trend;
      else if (company.rating === 'Overweight') trend = 'up';
      else if (company.rating === 'Underweight') trend = 'down';
      else trend = 'neutral';
    }
    const newChartData = generateTickerData(price, rating);
    setData(newChartData);
    // Set stroke color based on trend
    let strokeColor = '#f59e42'; // amber
    if (trend === 'up') strokeColor = '#22c55e';
    else if (trend === 'down') strokeColor = '#ef4444';
    setStroke(strokeColor);
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
      trackGAEvent('server_tool_execution', { tool: 'removeFromWatchlist', ticker });
    setWatchlistItems(prev => prev.filter(item => item.symbol !== ticker));
    return { content: [{ type: 'text', text: `Removed ${ticker} from watchlist.` }] };
  });

  server.tool('clearWatchlist', 'Remove all stock tickers from the watchlist', {
  }, async () => {
    trackGAEvent('server_tool_execution', { tool: 'clearWatchlist' });
    setWatchlistItems([]);
    return { content: [{ type: 'text', text: 'Successfully cleared watchlist.' }] };
  });

  server.tool('subscribeToAuthor', 'Subscribe to the article author', {
  }, async () => {
    trackGAEvent('server_tool_execution', { tool: 'subscribeToAuthor' });
    showAlert('You have now been subscribed to the author of this article', 'success');
    return { content: [{ type: 'text', text: 'Successfully subscribed to author.' }] };
  });

  server.tool('saveArticle', 'Save article to Read Later collection', {
  }, async () => {
    trackGAEvent('server_tool_execution', { tool: 'saveArticle' });
    trackGAEvent('article_action', { action: 'save' });
    showAlert('This article has been added to your Read Later collection', 'success');
    return { content: [{ type: 'text', text: 'Article saved to Read Later collection.' }] };
  });

  server.tool('emailArticle', 'Email article to user', {
  }, async () => {
    trackGAEvent('server_tool_execution', { tool: 'emailArticle' });
    trackGAEvent('article_action', { action: 'email' });
    showAlert('This article has been delivered to your inbox', 'success');
    return { content: [{ type: 'text', text: 'Article sent to email.' }] };
  });

  server.tool('getRecommendedArticles', 'Get article recommendations based on current content', {
  }, async () => {
    // Extract relevant context from the current article
    const visibleCompanyNames = companies
      .filter(company => articleContent.toLowerCase().includes(company.name.toLowerCase()))
      .map(company => company.name);

    // Get visible section headers for topics/categories
    const headers = document.querySelectorAll('.prose h3, .prose h4');
    const visibleTopics = Array.from(headers)
      .filter(header => {
        const rect = header.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight;
      })
      .map(header => header.textContent);

    // Create search context description
    const searchContext = [
      visibleCompanyNames.length > 0 && `Companies: ${visibleCompanyNames.join(', ')}`,
      visibleTopics.length > 0 && `Topics: ${visibleTopics.join(', ')}`
    ].filter(Boolean).join(' | ');

    // Generate mock recommended articles based on context
    const recommendedArticles = [
      {
        title: `${visibleCompanyNames[0] || 'Industry'} Market Analysis: Latest Trends and Insights`,
        date: 'Oct 14, 2025',
        authors: ['Michael Chen'],
        type: 'Analysis'
      },
      {
        title: `${visibleTopics[0] || 'Market'} Deep Dive: Opportunities and Challenges`,
        date: 'Oct 13, 2025',
        authors: ['Sarah Anderson'],
        type: 'Research'
      },
      {
        title: `Competitive Landscape: ${visibleCompanyNames.slice(0, 2).join(' vs ')}`,
        date: 'Oct 12, 2025',
        authors: ['David Thompson'],
        type: 'Industry Report'
      },
      {
        title: `${visibleTopics[1] || 'Strategic'} Outlook 2026: Key Predictions`,
        date: 'Oct 11, 2025',
        authors: ['Emma Rodriguez'],
        type: 'Forecast'
      }
    ];

    // Show the recommendations dialog
    setRecommendedArticles({
      show: true,
      articles: recommendedArticles,
      searchContext
    });

    return { 
      content: [{ 
        type: 'text', 
        text: `Found 4 relevant articles based on current content. Context: ${searchContext}` 
      }] 
    };
  });

  server.tool('showCompany', 'Show company profile preview', {
    companyName: z.string()
  }, async ({ companyName }) => {
    console.log('showCompany called with:', { companyName });

    // Find the company in our companies array
    let company = Array.isArray(companies) ? companies.find(c => c?.name?.toLowerCase() === companyName.toLowerCase()) : null;
    console.log('Existing company found:', company ? 'yes' : 'no');

    
    // If company not found, generate a fake one
    if (!company) {
      console.log('Generating fake company data...');
      const analysts = [  
        {
          name: "John Smith",
          title: "Research Analyst",
          email: "john.smith@example.com",
          phone: "(1-555) 555-0123"
        }
      ];
      
      // Generate random rating and target price
      const ratings = ["Overweight", "Neutral", "Underweight"];
      const rating = ratings[Math.floor(Math.random() * ratings.length)];
      const targetPrice = "$" + (Math.floor(Math.random() * 900) + 100);
      
      console.log('Generated rating and price:', { rating, targetPrice });
      
      company = {
        name: companyName,
        type: "Emerging Technology",
        analysts,
        rating,
        targetPrice,
        partnerships: [
          {
            partner: "Industry Leader",
            details: "Strategic Partnership",
            value: "$" + (Math.floor(Math.random() * 90) + 10) + "mn"
          }
        ]
      };
    }

    // Clear any active card reference since this is a direct tool call
    activeCardRef.current = null;

    // Show the company preview
    const sentences = findCompanySentences(articleContent, company.name);
    setCompanyModal({
      show: true,
      company: { ...company, sentences }
    });

    return { 
      content: [{ type: 'text', text: `Showing profile for ${company.name}` }]
    };
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
      trackGAEvent('server_tool_execution', { tool: 'highlightArticleContent', term });
      trackGAEvent('highlight_term', { term });
    highlightTermInArticle(term);
    const message = `Highlighted "${term}" in the article`;
     
    return { 
      content: [{ 
        type: 'text', 
        text: message
      }] 
    };
  });

  // State for tracking the currently visible company
  const [visibleCompany, setVisibleCompany] = useState(null);

  // Function to check for companies in viewport
  const checkCompaniesInViewport = () => {
    const articleContainer = document.querySelector('.prose');
    if (!articleContainer) return;

    // Get the viewport dimensions
    const viewportHeight = window.innerHeight;
    const topQuarter = viewportHeight * 0.25;

    // Find all text nodes in the article
    const walker = document.createTreeWalker(
      articleContainer,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let closestCompany = null;
    let closestDistance = Infinity;
    let node;

    while (node = walker.nextNode()) {
      // Check if this text node contains any company names
      for (const company of companies) {
        if (node.textContent.toLowerCase().includes(company.name.toLowerCase())) {
          const rect = node.parentElement.getBoundingClientRect();
          const centerY = rect.top + (rect.height / 2);
          
          // Check if it's in the top quarter of the viewport
          if (centerY > 0 && centerY <= topQuarter) {
            const distanceFromIdeal = Math.abs(centerY - (topQuarter / 2));
            if (distanceFromIdeal < closestDistance) {
              closestDistance = distanceFromIdeal;
              closestCompany = company;
            }
          }
        }
      }
    }

    setVisibleCompany(closestCompany);
  };

  // Add scroll event listener for company detection
  useEffect(() => {
    window.addEventListener('scroll', checkCompaniesInViewport);
    return () => window.removeEventListener('scroll', checkCompaniesInViewport);
  }, []);

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
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">{company.name}</div>
                        <div className="text-xs text-gray-400">{company.type}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showAlert(`Subscribed to ${company.name} updates`, 'success');
                        }}
                        className="px-2 py-1 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-400/10 hover:bg-blue-400/20 rounded transition-colors"
                      >
                        Subscribe
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">

                      <div>
                      {selectionPopup.detectedCompanies.length === 1 && (
                        <div className="mt-2">
                          <div className="text-xs font-semibold text-blue-400 mb-2">Market Performance</div>
                          <CompanyPerformanceChart company={company} />
                        </div>
                      )}

                        {/* Related Research Section */}
                        {selectionPopup.detectedCompanies.length <= 2 && (
                          <div className="mt-2">
                            <div className="text-xs text-blue-400 font-medium uppercase tracking-wide mb-1">Related Research</div>
                            <div className="space-y-2">
                              <ArticlePreviewCard 
                                article={{
                                  title: `${company.name} Q3 2025 Market Analysis: Growth Prospects and Strategic Initiatives`,
                                  date: 'Oct 12, 2025',
                                  authors: ['Sarah Anderson'],
                                  type: 'Research Report'
                                }}
                                onClick={() => {
                                  showAlert('Opening research report...', 'success');
                                }}
                              />
                            </div>
                          </div>
                        )}
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
                  timestamp: new Date().toISOString(),
                  user: currentUser,
                  viewType: articleType
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

  const handleAnnotationSave = (text) => {
    if (annotationPrompt.editingId) {
      // Update existing annotation
      setAnnotations(prev => ({
        ...prev,
        [annotationPrompt.editingId]: {
          text: text,
          user: currentUser,
          timestamp: new Date().toISOString()
        }
      }));
      showAlert('Annotation updated successfully', 'success');
    } else {
      // Add new annotation
      annotateText(annotationPrompt.selectedText, text);
      showAlert('Annotation added successfully', 'success');
    }
    setAnnotationPrompt({ show: false, text: '', range: null, editingId: null });
  };

  const handleAnnotationCancel = () => {
    setAnnotationPrompt({ show: false, text: '', range: null, editingId: null });
  };

  // Function to programmatically show company profile preview
  const showCompanyPreview = (company) => {
    const sentences = findCompanySentences(articleContent, company.name);
    setCompanyModal({
      show: true,
      company: { ...company, sentences }
    });
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
      <header className="p-4 flex items-center justify-between" style={{
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        transition: 'background-color 0.3s ease'
      }}>
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-6">
            {['My Content', 'My Research', 'Economics', 'Market Strategy', 'Rates', 'Equity'].map((item) => (
              <a 
                key={item} 
                href="#" 
                style={{ 
                  color: isDarkMode ? '#9ca3af' : '#4b5563',
                  transition: 'color 0.3s ease'
                }}
                className="hover:text-blue-400 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setIsDarkMode(!isDarkMode);
              trackGAEvent('theme_toggle', { mode: isDarkMode ? 'light' : 'dark' });
            }}
            className={`p-2 rounded-full transition-all duration-200 ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-gray-400 hover:text-yellow-400 transition-colors" />
            ) : (
              <Moon className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors" />
            )}
          </button>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search" 
              style={{
                backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                color: isDarkMode ? '#ffffff' : '#111827',
                transition: 'all 0.3s ease'
              }}
              className="rounded-full py-2 px-4 pl-10 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" 
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
              style={{ 
                color: isDarkMode ? '#9ca3af' : '#4b5563',
                transition: 'color 0.3s ease'
              }}
            />
          </div>
        </div>
      </header>

      {/* Table of Contents Panel */}
      <ArticleSidePanel 
        isOpen={isTocOpen} 
        onClose={() => setIsTocOpen(false)}
        tableOfContents={tableOfContents}
        snippets={snippets}
        annotations={annotations}
        currentUser={currentUser}
        onItemClick={(id) => {
          // Always switch to summarised view before scrolling
          if (articleType !== 'summarised') {
            setArticleType('summarised');
            // Wait for the view to update, then scroll
            setTimeout(() => {
              const element = document.getElementById(id);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                element.classList.add('bg-blue-500/20');
                setTimeout(() => {
                  element.classList.remove('bg-blue-500/20');
                }, 2000);
              }
            }, 300);
          } else {
            const element = document.getElementById(id);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              element.classList.add('bg-blue-500/20');
              setTimeout(() => {
                element.classList.remove('bg-blue-500/20');
              }, 2000);
            }
          }
          setIsTocOpen(false);
        }}
        onSnippetClick={(snippet) => {
          if (snippet.viewType && snippet.viewType !== articleType) {
            setArticleType(snippet.viewType);
            setTimeout(() => {
              highlightSnippetSidebar(snippet);
            }, 300);
          } else {
            highlightSnippetSidebar(snippet);
          }
          setIsTocOpen(false);
        }}
        onAnnotationClick={(id) => {
          const annotation = annotations[id];
          if (annotation && annotation.viewType && annotation.viewType !== articleType) {
            setArticleType(annotation.viewType);
            setTimeout(() => {
              scrollToAnnotationSidebar(id);
            }, 300);
          } else {
            scrollToAnnotationSidebar(id);
          }
          setIsTocOpen(false);
        }}
        // Helper to scroll to annotation from sidebar
      />
      
      <main className="flex-grow p-6 overflow-hidden flex">
        <div className="flex-grow mr-4">
          <h2 className="text-2xl font-semibold mb-6 text-blue-400">{title}</h2>
         
              {/* New reading area with summary */}
              <div className="mt-8">
                {articleType !== 'summarised' && (
                  <ArticleOverview 
                    article={articleOverview}
                  />
                )}

              {/* <IndicesPanel indices={indices} /> */}

                {/* Article action buttons */}
                <ArticleActions 
                  onToggleToc={() => {
                    trackGAEvent('article_options_click', { option: 'toc' });
                    setIsTocOpen(true);
                  }}
                  onSubscribe={() => {
                    showAlert('You have now been subscribed to the author of this article', 'success');
                  }}
                  onSave={() => {
                    trackGAEvent('article_options_click', { option: 'save' });
                    showAlert('This article has been added to your Read Later collection', 'success');
                  }}
                  onEmail={() => {
                    trackGAEvent('article_options_click', { option: 'email' });
                    showAlert('This article has been delivered to your inbox', 'success');
                  }}
                  trackSubscribeClick={(type, name) => {
                    trackGAEvent('subscribe_click', { type, name });
                  }}
                  trackSaveClick={(type, name) => {
                    trackGAEvent('save_article_click', { type, name });
                  }}
                  trackTocClick={(type, name) => {
                    trackGAEvent('toc_open_click', { type, name });
                  }}
                  trackCompanyMentionClick={name => {
                    trackGAEvent('company_mention_click', { name });
                  }}
                  readingTime={articleOverview.readingTime}
                  activeCompany={visibleCompany}
                  activeMarketNews={activeMarketNews}
                  onOpenMarketNews={(news) => {
                    const element = document.getElementById(news.section);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                />
                {/* Article Type Toggle */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs text-gray-400 font-semibold">View:</span>
                  <button
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${articleType === 'original' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white'}`}
                    onClick={() => setArticleType('original')}
                  >
                    Original
                  </button>
                  <button
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      articleType === 'summarised'
                        ? 'bg-blue-600 text-white'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-blue-600 hover:text-white'
                    }`}
                    onClick={() => setArticleType('summarised')}
                  >
                    Summarised
                  </button>
                </div>
                <div className="article-content">
                  {/* Main Article Content */}
                  <div 
                    onMouseUp={handleTextSelection}
                    dangerouslySetInnerHTML={{ __html: articleContent }}
                    className="prose prose-invert max-w-none relative mb-12"
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
                      text.textContent = annotations[annotationId].text;
                      content.appendChild(text);

                      // Add author and date/time details
                      const meta = document.createElement('div');
                      meta.className = 'text-xs text-gray-400 mt-1 flex gap-2 items-center';
                      // Use annotation user if available, else fallback
                      const author = (annotations[annotationId].user && annotations[annotationId].user.name) ? annotations[annotationId].user.name : 'Brian Scott';
                      // Format date/time
                      let dateStr = '';
                      if (annotations[annotationId].timestamp) {
                        const d = new Date(annotations[annotationId].timestamp);
                        dateStr = d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                      }
                      meta.innerHTML = `<span>By <span class="font-semibold text-blue-300">${author}</span></span>${dateStr ? `<span>•</span><span>${dateStr}</span>` : ''}`;
                      content.appendChild(meta);

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
                  
                  {/* Related Articles Panel */}
                  <RelatedArticlesPanel 
                    articles={relatedArticles}
                    onArticleClick={handleArticleClick}
                    currentUser={currentUser}
                  />

                  {/* Graph and Watchlist Panel moved below article content */}
                  <MarketsGraph
                    chartTitle={chartTitle}
                    data={data}
                    stroke={stroke}
                    watchlistItems={watchlistItems}
                    onWatchlistItemClick={(item) => {
                      // Find company rating and trend if available
                      let rating = 'Neutral';
                      let trend = 'neutral';
                      const company = companies.find(c => c.name.toUpperCase() === item.symbol.toUpperCase());
                      if (company) {
                        if (company.rating) rating = company.rating;
                        if (company.trend) trend = company.trend;
                        else if (company.rating === 'Overweight') trend = 'up';
                        else if (company.rating === 'Underweight') trend = 'down';
                        else trend = 'neutral';
                      }
                      const newChartData = generateTickerData(item.price, rating);
                      setData(newChartData);
                      setChartTitle(item.symbol);
                      // Set stroke color based on trend
                      let strokeColor = '#f59e42'; // amber
                      if (trend === 'up') strokeColor = '#22c55e';
                      else if (trend === 'down') strokeColor = '#ef4444';
                      setStroke(strokeColor);
                      showAlert(`Updated chart to show ${item.symbol}`, 'success');
                    }}
                  />
                </div>
                
                {annotationPrompt.show && (
                  <AnnotationPrompt 
                    annotationPrompt={annotationPrompt}
                    onSave={handleAnnotationSave}
                    onCancel={handleAnnotationCancel}
                    currentUser={currentUser}
                  />
                )}
                {selectionPopup.show && (
                  <SelectionPopup 
                    text={selectionPopup.text}
                    x={selectionPopup.x}
                    y={selectionPopup.y}
                  />
                )}
              </div>
        </div>

  <aside className="w-1/4 bg-gray-800 p-4 mt-16 rounded-lg overflow-y-auto min-w-[250px] flex flex-col" >


          {/* Annotations Section */}
          <AnnotationsPanel 
            annotations={annotations} 
            currentUser={currentUser}
            onAnnotationClick={(id) => {
              const annotatedElement = document.querySelector(`[data-annotation-id="${id}"]`);
              if (annotatedElement) {
                annotatedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                annotatedElement.classList.add('bg-blue-500/30');
                setTimeout(() => annotatedElement.classList.remove('bg-blue-500/30'), 2000);
              }
            }}
            onAnnotationEdit={(id, text) => {
              const element = document.querySelector(`[data-annotation-id="${id}"]`);
              if (element) {
                setAnnotationPrompt({
                  show: true,
                  text: text,
                  selectedText: element.textContent,
                  editingId: id
                });
              }
            }}
          />

          {/* Snippets Section */}
          <SnippetsPanel 
            snippets={snippets}
            currentUser={currentUser}
            onSnippetClick={(selectedSnippet) => {
              // Find the text in the article
              const articleDiv = document.querySelector('.prose');
              if (articleDiv) {
                // Clear any existing highlights
                document.querySelectorAll('.snippet-highlight').forEach(el => {
                  const parent = el.parentNode;
                  parent.replaceChild(document.createTextNode(el.textContent), el);
                });

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
                  const index = text.indexOf(selectedSnippet.text);
                  if (index !== -1) {
                    // Create a highlight span
                    const span = document.createElement('span');
                    span.className = 'snippet-highlight bg-yellow-300 bg-opacity-50 animate-pulse';
                    span.textContent = selectedSnippet.text;
                    
                    // Split the text node and insert our highlight
                    const before = text.substring(0, index);
                    const after = text.substring(index + selectedSnippet.text.length);
                    
                    const fragment = document.createDocumentFragment();
                    if (before) fragment.appendChild(document.createTextNode(before));
                    fragment.appendChild(span);
                    if (after) fragment.appendChild(document.createTextNode(after));
                    
                    node.parentNode.replaceChild(fragment, node);
                    
                    // Scroll the span into view
                    span.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Remove the highlight after a delay
                    setTimeout(() => {
                      if (span.parentNode) {
                        span.parentNode.replaceChild(document.createTextNode(span.textContent), span);
                      }
                    }, 2000);
                    break;
                  }
                }
              }
            }}
          />

          {/* WatchlistPanel moved to graph panel above */}

          {/* Companies Section */}
          <div className="border-t border-gray-700 pt-6 border-t border-gray-700 mt-6">
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
                  className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 cursor-pointer group"
                  onClick={() => {
                    const sentences = findCompanySentences(articleContent, company.name);
                    setCompanyModal({
                      show: true,
                      company: { ...company, sentences }
                    });
                  }}
                >
                  {/* Header with Name, Click Icon, and Rating */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white text-base text-sm">{company.name}</h4>
                      {/* Click indicator icon */}
                      <span className="ml-1 text-blue-400 opacity-70 group-hover:opacity-100 transition-opacity" title="Click to view company profile">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12v-2a4 4 0 1 1 8 0v2m-8 0h8m-8 0v2a4 4 0 0 0 8 0v-2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 16v2m0 0h.01"/></svg>
                      </span>
                    </div>
                    {company.isPrivate ? (
                      <span className="text-xs px-2 py-1 rounded bg-gray-600 text-gray-200">Private</span>
                    ) : (
                      company.rating !== "Not Rated" && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          company.rating === "Overweight" ? 'bg-green-900 text-green-300' : 
                          company.rating === "Underweight" ? 'bg-red-900 text-red-300' : 
                          'bg-amber-600 text-amber-300'
                        }`}>
                          {company.rating}
                        </span>
                      )
                    )}
                  </div>

                  <div className="text-xs text-gray-400 mb-3">
                    {company.type}
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
            {/* In the News Panel */}
            <InTheNewsPanel />
          </div>
        </aside>
      </main>
      
      {/* Recommended Articles Dialog */}
      {recommendedArticles.show && (
        <RecommendedArticlesDialog
          articles={recommendedArticles.articles}
          searchContext={recommendedArticles.searchContext}
          onClose={() => setRecommendedArticles(prev => ({ ...prev, show: false }))}
        />
      )}

      {/* Company Modal */}
      {companyModal.show && companyModal.company && (
        <div 
          className="modal-hover-zone fixed inset-0 flex items-center justify-center z-50"
          onMouseEnter={clearCloseTimer}
          onMouseLeave={startCloseTimer}
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setCompanyModal(prev => ({ ...prev, show: false }))} />
          <CompanyModal 
            company={companyModal.company} 
            onClose={() => setCompanyModal(prev => ({ ...prev, show: false }))}
            articleContent={articleContent}
            showAlert={showAlert}
          />
        </div>
      )}
    </div>
  );
};

export default TradingDashboard;