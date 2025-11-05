import React from "react";
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from "recharts";
import WatchlistPanel from "./WatchlistPanel";

const MarketsGraph = ({ chartTitle, data, stroke, watchlistItems, onWatchlistItemClick }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-64 sm:h-96 flex mt-8">
    <div className="flex-1 pr-6">
      <h3 className="text-lg font-medium text-blue-400 mb-4">{chartTitle}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#6B7280" />
          <YAxis domain={["dataMin - 5", "dataMax + 5"]} stroke="#6B7280" />
          <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none" }} />
          <Line type="monotone" dataKey="value" stroke={stroke} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="w-64 border-l border-gray-700 pl-6 flex flex-col justify-start">
      <WatchlistPanel 
        watchlistItems={watchlistItems}
        onItemClick={onWatchlistItemClick}
      />
    </div>
  </div>
);

export default MarketsGraph;
