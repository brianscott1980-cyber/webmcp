import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

// Map source/org to logo URL (add more as needed)
const sourceLogos = {
  'Microsoft Blog': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
  'CNBC': 'https://www.cnbc.com/favicon.ico',
  'MIT Technology Review': 'https://www.technologyreview.com/favicon.ico',
  'CNBC Pro': 'https://www.cnbc.com/pro/favicon.ico',
  'Reuters': 'https://www.reuters.com/favicon.ico',
  'TechCrunch': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIADgAOAMBEQACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAADAAIEBQYBB//EACwQAAICAQMCBQEJAAAAAAAAAAECAAMEBRESBjETFiFVk1EHFSIjQlJhkdH/xAAaAQADAQEBAQAAAAAAAAAAAAABAgMFBAYA/8QAKREAAgIBAQYFBQAAAAAAAAAAAAECAxEhBAUSFDGRE0FRUsEiU2Gh4f/aAAwDAQACEQMRAD8Aq1WQPDBVWAIRVgCEUQDBVWKEIogCEA2gbCVSrLEQiiAIRRAMFVYoQiiAIQDaBsIiZNsDY/pbHqyOoMGnIrWyp7NmRhuD6HuJ1R6ldjhGe0QjJZX8PVfL2i+14fwrL8KPS8ns/sXYXl/RvbMT4hBwo+5PZ/YuxkOv8HDwbMEYmPTRzD8vDULy24/7JWpLGDJ3pVXU4cCSzn4J3Qum4GZpNtmVi0XOLyoZ0BIHFfSGqKa1L7tpqsqblFPU0f3FpPt2L8QlOCPoaHKUexdjzHXa0p1nNqqRUrS5gqqNgBvM214m0eY2pKN00vUp6+SsGQlWHYg7ETqJLK6Gp6DtufqKoPbYy+G/ozkjtGrf1Gju2UntCy/Jmi+0V3TTMQ1uyE5OxKnb9LR7eh371k1XHD8/hkf7PPzq87xybNim3P8AFt3+sWrXIm6vqUuLXoReuq8hdWqGIlwTwBv4Snbfc/STvzxaEd5qatXBnp5Gb46j+3M/p5ytz/JmPxvz+yJZz5t4nLnv68u+/wDMhJ+pCWc6gVWaA5f9G5NGHrtd2ValVYrcF3Ow7R62lLU7dgnGu9Sk8LUveutSwc7TsZMPLpudb+RVGBIHFvWNbJNaHbvK+qyuKhJPX4YHoTUcLBTNGblVUcynHxG237xKZxWcsTdt9dSlxyS6Gq8w6N7ni/KJbxq/U0+d2b7i7i8w6N7ni/KIPHq9yPud2b7i7nmGu3V36zm20ur1vcxVlO4I3mNfJOxtHltrmpXzcXlZISiaJ8EA2gbCImTcgNjSZJsVs4TJNiNjTItitnJJsRsMBtNls6xGTbA2cMk2K2NJkmxGxpkZMVs4ZJsTI0mSbFbP/9k=',
  'BBC News': 'https://news.bbcimg.co.uk/nol/shared/img/bbc_news_120x60.gif',
};

// Example articles, in a real app this could be fetched or generated
const defaultArticles = [
  {
    title: "OpenAI's New Partnership with Microsoft Announced",
    url: "https://blogs.microsoft.com/blog/2025/10/28/the-next-chapter-of-the-microsoft-openai-partnership/",
    source: "Microsoft Blog",
    date: "Nov 2, 2025"
  },
  {
    title: "CoreWeave inks $6.5 billion deal with OpenAI",
    url: "https://www.cnbc.com/2025/09/25/coreweave-openai-6point5-billion-deal.html",
    source: "CNBC",
    date: "Nov 1, 2025",
    relevanceOverride: 4
  },
  {
    title: "OpenAI has five years to turn $13 billion into $1 trillion",
    url: "https://techcrunch.com/2025/10/14/openai-has-five-years-to-turn-13-billion-into-1-trillion/",
    source: "TechCrunch",
    date: "Oct 27, 2025",
    relevanceOverride: 3
  },
  {
    title: "Nvidia to invest $100bn in OpenAI",
    url: "https://www.bbc.co.uk/news/articles/c0knp3557j2o",
    source: "BBC News",
    date: "22 Sep",
    relevanceOverride: 5
  }
];

const InTheNewsPanel = ({ articles = defaultArticles }) => {
  // Only show articles with a known logo
  const filteredArticles = articles.filter(article => sourceLogos[article.source]);
  // Sort by most relevant first (descending)
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const relA = a.relevanceOverride || 2;
    const relB = b.relevanceOverride || 2;
    return relB - relA;
  });

  // Track which cards have loaded their relevance dots
  const [relevanceLoaded, setRelevanceLoaded] = useState({});
  const cardRefs = useRef([]);

  useEffect(() => {
    // IntersectionObserver to trigger loading when card appears on screen
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const idx = Number(entry.target.getAttribute('data-idx'));
          if (entry.isIntersecting && !relevanceLoaded[idx]) {
            // Simulate 2-4s delay
            const delay = 2000 + Math.floor(Math.random() * 2000);
            setTimeout(() => {
              setRelevanceLoaded(prev => ({ ...prev, [idx]: true }));
            }, delay);
          }
        });
      },
      { threshold: 0.2 }
    );
    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => {
      if (observer && cardRefs.current) {
        cardRefs.current.forEach((ref) => {
          if (ref) observer.unobserve(ref);
        });
      }
    };
  }, [filteredArticles, relevanceLoaded]);

  return (
    <div className="border-t border-gray-700 pt-6 mt-6">
      <h3 className="text-xl font-semibold mb-4 text-blue-400">In the News</h3>
  <div className="flex flex-col gap-4">
        {/* Simulate a relevance score for each article (1-5). Replace with real logic if available. */}
        {sortedArticles.map((article, idx) => {
          // For demo, assign a pseudo-random relevance score between 2 and 5, unless overridden
          const relevance = article.relevanceOverride || (2 + (idx % 4)); // 2,3,4,5,2,3,...
          const showDots = relevanceLoaded[idx];
          return (
            <a
              key={idx}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-200 cursor-pointer border border-gray-700"
              ref={el => cardRefs.current[idx] = el}
              data-idx={idx}
            >
              <div className="p-4 h-full flex flex-col justify-between">
                {/* Category & Reading Time (not available, so show source instead) */}
                <div className="flex items-center mb-3">
                  <span className="inline-flex items-center gap-1 text-blue-400 text-xs font-medium">
                    <img src={sourceLogos[article.source]} alt={article.source + ' logo'} className="w-4 h-4 rounded-sm bg-white" style={{ background: '#fff' }} />
                    {article.source}
                  </span>
                </div>
                {/* Title */}
                <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>
                {/* Relevance scale (dots) */}
                <div className="flex items-center gap-1 mb-2 opacity-60 min-h-[1.25rem]">
                  {showDots
                    ? ([1,2,3,4,5].map(n => {
                        let color = "bg-gray-500/40";
                        if (n <= relevance) {
                          if (relevance <= 2) color = "bg-red-400";
                          else if (relevance === 3) color = "bg-yellow-400";
                          else if (relevance >= 4) color = "bg-green-400";
                        }
                        return (
                          <span
                            key={n}
                            className={`w-2 h-2 rounded-full inline-block ${n <= relevance ? color : 'bg-gray-500/40'}`}
                            style={{ marginRight: n < 5 ? 2 : 0 }}
                          />
                        );
                      }))
                    : ([1,2,3,4,5].map(n => (
                        <span
                          key={n}
                          className={
                            'w-2 h-2 rounded-full inline-block animate-pulse bg-gray-500/30'
                          }
                          style={{ marginRight: n < 5 ? 2 : 0 }}
                        />
                      )))
                  }
                  <span className="text-[10px] text-gray-400 ml-1">Relevance</span>
                </div>
                {/* Footer */}
                <div className="flex items-end justify-between mt-auto">
                  <span className="text-xs text-gray-400">{article.date}</span>
                  <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default InTheNewsPanel;
