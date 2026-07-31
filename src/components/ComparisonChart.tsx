"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
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
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="metric" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={mainUsername} fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey={compareUsername} fill="#94a3b8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}