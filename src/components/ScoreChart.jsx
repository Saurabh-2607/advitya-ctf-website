"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#10b981", // Emerald 500
  "#3b82f6", // Blue 500
  "#f43f5e", // Rose 500
  "#fbbf24", // Amber 400
  "#a855f7", // Purple 500
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg shadow-xl">
      <p className="text-neutral-500 text-xs font-mono mb-2">{label}</p>
      <div className="flex flex-col gap-1">
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-3 text-xs">
            <span style={{ color: p.color }}>●</span>
            <span className="text-neutral-300 font-medium min-w-[80px]">{p.dataKey}</span>
            <span className="text-white font-mono ml-auto">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function MultiTeamScore({ data, teams }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid 
            stroke="#262626" 
            strokeDasharray="4 4" 
            vertical={false} 
          />
          
          <XAxis
            dataKey="time"
            stroke="#404040"
            tick={{ fill: "#525252", fontSize: 10, fontFamily: "monospace" }}
            tickLine={false}
            axisLine={false}
            dy={10}
            minTickGap={30}
          />
          
          <YAxis
            stroke="#404040"
            tick={{ fill: "#525252", fontSize: 10, fontFamily: "monospace" }}
            tickLine={false}
            axisLine={false}
            dx={-10}
            width={40}
          />

          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: "#404040", strokeWidth: 1, strokeDasharray: "4 4" }}
          />

          {teams.map((team, index) => (
            <Line
              key={team}
              type="monotone"
              dataKey={team}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive={true}
              animationDuration={1000}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
