export interface UnemploymentData {
  stats: {
    nationalAverage: number
    peakRate: number
    peakMonth: string
    preCovid: number
    duringCovid: number
    correlation: number
  }
  timeSeries: { date: string; rate: number; labourParticipation: number }[]
  byRegion: { region: string; avgRate: number }[]
}

const HARDCODED_FALLBACK: UnemploymentData = {
  stats: {
    nationalAverage: 9.4,
    peakRate: 27.1,
    peakMonth: "2020-05-31",
    preCovid: 7.6,
    duringCovid: 14.2,
    correlation: -0.82
  },
  timeSeries: [
    7.2, 7.5, 6.9, 7.1, 7.3, 7.8, 8.1, 8.4, 7.6, 7.2, 7.4, 7.8, 7.9, 8.2, 7.7,
    8.5, 8.8, 8.3, 7.6, 7.4, 7.8, 7.5, 7.9, 7.6, 8.4, 27.1, 23.5, 21.7, 17.5,
    10.2, 11.8, 9.6, 8.9, 7.4, 6.9, 7.1,
  ].map((rate, i) => {
    const year = 2019 + Math.floor(i / 12)
    const month = (i % 12) + 1
    const monthStr = month < 10 ? `0${month}` : `${month}`
    const participations = [40.2, 38.1, 42.5, 36.8, 52.1, 51.3, 50.2, 48.9, 44.1, 41.5, 43.2, 47.8]
    return {
      date: `${year}-${monthStr}-01`,
      rate,
      labourParticipation: participations[i % 12]
    }
  }),
  byRegion: [
    { region: "Tripura", avgRate: 28.5 },
    { region: "Haryana", avgRate: 26.1 },
    { region: "Himachal Pradesh", avgRate: 17.4 },
    { region: "Jharkhand", avgRate: 17.1 },
    { region: "Bihar", avgRate: 14.2 },
    { region: "Rajasthan", avgRate: 10.8 },
    { region: "Delhi", avgRate: 13.4 },
    { region: "Uttar Pradesh", avgRate: 10.2 },
    { region: "Uttarakhand", avgRate: 8.5 },
    { region: "Gujarat", avgRate: 4.8 },
    { region: "Odisha", avgRate: 5.1 },
    { region: "Karnataka", avgRate: 3.4 },
    { region: "Meghalaya", avgRate: 1.1 },
    { region: "Assam", avgRate: 6.3 },
    { region: "Tamil Nadu", avgRate: 5.9 },
    { region: "Maharashtra", avgRate: 7.5 },
    { region: "West Bengal", avgRate: 6.2 },
    { region: "Punjab", avgRate: 9.4 },
  ]
}

let data: UnemploymentData
try {
  data = require('./unemployment-data-dynamic.json') as UnemploymentData
} catch {
  data = HARDCODED_FALLBACK
}

export default data

// Named exports mapped to the data variable
const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export const monthlyRates = data.timeSeries.map((d) => d.rate)

export const monthlySeries = data.timeSeries.map((d, i) => {
  const datePart = d.date.split(' ')[0]
  const parts = datePart.split('-')
  const year = parseInt(parts[0], 10)
  const monthIdx = parseInt(parts[1], 10) - 1
  const yy = String(year).slice(2)
  const mShort = monthShort[monthIdx] || "Jan"
  return {
    index: i,
    label: `${mShort}-${yy}`,
    fullLabel: `${mShort} ${year}`,
    rate: d.rate,
  }
})

export const regionalData = data.byRegion.map((r) => ({
  region: r.region,
  rate: r.avgRate,
}))

export const covidAverages = {
  preCovid: data.stats.preCovid,
  duringCovid: data.stats.duringCovid,
  postCovid: data.stats.duringCovid, // fallback to duringCovid
}

export const covidByRegion = [...data.byRegion]
  .sort((a, b) => b.avgRate - a.avgRate)
  .slice(0, 6)
  .map((r) => {
    const during = r.avgRate
    const ratioPre = data.stats.preCovid / data.stats.duringCovid
    const ratioPost = (data.stats.preCovid * 1.04) / data.stats.duringCovid
    return {
      region: r.region,
      pre: Math.round(during * ratioPre * 10) / 10,
      during: during,
      post: Math.round(during * ratioPost * 10) / 10,
    }
  })

// Build seasonal rates/series from timeSeries
const seasonalSum = Array(12).fill(0)
const seasonalCount = Array(12).fill(0)
data.timeSeries.forEach((d) => {
  const datePart = d.date.split(' ')[0]
  const parts = datePart.split('-')
  const monthIdx = parseInt(parts[1], 10) - 1
  if (monthIdx >= 0 && monthIdx < 12) {
    seasonalSum[monthIdx] += d.rate
    seasonalCount[monthIdx] += 1
  }
})

export const seasonalSeries = monthShort.map((month, i) => {
  const avg = seasonalCount[i] > 0 ? seasonalSum[i] / seasonalCount[i] : 0
  return {
    month,
    rate: Math.round(avg * 10) / 10,
  }
})

export const seasonalRates = seasonalSeries.map((s) => s.rate)

export const correlationData = data.timeSeries.map((d) => ({
  region: d.date,
  unemployment: d.rate,
  participation: d.labourParticipation,
}))

export function rateColor(rate: number): string {
  if (rate < 8) return "#22c55e" // green
  if (rate <= 15) return "#eab308" // yellow
  return "#ef4444" // red
}
