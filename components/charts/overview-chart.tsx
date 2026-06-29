"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { monthlySeries } from "@/lib/unemployment-data"
import { ChartTooltip, type AxisTheme } from "./chart-theme"

export function OverviewChart({ theme }: { theme: AxisTheme }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={monthlySeries}
        margin={{ top: 10, right: 24, left: 0, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
        {/* Covid period shaded area: Mar-2020 (index 14) → Jun-2021 (index 29) */}
        <ReferenceArea
          x1="Mar-20"
          x2="Jun-21"
          fill="#ef4444"
          fillOpacity={0.08}
        />
        <ReferenceLine
          x="Mar-20"
          stroke="#ef4444"
          strokeDasharray="6 4"
          label={{
            value: "Covid-19 Outbreak",
            position: "top",
            fill: "#ef4444",
            fontSize: 11,
          }}
        />
        <XAxis
          dataKey="label"
          stroke={theme.axis}
          tick={{ fill: theme.axis, fontSize: 11 }}
          interval={2}
        />
        <YAxis
          domain={[0, 30]}
          stroke={theme.axis}
          tick={{ fill: theme.axis, fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          content={<ChartTooltip theme={theme} suffix="%" labelKey="fullLabel" />}
        />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="#3b82f6"
          strokeWidth={2.5}
          dot={{ r: 2.5, fill: "#3b82f6" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
