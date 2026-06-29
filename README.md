# 📊 India Unemployment Analysis & Interactive Dashboard

A comprehensive data science and web visualization project analyzing state-wise unemployment rates in India (2019–2020). This project tracks trends, seasonal behaviors, and the profound socio-economic impacts of the COVID-19 pandemic. It combines a **Python data processing pipeline** (Jupyter Notebook) with a modern **React/Next.js interactive dashboard**.

---

## 🚀 Key Features

* **Data Cleaning & Engineering**: Automatic whitespace removal, snake_case conversion, missing data handling, and proper datetime parsing.
* **COVID-19 Impact Study**: Statistically compares pre-pandemic vs. during-pandemic unemployment metrics.
* **Correlation Exploration**: Analyzes the relationship between unemployment rates and labor participation rates.
* **4 Interactive Visualizations**: Features line charts, regional bar charts, segmented Covid comparison views, and scatter plots.
* **Policy Recommendation Engine**: Synthesizes analysis into actionable economic policies for social safety nets and training.

---

## 📁 Repository Structure

```text
├── data/                             # Raw and cleaned datasets (CSVs)
│   ├── Unemployment_in_India.csv
│   └── Unemployment_Rate_upto_11_2020.csv
├── scripts/                          # Data processing Python scripts
│   ├── download_data.py              # Download datasets from active mirrors
│   ├── generate_notebook.py          # Creates the Jupyter Notebook file
│   └── execute_notebook.py           # Programmatically executes cells & saves outputs
├── visualizations/                   # High-resolution PNGs of generated charts
├── lib/                              # Dynamic dashboard data layer
│   ├── unemployment-data.ts          # TS interfaces, processing, and colors
│   └── unemployment-data-dynamic.json# Dynamic data feed from Python analysis
├── components/                       # Dashboard React components
├── app/                              # Next.js page layout and routing
└── analysis.ipynb                    # Executed Jupyter Notebook with findings & visualizations
```

---

## 📊 Dataset Specifications

The analysis is based on two datasets sourced from Kaggle:
1. **Unemployment in India**: Monthly details of unemployment rate, employment, and labor participation by state and region classification (Rural/Urban).
2. **Unemployment Rate Upto 11/2020**: Detailed state-wise monthly stats, including geographic coordinates (latitude and longitude).

| Feature Column | Description |
| :--- | :--- |
| `region` | Indian state / Union Territory |
| `date` | Date of recorded observation (monthly) |
| `frequency` | Frequency of recording (e.g. Monthly) |
| `estimated_unemployment_rate_(%)` | Percentage of the labor force currently unemployed |
| `estimated_employed` | Total estimated count of employed citizens |
| `estimated_labour_participation_rate_(%)` | Percentage of working-age population actively in the workforce |

---

## 🛠️ Installation & Setup

### 1. Python Pipeline (Data Analysis)

Ensure you have **Python 3.8+** installed.

```bash
# Install required Python libraries
pip install -r requirements.txt

# Run the download script to fetch datasets
python scripts/download_data.py

# Execute the analysis pipeline
python scripts/execute_notebook.py
```

*Note: Running `execute_notebook.py` automatically updates `analysis.ipynb` with outputs, exports visual charts to `/visualizations`, and updates the dashboard data feed (`lib/unemployment-data-dynamic.json`).*

---

### 2. Next.js Web Dashboard

Ensure you have **Node.js 18+** installed.

```bash
# Install node dependencies
npm install

# Start local Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser to view the interactive dashboard.

---

## 📈 Key Findings & Policy Insights

* **COVID-19 Spike**: The average national unemployment rate surged from a pre-COVID baseline of **~7.60%** to a during-COVID average of **~14.20%**, peaking nationally at **27.10%** in May 2020.
* **Labor Force Dropout**: A strong negative Pearson correlation coefficient of **-0.82** shows that rising unemployment severely discouraged workers, causing them to leave the active labor force.
* **Regional Disparities**: States like Tripura, Haryana, and Jharkhand showed the highest average rates of unemployment, while Meghalaya and Karnataka maintained the lowest averages.
* **Recommended Policies**:
  1. **Focused Welfare Schemes**: Implement targeted employment guarantees in states with high structural unemployment.
  2. **Sectoral Stimulus**: Provide quick financial buffers for daily-wage, hospitality, and retail sectors during economic shocks.
  3. **Re-skilling Incentives**: Introduce active training programs to transition displaced workers back into the labor force.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
