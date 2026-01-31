# Banker - Central Control Tool

## Description

An **offline-first**, **privacy-first**, and **local-first** PWA designed as the central processing hub for the bet ecosystem.  
It allows you to import multiple JSON files exported from Collector app, consolidate all daily operations, calculate global totals instantly, and scan for winners with a single winning number input.

Banker acts as the "Master App" — receiving, merging, and settling data from all collectors while keeping everything 100% local on your device.

## Features

- **Multi-Collector Import**: Load and process several `.json` files at once to centralize the day's bets.
- **Global Accounting**: Real-time totals for Fijos, Corridos, and Grand Balance.
- **Winner Scanner ("Corte")**: Enter the winning number (00–99) → instantly highlights all winners across every imported collector.
- **Detailed Payout List**: Shows winner name, collector origin, bet type (fijo/corrido), played amount, and prize calculation.
- **Smart Number Formatting**: Normalizes inputs like "5" → "05" for perfect matching during winner scan.
- **Duplicate Protection**: Automatically detects and blocks re-importing the same collector's file (via metadata + timestamp checks).
- **Full Persistence**: Imported data, totals, and settings survive browser/tab/app closure (Local Storage).
- **Installable PWA**: Works fully offline, add to home screen with a premium golden/dark aesthetic.
- **100% Offline**: No internet needed — import files, calculate, and settle locally.
- Native file import via browser file picker (drag & drop or select multiple files).

## Privacy and Data

Just like Collector, Banker follows a strict **zero-server policy**.  
All financial data, collector lists, imported JSONs, and prize calculations stay **exclusively on your device**.  
Nothing is ever sent to any server. You control everything.

## Technologies

- HTML5, CSS3 & Vanilla JavaScript (no frameworks)
- Service Worker → offline support & asset caching
- Local Storage → persistent storage of bets & collector settings
- Web App Manifest → proper PWA install experience
- File System Access (via `<input type="file">` + multiple) — Smooth import of collector JSONs.

## Ecosystem Workflow

1. **Collect** — Your listeros use the Collector app to register bets and export `.json` files.
2. **Import** — Open Banker and load all files (multiple selection supported).
3. **Settle** — Input the winning number → Banker scans everything and shows exact winners, amounts, and totals to pay.
4. **Repeat** — Data persists for the day; clear when ready for next cycle.

## Try Banker

You can try the application live here:  
→ [cesarsullen.github.io/banker](https://cesarsullen.github.io/banker)

It pairs perfectly with Collector to make your entire operation faster, safer, and fully private.

## License

Licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.
