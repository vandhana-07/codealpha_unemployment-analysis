"use client"

import {
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts"
import { correlationData } from "@/lib/unemployment-data"
import { ChartTooltip, type AxisTheme } from "./chart-theme"

// Linear regression of unemployment (y) on participation (x).
function regressionEndpoints() {
  const n = correlationData.length
  const sx = correlationData.reduce((s, d) => s + d.participation, 0)
  const sy = correlationData.reduce((s, d) => s + d.unemployment, 0)
  const sxy = correlationData.reduce(
    (s, d) => s + d.participation * d.unemployment,
    0,
  )
  const sxx = correlationData.reduce(
    (s, d) => s + d.participation * d.participation,
    0,
  )
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx)
  const intercept = (sy - slope * sx) / n
  const xs = correlationData.map((d) => d.participation)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  return [
    { participation: minX, unemployment: slope * minX + intercept },
    { participation: maxX, unemployment: slope * maxX + intercept },
  ]
}

export function CorrelationChart({ theme }: { theme: AxisTheme }) {
  const trend = regressionEndpoints()

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ScatterChart margin={{ top: 16, right: 24, left: 0, bottom: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
        <XAxis
          type="number"
          dataKey="participation"
          name="Labour Participation"
          domain={[34, 54]}
          stroke={theme.axis}
          tick={{ fill: theme.axis, fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
          label={{
            value: "Labour Participation Rate (%)",
            position: "insideBottom",
            offset: -8,
            fill: theme.axis,
            fontSize: 12,
          }}
        />
        <YAxis
          type="number"
          dataKey="unemployment"
          name="Unemployment"
          domain={[0, 30]}
          stroke={theme.axis}
          tick={{ fill: theme.axis, fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
          label={{
            value: "Unemployment (%)",
            angle: -90,
            position: "insideLeft",
            fill: theme.axis,
            fontSize: 12,
          }}
        />
        <ZAxis range={[80, 80]} />
        <Tooltip
          cursor={{ strokeDasharray: "3 3", stroke: theme.axis }}
          content={<ChartTooltip theme={theme} suffix="%" labelKey="region" />}
        />
        {/* Trend line (negative correlation) */}
        <Scatter
          data={trend}
          line={{ stroke: "#94a3b8", strokeDasharray: "5 5", strokeWidth: 2 }}
          shape={() => <g />}
          legendType="none"
          isAnimationActive={false}
        />
        {/* Region points */}
        <Scatter data={correlationData} name="Region">
          {correlationData.map((d, i) => (
            <Cell
              key={`${d.region}-${i}`}
              fill={d.unemployment > 15 ? "#f97316" : "#3b82f6"}
            />
          ))}
          <LabelList
            dataKey="region"
            position="top"
            fill={theme.axis}
            fontSize={10}
          />
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  )
}
