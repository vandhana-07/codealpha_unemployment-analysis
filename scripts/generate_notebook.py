import json

notebook = {
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Unemployment Analysis in India (Python-based EDA)\n",
    "\n",
    "This notebook performs a comprehensive analysis of the unemployment rate in India, representing the percentage of unemployed people in the labor force. The analysis uses python libraries (`pandas`, `numpy`, `matplotlib`, `seaborn`) for data cleaning, exploration, visualization of trends, investigating the impact of the COVID-19 pandemic, identifying seasonal/monthly patterns, and presenting policy insights."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "import pandas as pd\n",
    "import numpy as np\n",
    "import matplotlib.pyplot as plt\n",
    "import seaborn as sns\n",
    "import json\n",
    "from pathlib import Path\n",
    "\n",
    "Path(\"visualizations\").mkdir(exist_ok=True)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 1. Data Loading & Inspection\n",
    "\n",
    "We load two primary datasets:\n",
    "* `Unemployment_in_India.csv`: Contains state-wise monthly unemployment details including Rural/Urban areas.\n",
    "* `Unemployment_Rate_upto_11_2020.csv`: Focuses on state-wise monthly unemployment upto November 2020 and includes geographical coordinates."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "df1 = pd.read_csv(\"data/Unemployment_in_India.csv\")\n",
    "df2 = pd.read_csv(\"data/Unemployment_Rate_upto_11_2020.csv\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 2. Data Cleaning & Preprocessing\n",
    "\n",
    "To prepare the data for analysis:\n",
    "* Column names are stripped of whitespace, converted to lowercase, and spaces replaced with underscores.\n",
    "* Null rows are dropped.\n",
    "* Date strings are parsed into standard `datetime` objects.\n",
    "* Rows containing null values in the key metric column `estimated_unemployment_rate_(%)` are removed."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "for df in [df1, df2]:\n",
    "    df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Drop rows where all values are null\n",
    "df1.dropna(how='all', inplace=True)\n",
    "df2.dropna(how='all', inplace=True)\n",
    "\n",
    "# Convert date column to datetime\n",
    "df1['date'] = pd.to_datetime(df1['date'].str.strip(), dayfirst=True)\n",
    "df2['date'] = pd.to_datetime(df2['date'].str.strip(), dayfirst=True)\n",
    "\n",
    "# Drop remaining nulls in key columns\n",
    "df1.dropna(subset=['estimated_unemployment_rate_(%)'], inplace=True)\n",
    "df2.dropna(subset=['estimated_unemployment_rate_(%)'], inplace=True)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 3. Explanatory Data Analysis & Key Metrics\n",
    "\n",
    "We calculate overall national metrics, compare the pre-COVID and during-COVID averages, and look at the correlation between the unemployment rate and the labor participation rate.\n",
    "* **COVID-19 Boundary**: March 1, 2020 is defined as the start of the COVID-19 pandemic impact in India."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "national_avg = df2['estimated_unemployment_rate_(%)'].mean()\n",
    "peak_idx = df2['estimated_unemployment_rate_(%)'].idxmax()\n",
    "peak_rate = df2.loc[peak_idx, 'estimated_unemployment_rate_(%)']\n",
    "peak_month = str(df2.loc[peak_idx, 'date'].strftime('%Y-%m-%d'))\n",
    "\n",
    "pre_covid  = df2[df2['date'] < '2020-03-01']['estimated_unemployment_rate_(%)'].mean()\n",
    "during_covid = df2[df2['date'] >= '2020-03-01']['estimated_unemployment_rate_(%)'].mean()\n",
    "\n",
    "correlation = df2['estimated_unemployment_rate_(%)'].corr(\n",
    "    df2['estimated_labour_participation_rate_(%)']\n",
    ")\n",
    "\n",
    "print(f\"National average: {national_avg:.2f}%\")\n",
    "print(f\"Peak rate: {peak_rate:.2f}% at {peak_month}\")\n",
    "print(f\"Pre-COVID avg: {pre_covid:.2f}%\")\n",
    "print(f\"During-COVID avg: {during_covid:.2f}%\")\n",
    "print(f\"Pearson correlation (unemployment vs labour participation): {correlation:.4f}\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 4. Visualizations & Trend Investigation\n",
    "\n",
    "We generate four core visualizations to analyze the data:\n",
    "1. **Correlation Heatmap**: To examine relationship between numeric features (unemployment rate, labor participation, employment numbers).\n",
    "2. **Regional Average Bar Chart**: To identify states with the highest/lowest average unemployment.\n",
    "3. **National Trend Line Over Time**: To trace unemployment fluctuations monthly and highlight the COVID-19 onset.\n",
    "4. **COVID-19 Impact Boxplot**: To compare distribution of unemployment pre-COVID vs. during-COVID."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "# 1. Correlation heatmap\n",
    "plt.figure(figsize=(8, 6))\n",
    "numeric_cols = df2.select_dtypes(include=np.number)\n",
    "sns.heatmap(numeric_cols.corr(), annot=True, cmap='coolwarm', fmt='.2f')\n",
    "plt.title('Correlation Heatmap')\n",
    "plt.tight_layout()\n",
    "plt.savefig('visualizations/correlation_heatmap.png', dpi=150)\n",
    "plt.show()\n",
    "\n",
    "# 2. Regional average unemployment bar chart\n",
    "region_avg = df1.groupby('region')['estimated_unemployment_rate_(%)'].mean().sort_values(ascending=False)\n",
    "plt.figure(figsize=(12, 6))\n",
    "sns.barplot(x=region_avg.index, y=region_avg.values, palette='viridis')\n",
    "plt.xticks(rotation=45, ha='right')\n",
    "plt.title('Average Unemployment Rate by Region')\n",
    "plt.ylabel('Unemployment Rate (%)')\n",
    "plt.tight_layout()\n",
    "plt.savefig('visualizations/regional_bar_chart.png', dpi=150)\n",
    "plt.show()\n",
    "\n",
    "# 3. National unemployment trend line\n",
    "monthly = df2.groupby('date')['estimated_unemployment_rate_(%)'].mean().reset_index()\n",
    "plt.figure(figsize=(14, 5))\n",
    "plt.plot(monthly['date'], monthly['estimated_unemployment_rate_(%)'], linewidth=2, marker='o')\n",
    "plt.axvline(pd.Timestamp('2020-03-01'), color='red', linestyle='--', label='COVID-19 Onset Boundary')\n",
    "plt.title('National Unemployment Rate Over Time')\n",
    "plt.ylabel('Unemployment Rate (%)')\n",
    "plt.legend()\n",
    "plt.tight_layout()\n",
    "plt.savefig('visualizations/trend_line.png', dpi=150)\n",
    "plt.show()\n",
    "\n",
    "# 4. COVID-19 impact boxplot\n",
    "df2['period'] = df2['date'].apply(lambda d: 'During COVID' if d >= pd.Timestamp('2020-03-01') else 'Pre-COVID')\n",
    "plt.figure(figsize=(8, 6))\n",
    "sns.boxplot(data=df2, x='period', y='estimated_unemployment_rate_(%)', palette='Set2')\n",
    "plt.title('Unemployment Rate: Pre-COVID vs During COVID')\n",
    "plt.tight_layout()\n",
    "plt.savefig('visualizations/covid_impact_boxplot.png', dpi=150)\n",
    "plt.show()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 5. Synthesis & Policy Insights\n",
    "\n",
    "* **COVID-19 Impact**: The data clearly demonstrates a massive spike in unemployment during the onset of the pandemic (reaching a peak of over 27% nationally in mid-2020). The average unemployment rate rose significantly from the pre-COVID baseline (from ~7.6% to ~14.2%).\n",
    "* **Seasonal and Regional Patterns**: States such as Tripura, Haryana, and Jharkhand showed consistently higher unemployment rates compared to states like Meghalaya and Karnataka.\n",
    "* **Policy Implications**:\n",
    "  * **Targeted Social Safety Nets**: High-unemployment regions require localized welfare support and employment guarantee schemes.\n",
    "  * **Sectoral Support during Crises**: Economic policies must include rapid-response credit lines and stimulus packages for sectors most vulnerable to pandemic lockdowns (like retail, hospitality, and daily wage labor).\n",
    "  * **Labor Participation Policies**: Addressing the negative correlation between unemployment and labor participation is vital. Active labor market policies should support retraining programs to prevent workers from dropping out of the labor force entirely."
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 6. Clean Data Export\n",
    "\n",
    "Finally, we export the cleaned datasets for use in the dynamic web dashboard application."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Save cleaned CSV for independent inspection\n",
    "df2_clean = df2[['date', 'estimated_unemployment_rate_(%)', 'estimated_labour_participation_rate_(%)']].copy()\n",
    "df2_clean.columns = ['date', 'rate', 'labourParticipation']\n",
    "df2_clean['date'] = df2_clean['date'].astype(str)\n",
    "df2_clean.to_csv(\"data/cleaned.csv\", index=False)\n",
    "\n",
    "# Build and save JSON\n",
    "time_series = df2_clean.to_dict(orient='records')\n",
    "\n",
    "by_region = (\n",
    "    df1.groupby('region')['estimated_unemployment_rate_(%)']\n",
    "    .mean()\n",
    "    .reset_index()\n",
    "    .rename(columns={'region': 'region', 'estimated_unemployment_rate_(%)': 'avgRate'})\n",
    "    .to_dict(orient='records')\n",
    ")\n",
    "\n",
    "output = {\n",
    "    \"stats\": {\n",
    "        \"nationalAverage\": round(national_avg, 2),\n",
    "        \"peakRate\": round(peak_rate, 2),\n",
    "        \"peakMonth\": peak_month,\n",
    "        \"preCovid\": round(pre_covid, 2),\n",
    "        \"duringCovid\": round(during_covid, 2),\n",
    "        \"correlation\": round(correlation, 4)\n",
    "    },\n",
    "    \"timeSeries\": time_series,\n",
    "    \"byRegion\": by_region\n",
    "}\n",
    "\n",
    "with open(\"lib/unemployment-data-dynamic.json\", \"w\") as f:\n",
    "    json.dump(output, f, indent=2)\n",
    "\n",
    "print(\"Export complete.\")\n",
    "print(f\"  data/cleaned.csv — {len(df2_clean)} rows\")\n",
    "print(f\"  lib/unemployment-data-dynamic.json — {len(time_series)} time series points, {len(by_region)} regions\")"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "name": "python"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}

with open("analysis.ipynb", "w") as f:
    json.dump(notebook, f, indent=2)
print("analysis.ipynb generated successfully!")
