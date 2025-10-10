import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const WatchlistPanel = ({ watchlistItems, onItemClick }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4 text-blue-400">Watchlist</h3>
      {watchlistItems.length === 0 ? (
        <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
          <div className="text-sm text-gray-300 font-medium">
            No symbols currently tracked. Add symbols to your watchlist to monitor them here.
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {watchlistItems.map((item) => (
            <li 
              key={item.symbol} 
              className="flex justify-between items-center p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
              onClick={() => onItemClick(item)}
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
      )}
    </div>
  );
};

export default WatchlistPanel;