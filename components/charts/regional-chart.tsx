"use client"

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { rateColor, regionalData } from "@/lib/unemployment-data"
import { ChartTooltip, type AxisTheme } from "./chart-theme"

export function RegionalChart({ theme }: { theme: AxisTheme }) {
  const sorted = [...regionalData]
    .map((d) => ({ ...d, rate: Number(d.rate.toFixed(1)) }))
    .sort((a, b) => b.rate - a.rate)

  return (
    <ResponsiveContainer width="100%" height={620}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 4, right: 48, left: 12, bottom: 4 }}
      >
        <XAxis
          type="number"
          domain={[0, 30]}
          stroke={theme.axis}
          tick={{ fill: theme.axis, fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="region"
          width={120}
          stroke={theme.axis}
          tick={{ fill: theme.axis, fontSize: 11 }}
        />
        <Tooltip
          cursor={{ fill: theme.grid, fillOpacity: 0.3 }}
          content={<ChartTooltip theme={theme} suffix="%" />}
        />
        <Bar dataKey="rate" name="Unemployment" radius={[0, 4, 4, 0]}>
          {sorted.map((d) => (
            <Cell key={d.region} fill={rateColor(d.rate)} />
          ))}
          <LabelList
            dataKey="rate"
            position="right"
            formatter={(v: number) => `${Number(v).toFixed(1)}%`}
            fill={theme.axis}
            fontSize={11}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
