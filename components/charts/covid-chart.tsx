"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { covidByRegion } from "@/lib/unemployment-data"
import { ChartTooltip, type AxisTheme } from "./chart-theme"

export function CovidChart({ theme }: { theme: AxisTheme }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={covidByRegion}
        margin={{ top: 10, right: 16, left: 0, bottom: 8 }}
        barGap={2}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
        <XAxis
          dataKey="region"
          stroke={theme.axis}
          tick={{ fill: theme.axis, fontSize: 10 }}
          interval={0}
        />
        <YAxis
          stroke={theme.axis}
          tick={{ fill: theme.axis, fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          cursor={{ fill: theme.grid, fillOpacity: 0.3 }}
          content={<ChartTooltip theme={theme} suffix="%" />}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: theme.axis }} />
        <Bar dataKey="pre" name="Pre-Covid" fill="#3b82f6" radius={[3, 3, 0, 0]} />
        <Bar dataKey="during" name="During Covid" fill="#f97316" radius={[3, 3, 0, 0]} />
        <Bar dataKey="post" name="Post-Covid" fill="#22c55e" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
