import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const WatchlistPanel = ({ watchlistItems, onItemClick }) => {
  return (
    <div className="">
      <h3 className="text-xl font-semibold mb-4 text-blue-400">Article Watchlist</h3>
      {watchlistItems.length === 0 ? (
        <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
          <div className="text-sm text-gray-300 font-medium">
            No symbols currently tracked. Add symbols to your watchlist to monitor them here.
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {watchlistItems.map((item) => {
            // Determine weight/trend for percent and color
            let trend = 'neutral';
            let percentColor = 'text-amber-400';
            let percentIcon = <Minus size={16} className="mr-1" />;
            if (item.color === 'green') {
              trend = 'up'; percentColor = 'text-green-400'; percentIcon = <TrendingUp size={16} className="mr-1" />;
            } else if (item.color === 'red') {
              trend = 'down'; percentColor = 'text-red-400'; percentIcon = <TrendingDown size={16} className="mr-1" />;
            }
            return (
              <li 
                key={item.symbol} 
                className="flex justify-between items-center p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                onClick={() => onItemClick(item)}
              >
                <div>
                  <span className="font-medium">{item.symbol}</span>
                  <span className="block text-sm text-gray-400">${item.price.toLocaleString()}</span>
                </div>
                <div className={`flex items-center ${percentColor}`}>
                  {percentIcon}
                  <span>
                    {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{Math.abs(item.change)}%
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default WatchlistPanel;