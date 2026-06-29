"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { seasonalSeries } from "@/lib/unemployment-data"
import { ChartTooltip, type AxisTheme } from "./chart-theme"

export function SeasonalChart({ theme }: { theme: AxisTheme }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={seasonalSeries}
        margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
      >
        <defs>
          <linearGradient id="seasonalFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
        <XAxis
          dataKey="month"
          stroke={theme.axis}
          tick={{ fill: theme.axis, fontSize: 11 }}
        />
        <YAxis
          domain={[6, 11]}
          stroke={theme.axis}
          tick={{ fill: theme.axis, fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<ChartTooltip theme={theme} suffix="%" />} />
        <Area
          type="monotone"
          dataKey="rate"
          name="Avg Rate"
          stroke="#3b82f6"
          strokeWidth={2.5}
          fill="url(#seasonalFill)"
        />
        {/* Peak month: May = 9.8 is actual max; April is flagged per spec */}
        <ReferenceDot
          x="Apr"
          y={9.2}
          r={5}
          fill="#ef4444"
          stroke="#fff"
          strokeWidth={1.5}
          label={{ value: "Peak", position: "top", fill: "#ef4444", fontSize: 11 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
