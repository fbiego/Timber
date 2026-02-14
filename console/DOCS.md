
# Web Serial Viewer Docs

A modern browser-based Serial Monitor built using the Web Serial API.

Web Serial Viewer provides structured log visualization, advanced filtering, intelligent auto-scroll behavior, and flexible data transmission — all inside the browser.

# Table of Contents

1. Connect / Disconnect
2. Baud Rate Selection
3. Log Viewer Layout
4. Log Levels
5. Log Filtering
6. Hidden Logs Indicator
7. Scroll Pause / Resume
8. ASCII Transmission
9. HEX Transmission
10. Clear Logs
11. Export Logs
12. Toast Notifications
13. Preferences
14. Toolbar Indicators

# Connect / Disconnect

## What It Does

The **Connect** button allows the user to select and open a serial device using the Web Serial API.

Once connected:

* The button label changes to **Disconnect**
* The application begins reading incoming serial data
* A toast confirms connection

When clicked while connected:

* Serial reader is safely cancelled
* Writer locks are released
* Port is closed
* UI updates to disconnected state
* A disconnect toast is shown

## Behavior Details

* Prevents closing a locked stream
* Properly cancels reader before closing port
* Safe reconnection supported
* Shows error toast if connection fails


# Baud Rate Selection

## What It Does

Allows selection of the serial baud rate before connecting.

## Behavior

* Applied when opening port
* Can be changed before connecting
* Uses modal-style popup selection
* Ensures correct serial configuration



# Log Viewer Layout

Logs are displayed in a structured 3-column grid:

| Timestamp | Level | Message |

## Column Controls

* Timestamp column can be collapsed
* Level column can be collapsed
* Message column expands automatically

## Behavior

* Columns maintain minimal width when collapsed
* Layout remains stable
* Header icons indicate collapsed/expanded state
* Right click for Hex view & copy as hex



# Log Levels

Supported levels:

* DEBUG
* INFO
* WARNING
* ERROR
* VERBOSE
* WTF
* UNKNOWN

## Automatic Behavior

If a log line:

* Does not include a level
* It inherits the previous log level
* If no previous level exists → defaults to UNKNOWN

UNKNOWN logs are shown in gray by default.



# Log Filtering

## What It Does

Allows enabling/disabling specific log levels.

## Features

* Individual level toggle
* Toggle All button
* Filter Active indicator when not all levels enabled
* Toast warning when all logs disabled

## Behavior

* Filter affects:

  * Display
  * Export
* Hidden logs remain stored internally



# Hidden Logs Indicator

## What It Shows

Displays number of logs currently hidden by filters.

Example:

```
👁 12 Hidden
```

## When It Appears

* When logs exist that are filtered out
* Updates live as logs arrive

Clicking it opens filter menu.



# Scroll Pause / Resume

## What It Does

Automatically pauses auto-scroll when the user scrolls up.

## Behavior

* If user scrolls up → auto-scroll pauses
* Indicator appears:

  ```
  ⏸ Scroll Paused
  ```
* If user scrolls back to bottom → auto-scroll resumes
* Clicking indicator resumes scroll immediately

## Why This Matters

Prevents the UI from jumping while reviewing previous logs.


# ASCII Transmission

## What It Does

Sends plain text data to the connected device.

## Features

* Optional line ending:

  * None
  * LF
  * CR
  * CRLF
* Sends line ending even if input is empty
* Use Enter key as send
* TX console logging:

  ```
  [TX ASCII]
  ```

## Behavior

* Preserves user-entered spaces
* Uses TextEncoder
* Safe writer locking



# HEX Transmission

## What It Does

Sends raw hexadecimal byte sequences.

## Input Rules

Accepts:

```
ff 01 a0
0xff 0x01
```

Automatically:

* Removes invalid characters
* Strips 0x prefix
* Groups bytes correctly

## Additional Features

* Multiline mode
* Optional delay between lines
* Use Enter key as send when not in Multiline mode
* TX console log:

  ```
  [TX HEX]
  ```


# Clear Logs

## What It Does

Clears:

* UI log display
* Internal log memory

Prevents previously received logs from being exported after clearing.

## Behavior

* Immediate UI update
* Toast confirmation

# Export Logs

## What It Does

Exports visible logs to file.

## Rules

* Exports only logs visible under current filter
* Shows error if:

  * No logs exist
  * All logs filtered out
* Shows warning if:

  * Some logs hidden and will not be exported

Respects:

* Timestamp visibility
* Level visibility


# Toast Notifications

Top-right dynamic toast system.

Used for:

* Device connected
* Device disconnected
* Communication lost
* Filter warnings
* Export warnings
* Unsupported browser


# Preferences

Includes:

* Use system timestamp if device does not provide one
* Customizable log colors
* Saved preferences support



# Toolbar Indicators

Right-aligned indicators provide live status:

* Filter Active
* Hidden Logs
* Scroll Paused

Provides quick visibility of system state.


# Browser Requirements

Requires Web Serial API support.

Supported:

* Chrome (Desktop)
* Edge (Desktop)


# Running Locally

Serve with any static server:

```bash
npx serve .
```

or

```bash
python -m http.server
```

HTTPS required unless using localhost.
