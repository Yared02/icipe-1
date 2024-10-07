"use client";

import {
  Area,
  CartesianGrid,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const areaData = [
  {
    name: "Jan",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Feb",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Mar",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Apr",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "May",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Jun",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Jul",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export function GrantChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        width={500}
        height={400}
        data={areaData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" className="text-xs" />
        <YAxis className="text-xs" tickFormatter={(value) => `ETB ${value}`} />
        <Tooltip />
        <Area type="monotone" dataKey="uv" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
