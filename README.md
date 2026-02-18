# 🚀 JustDial Scraper — Full Stack Lead Generation Tool

A professional full-stack web application to scrape business leads from JustDial across 300+ Indian cities. Built with **Next.js 14** and **Python Selenium**.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Python](https://img.shields.io/badge/Python-3.x-blue?style=flat-square&logo=python)
![Selenium](https://img.shields.io/badge/Selenium-4.x-green?style=flat-square&logo=selenium)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)

## ✨ Features

- **3 Scraping Modes** — Single Target, City Sweep, Full Blast
- **300+ Indian Cities** — Searchable dropdown
- **Live Progress Tracking** — Real-time job status
- **Data Preview & Search** — Browse results before download
- **CSV & Excel Export** — Download with summary sheets
- **Modern Gradient UI** — Professional light theme

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Chrome browser

### Installation
```bash
# Clone
git clone https://github.com/YOUR_USERNAME/JustDial-Data-Scrapper.git
cd JustDial-Data-Scrapper

# Install frontend
cd frontend
npm install

# Install Python packages
cd ../scraper
pip install selenium webdriver-manager
```

### Run
```bash
cd frontend
npm run dev
# Open http://localhost:3000
```

## 📖 Usage

1. Click **"Launch App"**
2. Select mode (Single/Sweep/Blast)
3. Choose cities & categories
4. Click **"Start Scraping"**
5. Download CSV or Excel

## 🏗️ Structure
```
├── frontend/       # Next.js (UI + API)
│   ├── app/        # Pages & API routes
│   └── components/ # React components
└── scraper/        # Python Selenium
    └── api_scraper.py
```

## 🛠️ Tech Stack

- Next.js 14, TypeScript, Tailwind CSS
- Python, Selenium WebDriver
- SheetJS (xlsx)

## 📄 License

MIT

## 👨‍💻 Author

**Bhaskar**  
[GitHub](https://github.com/YOUR_USERNAME)

⭐ Star this repo if helpful!
