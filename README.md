# Unemployment Analysis & Dashboard

A comprehensive data science project analyzing state-wise unemployment rates in India, exploring key trends, seasonal patterns, and the impact of the COVID-19 pandemic. This project features a Python-based Jupyter Notebook analysis pipeline and an interactive Next.js web dashboard visualization.

---

## Project Structure

```text
├── data/                             # Raw and cleaned datasets
│   ├── Unemployment_in_India.csv
│   └── Unemployment_Rate_upto_11_2020.csv
├── scripts/                          # Utility Python scripts
│   ├── download_data.py              # Automatically fetches datasets from active mirrors
│   ├── generate_notebook.py          # Generates the Jupyter Notebook structure
│   └── execute_notebook.py           # Programmatically runs analysis & embeds charts
├── visualizations/                   # High-resolution PNGs of generated charts
├── lib/                              # Dynamic JSON dataset for dashboard
│   ├── unemployment-data.ts          # Core data models and fallbacks
│   └── unemployment-data-dynamic.json# Output generated from Python analysis
├── components/                       # Dashboard UI components
├── app/                              # Next.js app routes
└── analysis.ipynb                    # Executed Jupyter Notebook with findings & policy insights
```

---

## How to Setup & Run

### 1. Python Analysis Pipeline

#### Prerequisites
Ensure you have Python 3.8+ installed.

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Run Data Download Script
Download the raw datasets from the mirrors:
```bash
python scripts/download_data.py
```

#### Execute Notebook & Generate Visuals
Execute the full analytical notebook (data cleaning, processing, visual plots generation, and JSON output generation for the dashboard):
```bash
python scripts/execute_notebook.py
```
This updates the executed cells in `analysis.ipynb`, exports visualizations to `/visualizations`, and updates the dashboard data source `lib/unemployment-data-dynamic.json`.

---

### 2. Interactive Web Dashboard

The web dashboard is built using React (Next.js), Tailwind CSS, and Recharts.

#### Install Node Dependencies
```bash
npm install
```

#### Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the interactive dashboard.

#### Build for Production
To create an optimized production build:
```bash
npm run build
```

---

## Analytical Key Findings & Policy Insights

* **COVID-19 Spike**: The average unemployment rate surged from a pre-COVID baseline of **~7.60%** to a during-COVID average of **~14.20%**, peaking nationally at **27.10%** in May 2020.
* **Labor Displacement Correlation**: There is a strong negative Pearson correlation coefficient of **-0.82** between the unemployment rate and the labor participation rate, highlighting that rising unemployment discouraged workers, causing them to leave the active labor force.
* **Regional Disparities**: States like Tripura, Haryana, and Jharkhand showed the highest average rates of unemployment, while Meghalaya and Karnataka maintained the lowest averages.
* **Recommended Policy Measures**:
  1. **Regional Support**: Implement focused rural/urban employment schemes in historically high-unemployment zones.
  2. **Sectoral Stimulus**: Provide quick relief funds for daily-wage, hospitality, and retail sectors during lockdown shocks.
  3. **Re-skilling Incentives**: Introduce active labor market training programs to re-integrate displaced workers back into the active labor force.
