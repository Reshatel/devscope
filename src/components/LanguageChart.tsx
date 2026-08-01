"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LanguageDataPoint } from "@/lib/chartUtils";
import { ChartTooltip } from "@/components/ChartTooltip";

const COLORS = ["#E8A33D", "#5B7FDB", "#8FA396", "#D4707A", "#7BA88F", "#B08FD4"];

export function LanguageChart({ data }: { data: LanguageDataPoint[] }) {
  if (data.length === 0) {
    return <p className="font-mono text-sm text-sage">// no language data available</p>;
  }

  return (
  <ResponsiveContainer width="100%" height={320}>
    <PieChart margin={{ top: 24, right: 24, bottom: 24, left: 24 }}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={87}
          label={(entry) => entry.name}
          labelLine={{ stroke: "#8B9C8F" }}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="#101B14" />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#8B9C8F" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}