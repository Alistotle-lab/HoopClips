# HoopClips — Basketball Highlights Social Website

A responsive, GitHub-ready, one-page website built with **plain HTML, CSS, and JavaScript**. There is no build step, package manager, or framework.

## Run locally
1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. For best compatibility with video preview and browser sharing, serve the folder with any static server (GitHub Pages works too). No compilation is needed.

## Features in this demo
- Responsive desktop and mobile layout
- Basketball-themed hero and generated visual assets
- Highlight feed with sample player stats: points, rebounds, assists, steals, blocks, 2-point field goals, and 3-point field goals
- Search and category filters
- Like, follow, and share interactions (demo-only, browser session)
- Video upload selection and drag-and-drop local preview
- Demo “Find highlights” interaction that creates clickable sample timestamps
- Sample video modal
- Demo login/sign-up dialogs
- Accessible labels, keyboard-friendly buttons, and reduced-motion support

## Important limitations
This is a **front-end prototype**, not a production social network. Plain browser-side HTML/CSS/JS alone does not provide secure accounts, a shared public upload feed, persistent likes/follows, cloud video storage, or true AI basketball-play detection.

The highlight finder currently creates evenly spaced **sample timestamps** so you can test the interaction. It does not identify baskets or export trimmed video files. To make real automatic clipping work, connect a backend or browser ML pipeline that analyzes video frames/audio, stores clips, and returns detected time ranges. For a public social app, add authentication, storage, a database, moderation, and upload limits.

The sample video is streamed from an external video host and therefore requires an internet connection. The uploaded video preview is local to the visitor's browser and is not sent anywhere.

## Files
- `index.html` — page structure and sample feed
- `styles.css` — all responsive styling
- `app.js` — interactions and local video preview
- `assets/` — generated basketball-themed image assets

## Deploy to GitHub Pages
Push the contents of this folder to a GitHub repository, then choose **Settings → Pages → Deploy from a branch**, select your main branch and `/ (root)`. The page should be available at the GitHub Pages URL after deployment.
