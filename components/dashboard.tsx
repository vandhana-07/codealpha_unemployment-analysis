"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Lightbulb,
  Moon,
  Sun,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import { darkTheme, lightTheme } from "@/components/charts/chart-theme"
import { OverviewChart } from "@/components/charts/overview-chart"
import { RegionalChart } from "@/components/charts/regional-chart"
import { CovidChart } from "@/components/charts/covid-chart"
import { SeasonalChart } from "@/components/charts/seasonal-chart"
import { CorrelationChart } from "@/components/charts/correlation-chart"

import data from "@/lib/unemployment-data"

const TABS = [
  "Overview",
  "Regional",
  "Covid Impact",
  "Seasonal Trends",
  "Correlations",
] as const

type Tab = (typeof TABS)[number]

const formatPeakMonth = (dateStr: string) => {
  try {
    const datePart = dateStr.split(' ')[0]
    const parts = datePart.split('-')
    const year = parts[0]
    const monthIdx = parseInt(parts[1], 10) - 1
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${months[monthIdx] || ''} ${year}`
  } catch {
    return dateStr
  }
}

export function Dashboard() {
  const [dark, setDark] = useState(true)
  const [tab, setTab] = useState<Tab>("Overview")
  const theme = dark ? darkTheme : lightTheme

  const avgParticipation = data.timeSeries.reduce((acc, curr) => acc + curr.labourParticipation, 0) / data.timeSeries.length
  const covidSurgePct = Math.round((data.stats.duringCovid - data.stats.preCovid) / data.stats.preCovid * 100)

  const KPIS = [
    {
      label: "National Avg Rate",
      value: `${data.stats.nationalAverage.toFixed(1)}%`,
      sub: "dataset mean",
      Icon: TrendingUp,
      accent: "#f97316",
    },
    {
      label: "Peak Rate",
      value: `${data.stats.peakRate.toFixed(1)}%`,
      sub: formatPeakMonth(data.stats.peakMonth),
      Icon: AlertTriangle,
      accent: "#ef4444",
    },
    {
      label: "Covid Surge",
      value: `+${covidSurgePct}%`,
      sub: "vs pre-Covid avg",
      Icon: Zap,
      accent: "#ef4444",
    },
    {
      label: "Labour Participation",
      value: `${avgParticipation.toFixed(1)}%`,
      sub: "avg across regions",
      Icon: Users,
      accent: "#22c55e",
    },
  ]

  const sortedRegions = [...data.byRegion].sort((a, b) => b.avgRate - a.avgRate)
  const maxRegionName = sortedRegions[0]?.region || "Tripura"
  const maxRegionRate = sortedRegions[0]?.avgRate || 28.5
  const correlationVal = data.stats.correlation
  const correlationDesc = correlationVal < -0.7 ? "Strong negative" : correlationVal < -0.4 ? "Moderate negative" : correlationVal > 0.7 ? "Strong positive" : correlationVal > 0.4 ? "Moderate positive" : "Weak"

  const INSIGHTS = [
    `${maxRegionName} has the highest unemployment at ${maxRegionRate.toFixed(1)}%.`,
    `Covid-19 caused a peak of ${data.stats.peakRate.toFixed(1)}% in ${formatPeakMonth(data.stats.peakMonth)}, a ${covidSurgePct}% surge from the pre-Covid average.`,
    "April–May show consistently higher unemployment across all years.",
    `${correlationDesc} correlation (r = ${correlationVal.toFixed(2)}) between labour participation and unemployment.`,
  ]


  const shell = dark ? "bg-[#1a1a2e] text-slate-100" : "bg-slate-50 text-slate-900"
  const card = dark
    ? "bg-[#16162a] border-[#2a2a44]"
    : "bg-white border-slate-200"
  const muted = dark ? "text-slate-400" : "text-slate-500"

  return (
    <div className={`min-h-screen transition-colors ${shell}`}>
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-pretty text-2xl font-bold tracking-tight md:text-3xl">
              India Unemployment Analysis Dashboard
            </h1>
            <p className={`mt-1 text-sm ${muted}`}>
              2019–2021 | Covid-19 Impact Study
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${card} hover:opacity-80`}
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </header>

        {/* KPI cards */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map(({ label, value, sub, Icon, accent }) => (
            <div
              key={label}
              className={`rounded-xl border p-4 shadow-sm ${card}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${muted}`}>{label}</span>
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: `${accent}1f`, color: accent }}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold" style={{ color: accent }}>
                {value}
              </p>
              <p className={`mt-0.5 text-xs ${muted}`}>{sub}</p>
            </div>
          ))}
        </section>

        {/* Tabs */}
        <nav
          role="tablist"
          aria-label="Dashboard views"
          className="mt-8 flex flex-wrap gap-2"
        >
          {TABS.map((t) => {
            const active = t === tab
            return (
              <button
                key={t}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-600 text-white shadow"
                    : `${card} border ${muted} hover:opacity-80`
                }`}
              >
                {t}
              </button>
            )
          })}
        </nav>

        {/* Chart panel */}
        <section
          className={`mt-4 rounded-xl border p-4 shadow-sm md:p-6 ${card}`}
        >
          <h2 className="mb-4 text-lg font-semibold">{chartTitle(tab)}</h2>
          {tab === "Overview" && <OverviewChart theme={theme} />}
          {tab === "Regional" && <RegionalChart theme={theme} />}
          {tab === "Covid Impact" && (
            <>
              <CovidChart theme={theme} />
              <p
                className="mt-3 rounded-lg px-3 py-2 text-sm"
                style={{ background: "#ef44441f", color: "#ef4444" }}
              >
                National rate surged 87% during Covid-19 lockdowns.
              </p>
            </>
          )}
          {tab === "Seasonal Trends" && <SeasonalChart theme={theme} />}
          {tab === "Correlations" && (
            <>
              <CorrelationChart theme={theme} />
              <p className={`mt-3 text-center text-sm font-medium ${muted}`}>
                Pearson r = -0.82 (strong negative correlation)
              </p>
            </>
          )}
        </section>

        {/* Insights panel */}
        <section className={`mt-6 rounded-xl border p-4 shadow-sm md:p-6 ${card}`}>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-semibold">Key Insights</h2>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {INSIGHTS.map((insight, i) => (
              <li
                key={i}
                className={`flex gap-3 rounded-lg border p-3 text-sm ${
                  dark ? "border-[#2a2a44] bg-[#1a1a2e]" : "border-slate-200 bg-slate-50"
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </section>

        <footer className={`mt-8 text-center text-xs ${muted}`}>
          Static dataset · India unemployment 2019–2021 · No live data source
        </footer>
      </div>
    </div>
  )
}

function chartTitle(tab: Tab): string {
  switch (tab) {
    case "Overview":
      return "Monthly Unemployment Rate Trend"
    case "Regional":
      return "Unemployment Rate by Region"
    case "Covid Impact":
      return "Covid-19 Impact by Region"
    case "Seasonal Trends":
      return "Seasonal Unemployment Pattern"
    case "Correlations":
      return "Unemployment vs Labour Participation"
  }
}
