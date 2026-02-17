# Cyber-Noir News Portal

A futuristic, glassmorphic news portal built with React, Vite, and Tailwind CSS.

## 🚀 Getting Started

### 1. Install Dependencies
If you haven't already:
```bash
cd cyber-noir-news
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔑 Admin Dashboard
Access the admin panel at: `http://localhost:5173/admin`
- **Secret Key**: `CYBER2077`

## 📊 Google Sheets Backend Setup

To connect a real Google Sheet instead of mock data:

1.  Create a new Google Sheet.
2.  Go to **Extensions > Apps Script**.
3.  Copy the code from [`BACKEND_SETUP.js`](./BACKEND_SETUP.js) into the script editor.
4.  Run `setup()` function once to create header rows.
5.  Click **Deploy > New Deployment**.
    *   Select type: **Web app**.
    *   Execute as: **Me**.
    *   Who has access: **Anyone**.
6.  Copy the generated **Web App URL**.
7.  Create a `.env` file in the root of `cyber-noir-news`:
    ```env
    VITE_GOOGLE_SHEET_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
    ```
8.  Restart the dev server.

## 🎨 Controls
- **Ticker**: Modify mock headlines in `src/pages/Home.jsx` or fetch from Sheet.
- **Theme**: Colors and Grid are defined in `tailwind.config.js` and `src/index.css`.
