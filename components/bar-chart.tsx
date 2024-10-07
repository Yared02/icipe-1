"use client";

import { Bar, BarChart as BC, ResponsiveContainer, XAxis, YAxis } from "recharts";


export function BarChart({
  data,
}: {
  data: {
    name: string;
    total: number;
  }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BC data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `ETB ${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BC>
    </ResponsiveContainer>
  );
}
