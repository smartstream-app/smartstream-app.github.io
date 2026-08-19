# SmartStream — public GitHub site

Multilingual product page and user manual for [smartstream-app.github.io](https://smartstream-app.github.io).

## Languages

Use the **EN | DA | DE | ES | FR** selector in the top bar. Choice is saved in the browser.

## Deploy

1. Copy everything in this folder to the root of `smartstream-app.github.io`
2. Commit and push — GitHub Pages serves `index.html` automatically

## Local preview

From project root:

```bash
npx serve .cursor/documentation/public
```

Open `http://localhost:3000` and test language switching + User Manual link.

## Image folders

Keep images out of the site root:

| Folder | Contents |
|--------|----------|
| `images/brand/` | Logo and TV banner (copied from the Android app) |
| `images/product/` | Product-page screenshots and store QR codes |
| `images/screenshots/` | Numbered screenshots for the user manual |

Favicons stay in the folder root so GitHub Pages can find them.
