"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ComparisonDataPoint } from "@/lib/chartUtils";

interface ComparisonChartProps {
  data: ComparisonDataPoint[];
  mainUsername: string;
  compareUsername: string;
}

export function ComparisonChart({
  data,
  mainUsername,
  compareUsername,
}: ComparisonChartProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-center gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          {mainUsername}
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-gray-400" />
          {compareUsername}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {data.map((point) => (
          <div key={point.metric}>
            <p className="mb-1 text-center text-xs font-medium text-gray-700">
              {point.metric}
            </p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={[point]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="metric" tick={false} axisLine={false} />
                <YAxis width={32} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar
                  dataKey={mainUsername}
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey={compareUsername}
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}