# Web Serial Viewer

A modern, browser-based Serial Monitor built using the Web Serial API.

Web Serial Viewer is a lightweight yet powerful serial console designed for embedded development, firmware debugging, and real-time device monitoring — all directly in the browser.

No native application required. No drivers. Just connect and start debugging.

[https://fbiego.com/timber/](https://fbiego.com/timber/)

[Docs.md](DOCS.md)

## 🚀 Why Web Serial Viewer?

Traditional serial tools are desktop-based and platform-dependent.
Web Serial Viewer runs entirely in the browser, providing:

* Cross-platform usage
* Instant access
* Clean modern UI
* Structured log visualization
* Advanced filtering
* Safe serial lifecycle handling

Designed for developers working with embedded systems, IoT devices, and custom firmware.

## ✨ Core Features

### 🔌 Serial Communication

* Connect / Disconnect via Web Serial API
* Configurable baud rate
* Safe disconnect handling (no locked stream errors)
* Proper reader/writer lifecycle management

### 📜 Structured Log Viewer

* 3-column layout: Timestamp | Level | Message
* Collapsible timestamp and level columns
* Preserves exact whitespace formatting
* Monospace rendering for alignment
* Intelligent chunk handling (does not require newline)

### 🎛 Advanced Log Filtering

* Toggle individual log levels
* Toggle All button
* Live hidden-log counter
* Filter Active indicator
* Warnings when logs are hidden
* Export respects active filters

### ⏸ Smart Auto-Scroll

* Automatically pauses when user scrolls up
* Scroll indicator when paused
* Resumes when returning to bottom
* Behaves like professional log consoles

### 📤 Flexible Data Transmission

#### ASCII Mode

* Optional line endings (None, LF, CR, CRLF)
* Sends line ending even if input is empty
* TX logging in browser console

#### HEX Mode

* Accepts `ff 01 a0` or `0xff 0x01`
* Multiline support
* Optional delay between lines
* Input sanitization

### 💾 Log Export

* Export visible logs to file
* Warns if logs are hidden
* Respects visible columns
* Timestamped file naming

### 🧹 Log Management

* Clear logs (UI + memory)
* Prevent stale exports
* Hidden log detection

### 🔔 Toast Notification System

* Connection status
* Filter warnings
* Export warnings
* Communication loss detection
* Error feedback

### ⚙ Preferences

* Optional system timestamp fallback
* Customizable log colors
* UI state management ready for persistence

## 📸 Screenshots

![screenshot](screenshot.png?raw=true "screenshot")

Examples:

* Main UI
* Filter popup
* HEX mode
* Scroll paused indicator
* Preferences dialog

## 🖥 Browser Support

Requires Web Serial API support.

Supported:

* Google Chrome (Desktop)
* Microsoft Edge (Desktop)

Not supported:

* Safari
* Firefox
* Most mobile browsers

## 🛠 Getting Started

Serve the project using any static server:

```bash
npx serve .
```

or

```bash
python -m http.server
```

Open in Chrome or Edge and click **Connect**.

Note: HTTPS is required unless running on `localhost`.

## 🧑‍💻 Ideal For

* Embedded firmware debugging
* IoT device monitoring
* Custom logging frameworks (e.g., Timber)
* Bootloader debugging
* Manufacturing test tools
* Serial protocol inspection


