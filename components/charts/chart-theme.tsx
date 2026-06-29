"use client"

import type { ReactNode } from "react"

export type AxisTheme = {
  axis: string
  grid: string
  tooltipBg: string
  tooltipBorder: string
  tooltipText: string
}

export const lightTheme: AxisTheme = {
  axis: "#64748b",
  grid: "#e2e8f0",
  tooltipBg: "#ffffff",
  tooltipBorder: "#e2e8f0",
  tooltipText: "#0f172a",
}

export const darkTheme: AxisTheme = {
  axis: "#94a3b8",
  grid: "#2a2a44",
  tooltipBg: "#16162a",
  tooltipBorder: "#3a3a5c",
  tooltipText: "#f1f5f9",
}

type TooltipPayloadItem = {
  name?: string
  value?: number | string
  color?: string
  payload?: Record<string, unknown>
}

export function ChartTooltip({
  active,
  payload,
  label,
  theme,
  suffix = "",
  labelKey,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string | number
  theme: AxisTheme
  suffix?: string
  labelKey?: string
}) {
  if (!active || !payload || payload.length === 0) return null

  const title =
    labelKey && payload[0]?.payload
      ? (payload[0].payload[labelKey] as ReactNode)
      : label

  return (
    <div
      style={{
        background: theme.tooltipBg,
        border: `1px solid ${theme.tooltipBorder}`,
        color: theme.tooltipText,
      }}
      className="rounded-lg px-3 py-2 text-sm shadow-lg"
    >
      {title !== undefined && (
        <p className="mb-1 font-medium">{title}</p>
      )}
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          {item.color && (
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: item.color }}
            />
          )}
          <span className="opacity-80">{item.name}:</span>
          <span className="font-semibold">
            {typeof item.value === 'number' ? item.value.toFixed(1) : item.value}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  )
}
