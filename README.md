# Kejani Leads Scrapper Extension

A Google Chrome Extension that collects lead information (URLs, names, contact details) from social media platforms (LinkedIn, X/Twitter, Facebook, TikTok) and stores them directly into a local Excel file.

## Features

- **Local Storage**: Saves data directly to your computer's file system using the File System Access API. No external databases or API servers required.
- **Platform Support**:
  - LinkedIn (Profiles)
  - X (Twitter) (Profiles)
  - Facebook (Profiles)
  - Generic Contact Scrapper (Emails & Phone Numbers on any page)
- **Security**: Runs entirely in your browser with strict permissions.

## Setup & Installation

Since this is a developer extension, you need to load it manually into Chrome.

1.  **Build the Project**:
    Ensure you have Node.js installed, then run:
    ```bash
    npm install
    npm run build-extension
    ```
    This will create a `dist/` folder containing the extension.

2.  **Load into Chrome**:
    - Open Chrome and navigate to `chrome://extensions/`.
    - Enable **Developer mode** (toggle in the top right).
    - Click **Load unpacked**.
    - Select the `dist/` folder from your project directory.

## Usage

1.  **Prepare an Excel Sheet**:
    - Create a blank Excel file (e.g., `leads.xlsx`) on your computer.
    - Close the file (Excel cannot hold the file lock while the extension writes to it).

2.  **Connect the Extension**:
    - Click the extension icon in Chrome to open the popup.
    - Click **Connect Excel Sheet**.
    - Grant the browser permission to "View and Save changes" to your file.

3.  **Scrape Leads**:
    - Navigate to a profile page (e.g., a LinkedIn user profile).
    - Open the extension popup.
    - Click **Scrape Current Page**.
    - You should see a success message.

4.  **View Data**:
    - Open your Excel file to see the scraped data.

## Troubleshooting

- **"File not connected"**: You must reconnect the file every time you reopen the browser (browser security limitation).
- **"Permission denied"**: Ensure the Excel file is CLOSED in other applications.
- **Empty Scrape**: Social media sites change their layouts often. If scraping fails, the site DOM might have changed.

## Development

- **Run Dev Server**: `npm run dev`
- **Build**: `npm run build`
