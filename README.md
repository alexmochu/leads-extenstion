# Kejani Leads Scraper Extension

Kejani Leads is a powerful, local-first Chrome Extension designed for sales professionals. It scrapes lead information from social media (LinkedIn, X/Twitter, Facebook) and contact pages, enriching it with sales intelligence before saving it to your local files.

## 🚀 Key Features

### 1. Data Collection & Storage
- **Auto-Sync Mode**: Connects directly to a local `.xlsx` file. Scraped leads are appended instantly.
- **Manual Mode (Fallback)**: If file access is blocked, leads are saved in memory. You can download the session as Excel or CSV later.
- **Platform Support**:
  - **LinkedIn**: Name, Headline, Location, Profile URL.
  - **X (Twitter)**: Handle, Bio, Website, Location.
  - **Facebook**: User details.
  - **Generic**: Extracts emails and phone numbers from any webpage.

### 2. 🧠 Sales Intelligence Suite
- **🚫 Duplicate Detection**: Instantly warns you if a prospect is already in your list (checks URL and Name match). Prevents accidental double-pitching.
- **🏷️ Smart Tagging**: Automatically categorizes leads based on keywords (e.g., "Decision Maker", "Tech", "Recruiter", "Real Estate") found in their bio/headline.
- **⚡ Instant Icebreakers**: Generates a personalized outreach snippet ("Hi [Name], I saw you're the [Title]...") ready to copy-paste.
- **📂 Campaign Management**: Organize your leads by creating custom "Campaign" names (e.g., "Q1 Cold Outreach") for each session.

### 3. 📤 Sharing & Export
- **Social Sharing**: One-click sharing of lead data via **WhatsApp**, **Telegram**, **Email**, or **X**.
- **Flexible Formats**: Toggle between **Excel (.xlsx)** and **CSV** for your downloads.
- **Clipboard Sync**: Instantly copy your captured leads as CSV text to paste into Google Sheets or CRMs.

---

## 🛠️ Setup & Installation

1.  **Build the Extension**:
    ```bash
    npm install
    npm run build-extension
    ```
    This creates a `dist/` folder.

2.  **Load into Chrome**:
    - Go to `chrome://extensions/`.
    - Turn on **Developer Mode** (top right).
    - Click **Load unpacked**.
    - Select the `dist/` folder.

---

## 📖 Usage Guide

### Mode 1: Auto-Sync (Recommended)
1.  Open the extension popup.
2.  Click **"Link Excel File"**.
3.  Select an existing `.xlsx` file on your computer.
4.  Navigate to a profile and click **"Scrape Page"**.
5.  Leads are saved automatically to your file.

### Mode 2: Manual / Share Mode
*(Used when file access is denied or for quick sessions)*
1.  Open the popup.
2.  Enter a **Campaign Name** (optional).
3.  Scrape your leads. They will be stored in the session counter.
4.  **Save**: Click **Save** to download the file (Toggle CSV/Excel first).
5.  **Share**: Click **Share** to send via Email/WhatsApp or Copy to Clipboard.

### Sales Intelligence Tools
- **Duplicate Warning**: If you see a **Red Card** after scraping, that lead is already in your list. The extension will NOT auto-save it to prevent clutter.
- **Icebreakers**: After scraping, look at the bottom of the preview card. Click the message text to copy it.

---

## ❓ Troubleshooting

- **"File System API not supported"**: The extension will automatically switch to **Manual Mode**. You can still scrape and download files manually.
- **"Permission Denied"**: Close the Excel file on your computer before connecting. Excel locks the file, preventing the extension from writing to it.
- **"Share Failed"**: If the native share menu doesn't open, the extension will automatically copy the data to your clipboard as a fallback.
