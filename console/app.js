
/* ==========================
   STATE
========================== */

const state = {
  port: null,
  reader: null,
  connected: false,
  logs: [],
  settings: {
    baudRate: 115200,
    inputMode: "ASCII",
    lineEnding: "\\n",
    showTimestamp: true,
    showLogLevel: true,
    autoScroll: true,
    enterToSend: false,
    activeLevels: ["D", "I", "W", "E", "V", "A", "U"]
  }
};

const LEVELS = {
  D: { label: "DEBUG", color: "text-blue-400" },
  I: { label: "INFO", color: "text-green-400" },
  W: { label: "WARNING", color: "text-yellow-400" },
  E: { label: "ERROR", color: "text-red-400" },
  V: { label: "VERBOSE", color: "text-cyan-400" },
  A: { label: "WTF", color: "text-purple-400" },
  U: { label: "UNKNOWN", color: "text-gray-400" }
};

const BAUD_RATES = [9600, 19200, 38400, 115200, 230400, 460800, 921600];

state.settings.useSystemTimestamp = true;
state.settings.colorMode = "default";
state.settings.customColors = {
  D: "#60a5fa",
  I: "#4ade80",
  W: "#facc15",
  E: "#f87171",
  V: "#22d3ee",
  A: "#c084fc",
  U: "#b7b7b7"
};
state.settings.showTimestamp = true;
state.settings.showLogLevel = true;
state.autoScroll = true;


let lastKnownLevel = "U";

const LINE_ENDINGS = {
  NONE: { value: "", label: "NONE" },
  LF: { value: "\n", label: "LF (New line)" },
  CR: { value: "\r", label: "CR (Carriage Return)" },
  CRLF: { value: "\r\n", label: "CRLF" }
};


const headerTime = document.getElementById("headerTime");
const headerLevel = document.getElementById("headerLevel");
const timeIcon = document.getElementById("timeIcon");
const levelIcon = document.getElementById("levelIcon");

const logContainer = document.getElementById("logContainer");
const scrollIndicator = document.getElementById("scrollIndicator");

const asciiBtn = document.getElementById("asciiBtn");
const hexBtn = document.getElementById("hexBtn");
const asciiOptions = document.getElementById("asciiOptions");
const hexOptions = document.getElementById("hexOptions");
const enterCheckbox = document.getElementById("enterToSend");

const baudBtn = document.getElementById("baudBtn");
const filterBtn = document.getElementById("filterBtn");


const resizeHandle = document.getElementById("resizeHandle");
const textarea = document.getElementById("commandInput");

const settingsModal = document.getElementById("settingsModal");
const prefUseSystemTimestamp =
  document.getElementById("prefUseSystemTimestamp");
const customColorsContainer =
  document.getElementById("customColorsContainer");

  const lineEndingBtn = document.getElementById("lineEndingBtn");
const commandInput = document.getElementById("commandInput");
const logsDisabledIndicator =
  document.getElementById("logsDisabledIndicator");

/* ==========================
   COLUMN COLLAPSE LOGIC
========================== */


function updateColumnLayout() {

  const collapsedWidth = "36px"; // just enough for icon
  const expandedTimeWidth = "140px";
  const expandedLevelWidth = "100px";

  document.documentElement.style.setProperty(
    "--col-time",
    state.settings.showTimestamp
      ? expandedTimeWidth
      : collapsedWidth
  );

  document.documentElement.style.setProperty(
    "--col-level",
    state.settings.showLogLevel
      ? expandedLevelWidth
      : collapsedWidth
  );

  // Hide labels but keep icons visible
  document.getElementById("timeLabel").style.display =
    state.settings.showTimestamp ? "" : "none";

  document.getElementById("levelLabel").style.display =
    state.settings.showLogLevel ? "" : "none";

  // Hide row cells text only
  document.querySelectorAll(".time-cell")
    .forEach(el => {
      el.style.visibility =
        state.settings.showTimestamp ? "visible" : "hidden";
    });

  document.querySelectorAll(".level-cell")
    .forEach(el => {
      el.style.visibility =
        state.settings.showLogLevel ? "visible" : "hidden";
    });

  // Change icons
  document.getElementById("timeIcon").textContent =
    state.settings.showTimestamp ? "🕒" : "⏵";

  document.getElementById("levelIcon").textContent =
    state.settings.showLogLevel ? "🏷" : "⏵";
}


/* Toggle */
headerTime.onclick = () => {
  state.settings.showTimestamp =
    !state.settings.showTimestamp;
  updateColumnLayout();
  saveUIState();
};

headerLevel.onclick = () => {
  state.settings.showLogLevel =
    !state.settings.showLogLevel;
  updateColumnLayout();
  saveUIState();
};

updateColumnLayout();


/* ==========================
   CUSTOM BAUD POPUP
========================== */



const baudMenu = document.createElement("div");
baudMenu.className =
  "hidden absolute bg-[#28293d] border border-[#3e415b] rounded shadow-lg text-sm z-50";
document.body.appendChild(baudMenu);

function renderBaudMenu() {
  baudMenu.innerHTML = BAUD_RATES.map(rate => `
    <div class="px-4 py-2 hover:bg-[#3e415b] cursor-pointer"
         data-rate="${rate}">
         ${rate}
    </div>
  `).join("");
}

renderBaudMenu();

baudBtn.onclick = (e) => {
  const rect = baudBtn.getBoundingClientRect();
  baudMenu.style.left = rect.left + "px";
  baudMenu.style.top = rect.bottom + "px";
  baudMenu.classList.toggle("hidden");
};

baudMenu.onclick = (e) => {
  const rate = e.target.dataset.rate;
  if (!rate) return;

  state.settings.baudRate = parseInt(rate);
  baudBtn.textContent = rate + " ▼";
  baudMenu.classList.add("hidden");
  saveUIState();
};

document.addEventListener("click", e => {
  if (!baudMenu.contains(e.target) &&
    !baudBtn.contains(e.target)) {
    baudMenu.classList.add("hidden");
  }
});

/* ==========================
   FILTER MENU (ANCHOR FIX)
========================== */



const filterMenu = document.createElement("div");
filterMenu.className =
  "hidden absolute bg-[#28293d] border border-[#3e415b] rounded p-3 text-sm z-50";
document.body.appendChild(filterMenu);
filterMenu.id = "filterMenu";

filterMenu.innerHTML = `
  <div class="mb-2 font-bold text-xs text-gray-400 uppercase">Log Filters</div>
  ${Object.entries(LEVELS).map(([key, val]) => `
    <label class="flex items-center gap-2 mb-1 cursor-pointer">
      <input type="checkbox" data-level="${key}" checked>
      <span class="${val.color} font-bold">${val.label}</span>
    </label>
  `).join("")}
  <div class="mt-3 flex justify-between items-center border-t border-[#3e415b] pt-2">

  <button id="toggleAllLogsBtn"
    class="text-xs bg-[#3e415b] hover:bg-[#4e516b] px-3 py-1 rounded">
    Toggle All
  </button>

</div>

`;

filterBtn.onclick = () => {
  const rect = filterBtn.getBoundingClientRect();
  filterMenu.style.left = rect.left + "px";
  filterMenu.style.top = rect.bottom + "px";
  filterMenu.classList.toggle("hidden");
};

filterMenu.addEventListener("change", e => {
  const level = e.target.dataset.level;

  if (!level) return;

  if (e.target.checked) {
    state.settings.activeLevels.push(level);
  } else {
    state.settings.activeLevels =
      state.settings.activeLevels.filter(l => l !== level);
  }

  if (state.settings.activeLevels.length === 0) {
    showToast("All log levels disabled", "warning");
    showToast("No logs will be shown", "info");
  }

  rerenderLogs();
  updateFilterIndicators();
  saveUIState();
});

document.getElementById("toggleAllLogsBtn")
  .addEventListener("click", () => {

    const allLevels = Object.keys(LEVELS);
    const currentlyAllEnabled =
      state.settings.activeLevels.length === allLevels.length;

    if (currentlyAllEnabled) {
      // Disable all
      state.settings.activeLevels = [];
      showToast("All log levels disabled", "warning");
    } else {
      // Enable all
      state.settings.activeLevels = [...allLevels];
    }

    // Update checkboxes
    document.querySelectorAll("#filterMenu input[type='checkbox']")
      .forEach(cb => {
        cb.checked = state.settings.activeLevels.includes(
          cb.dataset.level
        );
      });

    rerenderLogs();
    updateFilterIndicators();
    saveUIState();

    if (state.settings.activeLevels.length === 0) {
      showToast("No logs will be shown", "info");
    }
  });

document.addEventListener("click", e => {
  if (!filterMenu.contains(e.target) &&
    !filterBtn.contains(e.target)) {
    filterMenu.classList.add("hidden");
  }
});


/* ==========================
   CUSTOM RESIZE HANDLE
========================== */


let isResizing = false;
let startY = 0;
let startHeight = 0;

resizeHandle.addEventListener("mousedown", (e) => {
  isResizing = true;
  startY = e.clientY;
  startHeight = textarea.offsetHeight;
  document.body.style.cursor = "row-resize";
});

document.addEventListener("mousemove", (e) => {
  if (!isResizing) return;

  const delta = startY - e.clientY;
  let newHeight = startHeight + delta;

  newHeight = Math.max(90, Math.min(400, newHeight));

  textarea.style.height = newHeight + "px";
});

document.addEventListener("mouseup", () => {
  isResizing = false;
  document.body.style.cursor = "default";
});

/* ==========================
   CONNECT
========================== */

document.getElementById("connectBtn").onclick = async () => {

  if (!navigator.serial) {
    showToast("Web Serial not supported", "error");
    return;
  }

  /* ==========================
     CONNECT
  ========================== */

  if (!state.connected) {

    try {
      state.port = await navigator.serial.requestPort();
      await state.port.open({ baudRate: state.settings.baudRate });

      state.connected = true;
      document.getElementById("connectBtn").textContent = "Disconnect";
      document.getElementById("baudBtn").classList.add("hidden");
      lastKnownLevel = "U";

      readLoop();

      showToast("Device connected", "success");

    } catch (err) {
      console.error("Connection failed:", err);
      showToast("Connection failed", "error");
    }

  }

  /* ==========================
     DISCONNECT
  ========================== */

  else {

    try {

      state.connected = false;

      // Cancel reader safely
      if (state.reader) {
        try {
          await state.reader.cancel();
        } catch (e) {
          console.warn("Reader cancel error:", e);
        }
        state.reader.releaseLock();
        state.reader = null;
      }

      // Release writer if exists
      if (state.writer) {
        try {
          state.writer.releaseLock();
        } catch (e) {
          console.warn("Writer release error:", e);
        }
        state.writer = null;
      }

      // Now safe to close port
      if (state.port) {
        await state.port.close();
        state.port = null;
      }

      showToast("Device disconnected", "error");

    } catch (err) {
      console.error("Disconnect error:", err);
      showToast("Disconnect failed", "error");
    }

    document.getElementById("connectBtn").textContent = "Connect";
    document.getElementById("baudBtn").classList.remove("hidden");
  }
};


/* ==========================
   READ LOOP
========================== */

async function readLoop() {

  const decoder = new TextDecoder();
  let buffer = "";
  let flushTimer = null;
  const FLUSH_TIMEOUT = 500; // ms

  function scheduleFlush() {

    if (flushTimer) clearTimeout(flushTimer);

    flushTimer = setTimeout(() => {
      const trimmed = buffer.trim();

      if (trimmed.length > 0) {
        addLog(trimmed);
      }

      buffer = "";

    }, FLUSH_TIMEOUT);
  }

  while (state.port?.readable && state.connected) {

    state.reader = state.port.readable.getReader();

    try {
      while (true) {

        let result;
        try {
          result = await state.reader.read();
        } catch (err) {
          showToast("Communication lost", "error");
          state.connected = false;
          document.getElementById("connectBtn").textContent = "Connect";
          document.getElementById("baudBtn").classList.remove("hidden");
          return;
        }

        const { value, done } = result;

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop();

        lines.forEach(line => {
          if (line.trim()) addLog(line);
        });

        scheduleFlush();
      }
    } finally {
      state.reader.releaseLock();
    }
  }
}


/* ==========================
   LOG RENDERING
========================== */

function formatMillis(ms) {

  ms = Number(ms) || 0;

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const millis = ms % 1000;

  return (
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0") + "." +
    String(millis).padStart(3, "0")
  );
}


function addLog(raw) {

  // Prevent empty logs
  if (!raw || !raw.trim()) return;

  raw = raw.trim();

  /*
    Match format:
    10036 [INFO]: message
    or
    [INFO]: message
  */

  const match = raw.match(/^(?:(\d+)\s+)?\[(VERBOSE|DEBUG|INFO|WARNING|ERROR|WTF|UNKNOWN)\]:\s*(.*)$/i);

  let ts = "";
  let level;
  let msg;

  const levelMap = {
    VERBOSE: "V",
    DEBUG: "D",
    INFO: "I",
    WARNING: "W",
    ERROR: "E",
    WTF: "A",
    UNKNOWN: "U"
  };

  if (match) {

    const arduinoMillis = match[1];
    const levelName = match[2].toUpperCase();
    const messagePart = match[3];

    level = levelMap[levelName] || "U";
    msg = messagePart;

    lastKnownLevel = level;

    // Timestamp handling
    if (state.settings.useSystemTimestamp) {

      // Use system millis since page load
      if (!state.systemStartTime)
        state.systemStartTime = performance.now();

      ts = formatMillis(
        Math.floor(performance.now() - state.systemStartTime)
      );


    } else if (arduinoMillis !== undefined) {

      ts = formatMillis(arduinoMillis);

    }

  } else {

    // No level match → inherit previous level
    level = lastKnownLevel || "U";
    msg = raw;

    if (state.settings.useSystemTimestamp) {

      if (!state.systemStartTime)
        state.systemStartTime = performance.now();

      ts = formatMillis(
        Math.floor(performance.now() - state.systemStartTime)
      );


    }
  }

  // Final safety fallback
  if (!level) level = "U";

  const log = {
    ts,
    level,
    msg
  };

  // Store log
  state.logs.push(log);

  // Update toolbar indicators
  updateFilterIndicators();

  // Render only if visible
  if (state.settings.activeLevels.includes(level)) {
    renderLog(log);
  }
}



function renderLog(log) {
  const row = document.createElement("div");
  row.className = "log-grid log-row hover:bg-[#2a2b3f]";



  var color_style = state.settings.colorMode === "custom"
    ? "color:" + state.settings.customColors[log.level]
    : "";

  var color_class = state.settings.colorMode === "custom"
    ? ""
    : LEVELS[log.level].color;

  var time_hide = state.settings.showTimestamp ? '' : 'style="visibility:hidden"';
  var level_hide = state.settings.showLogLevel ? 'style="' + color_style + '"' : 'style="visibility:hidden; ' + color_style + '"';

  row.innerHTML = `
    <div class="log-cell text-gray-400 time-cell" ${time_hide}>${log.ts}</div>
    <div class="log-cell font-bold level-cell ${color_class}" 
     ${level_hide}>
  ${LEVELS[log.level].label}
</div>
    <pre class="log-cell message-cell ${color_class}" style="${color_style}">${log.msg}</pre>
  `;

  const container = document.getElementById("logContainer");
  container.appendChild(row);

  const msgCell = row.querySelector(".message-cell");

  msgCell.dataset.raw = log.msg;
  msgCell.dataset.isHex = "false";

  msgCell.oncontextmenu = (e) => {

    e.preventDefault();

    const menu = document.getElementById("logContextMenu");

    menu.style.left = e.clientX + "px";
    menu.style.top = e.clientY + "px";

    menu.classList.remove("hidden");

    state.contextTarget = msgCell;
  };

  if (state.settings.autoScroll) {
    if (state.autoScroll) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }

  }
}

function rerenderLogs() {
  const container = document.getElementById("logContainer");
  container.innerHTML = "";
  state.logs.forEach(log => {
    if (state.settings.activeLevels.includes(log.level)) {
      renderLog(log);
    }
  });
}

/* ==========================
   SETTINGS LOGIC
========================== */


/* Build color pickers dynamically */
function buildColorPickers() {
  customColorsContainer.innerHTML = "";

  Object.entries(LEVELS).forEach(([key, val]) => {

    const wrapper = document.createElement("div");
    wrapper.className = "flex items-center justify-between";

    wrapper.innerHTML = `
      <span class="font-bold">${val.label}</span>
      <input type="color"
             data-level="${key}"
             value="${state.settings.customColors[key]}"
             class="w-12 h-6 p-0 border-none bg-transparent cursor-pointer">
    `;

    customColorsContainer.appendChild(wrapper);
  });
}

/* Open modal */
document.getElementById("settingsBtn").onclick = () => {

  prefUseSystemTimestamp.checked =
    state.settings.useSystemTimestamp;

  document.querySelectorAll("input[name='colorMode']")
    .forEach(r => r.checked =
      r.value === state.settings.colorMode);

  customColorsContainer.classList.toggle(
    "hidden",
    state.settings.colorMode !== "custom"
  );

  buildColorPickers();

  settingsModal.classList.remove("hidden");
};

/* Close */
document.getElementById("closeSettingsBtn").onclick =
  () => settingsModal.classList.add("hidden");

/* Radio toggle */
document.querySelectorAll("input[name='colorMode']")
  .forEach(radio => {
    radio.addEventListener("change", () => {
      state.settings.colorMode = radio.value;
      customColorsContainer.classList.toggle(
        "hidden",
        radio.value !== "custom"
      );
    });
  });

/* Save */
document.getElementById("saveSettingsBtn").onclick = () => {

  state.settings.useSystemTimestamp =
    prefUseSystemTimestamp.checked;

  if (state.settings.colorMode === "custom") {
    document.querySelectorAll("input[type='color']")
      .forEach(input => {
        const level = input.dataset.level;
        state.settings.customColors[level] = input.value;
      });
  }

  saveUIState();

  settingsModal.classList.add("hidden");
  rerenderLogs();
};

/* Load saved settings */
(function loadSettings() {
  const saved = localStorage.getItem("timber_settings");
  if (!saved) return;

  Object.assign(state.settings, JSON.parse(saved));
})();

const SETTINGS_VERSION = 1;

function saveUIState() {
  localStorage.setItem(
    "timber_settings",
    JSON.stringify({
      version: SETTINGS_VERSION,
      data: state.settings
    })
  );
}

function loadUIState() {
  const saved = localStorage.getItem("timber_settings");
  if (!saved) return;

  const parsed = JSON.parse(saved);

  if (parsed.version === SETTINGS_VERSION) {
    Object.assign(state.settings, parsed.data);
  }
}

function restoreUI() {

  // Baud rate
  baudBtn.textContent = state.settings.baudRate + " ▼";

  // Input mode
  if (state.settings.inputMode === "HEX") {
    hexBtn.click();
  } else {
    asciiBtn.click();
  }

  // Line ending label
  const endingKey = Object.entries(LINE_ENDINGS)
    .find(([k, v]) => v.value === state.settings.lineEnding)?.[0];

  if (endingKey) {
    lineEndingBtn.textContent =
      `Line Ending: ${endingKey} ▼`;
  }

  // Filters
  document.querySelectorAll("#filterMenu input[type='checkbox']")
    .forEach(cb => {
      cb.checked =
        state.settings.activeLevels.includes(cb.dataset.level);
    });

  // Column layout
  updateColumnLayout();

  // Filter indicators
  updateFilterIndicators();

  // HEX options
  document.getElementById("hexMultiline").checked =
    state.settings.hexMultiline || false;

  document.getElementById("hexDelayToggle").checked =
    state.settings.hexDelayEnabled || false;

  document.getElementById("hexDelayInput").value =
    state.settings.hexDelayMs || 500;

  
  document.getElementById("enterToSend").checked = state.settings.enterToSend;

  document.getElementById("enterToSend").disabled = state.settings.hexMultiline && state.settings.inputMode === "HEX";

  if (document.getElementById("hexMultiline").checked) {
    document.getElementById("hexDelayLabel").classList.remove("hidden");
    document.getElementById("hexDelayInput").classList.remove("hidden");
  } else {
    document.getElementById("hexDelayLabel").classList.add("hidden");
    document.getElementById("hexDelayInput").classList.add("hidden");
  }
}





/* ==========================
   MODE SWITCH
========================== */



state.settings.inputMode = "ASCII";

asciiBtn.onclick = () => {
  state.settings.inputMode = "ASCII";
  asciiBtn.classList.add("bg-[#3e415b]");
  hexBtn.classList.remove("bg-[#3e415b]");
  asciiOptions.classList.remove("hidden");
  hexOptions.classList.add("hidden");

  enterCheckbox.disabled = false;

  saveUIState();
};

hexBtn.onclick = () => {
  state.settings.inputMode = "HEX";
  hexBtn.classList.add("bg-[#3e415b]");
  asciiBtn.classList.remove("bg-[#3e415b]");
  asciiOptions.classList.add("hidden");
  hexOptions.classList.remove("hidden");

  if (state.settings.hexMultiline) {
    enterCheckbox.disabled = true;
  } else {
    enterCheckbox.disabled = false;
  }

  saveUIState();
};



/* ==========================
   CUSTOM LINE ENDING POPUP
========================== */

const lineEndingMenu = document.createElement("div");
lineEndingMenu.className =
  "hidden absolute bg-[#28293d] border border-[#3e415b] rounded text-xs z-50";
document.body.appendChild(lineEndingMenu);



function renderLineEndingMenu() {
  lineEndingMenu.innerHTML = Object.entries(LINE_ENDINGS)
    .map(([key, obj]) => `
      <div class="px-4 py-2 hover:bg-[#3e415b] cursor-pointer"
           data-ending="${key}">
        ${obj.label}
      </div>
    `)
    .join("");
}


renderLineEndingMenu();

lineEndingBtn.onclick = () => {

  lineEndingMenu.classList.remove("hidden");

  // Temporarily make visible to measure height
  lineEndingMenu.style.visibility = "hidden";
  lineEndingMenu.style.display = "block";

  positionPopup(lineEndingBtn, lineEndingMenu);

  lineEndingMenu.style.visibility = "visible";

};


lineEndingMenu.onclick = (e) => {

  const key = e.target.dataset.ending;
  if (!key) return;

  state.settings.lineEnding = LINE_ENDINGS[key].value;
  lineEndingBtn.textContent =
    `Line Ending: ${key} ▼`;
  // CLOSE POPUP
  lineEndingMenu.classList.add("hidden");
  lineEndingMenu.style.display = "none";

  saveUIState();
};

document.addEventListener("click", (e) => {

  if (!lineEndingMenu.contains(e.target) &&
    !lineEndingBtn.contains(e.target)) {
    lineEndingMenu.classList.add("hidden");
    lineEndingMenu.style.display = "none";
  }

});

function positionPopup(button, popup) {

  const rect = button.getBoundingClientRect();
  const popupHeight = popup.offsetHeight || 150;
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  // Horizontal align left edge
  popup.style.left = rect.left + "px";

  // Decide open direction
  if (spaceBelow < popupHeight && spaceAbove > popupHeight) {
    // Open upward
    popup.style.top = (rect.top - popupHeight) + "px";
  } else {
    // Open downward
    popup.style.top = rect.bottom + "px";
  }
}



/* ==========================
   HEX INPUT VALIDATION
========================== */


commandInput.addEventListener("input", () => {

  if (state.settings.inputMode !== "HEX") return;

  let value = commandInput.value;

  // Remove 0x if typed
  value = value.replace(/0x/gi, "");

  // Allow only hex and spaces
  value = value.replace(/[^0-9a-fA-F\s]/g, "");

  commandInput.value = value;
});



/* ==========================
   HEX SEND DATA
========================== */

async function sendData() {

  if (!state.port?.writable) {
    showToast("Serial error", "error");
    return;
  }

  const rawInput = commandInput.value;
  const trimmedInput = rawInput.trim();

  const isASCII = state.settings.inputMode === "ASCII";
  const lineEnding = state.settings.lineEnding || "";

  const shouldSendLineEndingOnly =
    isASCII && !trimmedInput && lineEnding.length > 0;

  // Block only if:
  // - No input
  // - AND not sending line-ending-only
  if (!trimmedInput && !shouldSendLineEndingOnly) {
    showToast("Nothing to send", "error");
    return;
  }

  const writer = state.port.writable.getWriter();

  try {

    /* =======================
       ASCII MODE
    ======================= */

    if (isASCII) {

      const payload = rawInput + lineEnding;

      console.log(
        "%c[TX ASCII]",
        "color:#4ade80;font-weight:bold;",
        JSON.stringify(payload)
      );

      await writer.write(
        new TextEncoder().encode(payload)
      );
    }

    /* =======================
       HEX MODE
    ======================= */

    else {

      const multiline =
        document.getElementById("hexMultiline").checked;

      const delayEnabled =
        document.getElementById("hexDelayToggle").checked;

      const delayMs = parseInt(
        document.getElementById("hexDelayInput").value || 0
      );

      const lines = multiline
        ? rawInput.split(/\r?\n/)
        : [rawInput];

      for (const line of lines) {

        const clean = line
          .replace(/0x/gi, "")
          .replace(/\s+/g, "");

        if (!clean) continue;

        const bytes = clean.match(/.{1,2}/g);
        if (!bytes) continue;

        console.log(
          "%c[TX HEX]",
          "color:#facc15;font-weight:bold;",
          bytes.join(" ")
        );

        const buffer = new Uint8Array(
          bytes.map(b => parseInt(b, 16))
        );

        await writer.write(buffer);

        if (multiline && delayEnabled && delayMs > 0) {
          await new Promise(resolve =>
            setTimeout(resolve, delayMs)
          );
        }
      }
    }

  } catch (err) {
    console.error("TX error:", err);
    showToast("TX error: ${err}", "error");
  } finally {
    writer.releaseLock();
  }

  commandInput.value = "";
}

document.getElementById("hexMultiline").onchange = () => {

  const enabled =
    document.getElementById("hexMultiline").checked;

  state.settings.hexMultiline = enabled;


  if (enabled) {
    // enterCheckbox.checked = false;
    enterCheckbox.disabled = true;
    // state.settings.enterToSend = false;
  } else {
    enterCheckbox.disabled = false;
  }

  if (enabled) {
    document.getElementById("hexDelayLabel").classList.remove("hidden");
    document.getElementById("hexDelayInput").classList.remove("hidden");
  } else {
    document.getElementById("hexDelayLabel").classList.add("hidden");
    document.getElementById("hexDelayInput").classList.add("hidden");
  }

  state.settings.hexMultiline = document.getElementById("hexMultiline").checked;
  saveUIState();
  
};

document.getElementById("hexDelayToggle").onchange = () => {
  state.settings.hexDelayEnabled = document.getElementById("hexDelayToggle").checked;
  saveUIState();
}


document.getElementById("hexDelayInput").onchange = () => {
  state.settings.hexDelayMs = document.getElementById("hexDelayInput").value;
  saveUIState();
}

/* ==========================
   SAVE LOGS
========================== */

document.getElementById("saveBtn").onclick = () => {

  if (!state.logs.length) {
    showToast("No logs to save", "error");
    return;
  }

  const lines = state.logs
    .filter(log => state.settings.activeLevels.includes(log.level))
    .map(log => {

      const parts = [];

      if (state.settings.showTimestamp && log.ts)
        parts.push(log.ts);

      if (state.settings.showLogLevel)
        parts.push(LEVELS[log.level].label);

      parts.push(log.msg);

      return parts.join(" | ");
    });

  if (!lines.length) {
    showToast("All logs hidden", "error");
    return;
  }

  // 🔥 NEW WARNING
  const totalLogs = state.logs.length;
  const visibleLogs = lines.length;

  if (visibleLogs < totalLogs) {
    showToast(
      `${totalLogs - visibleLogs} logs hidden by filter and will not be exported`,
      "warning"
    );
  }

  const content = lines.join("\n");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `timber_logs_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/* ==========================
   TOAST SYSTEM
========================== */

function showToast(message, type = "info") {

  const container = document.getElementById("toastContainer");

  const colors = {
    info: "bg-blue-600",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    error: "bg-red-600"
  };

  const toast = document.createElement("div");
  toast.className = `
    ${colors[type] || colors.info}
    text-white px-4 py-3 rounded shadow-lg
    text-sm min-w-[240px]
    transform transition-all duration-300
    translate-x-2 opacity-0
  `;

  toast.textContent = message;

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove("translate-x-2", "opacity-0");
  });

  // Auto remove
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-x-2");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}


function positionToastContainer() {

  const toolbar = document.getElementById("toolbar");
  // If you have multiple, better give toolbar an ID.

  const rect = toolbar.getBoundingClientRect();

  const container = document.getElementById("toastContainer");

  container.style.top = rect.bottom + 12 + "px";
}

window.addEventListener("resize", positionToastContainer);
window.addEventListener("load", positionToastContainer);


document.getElementById("clearBtn").addEventListener("click", () => {

  // Clear stored logs
  state.logs = [];

  // Clear UI container
  const container = document.getElementById("logContainer");
  container.innerHTML = "";

  updateFilterIndicators();

  state.autoScroll = true;
  scrollIndicator.classList.add("hidden");

  showToast("Logs cleared", "info");
});

/* ==========================
   LOG CONTAINER
========================== */




function isScrolledToBottom() {
  return (
    logContainer.scrollTop + logContainer.clientHeight >=
    logContainer.scrollHeight - 5
  );
}

logContainer.addEventListener("scroll", () => {

  if (isScrolledToBottom()) {
    state.autoScroll = true;
    scrollIndicator.classList.add("hidden");
  } else {
    state.autoScroll = false;
    scrollIndicator.classList.remove("hidden");
  }
});


scrollIndicator.addEventListener("click", () => {
  logContainer.scrollTop = logContainer.scrollHeight;
  state.autoScroll = true;
  scrollIndicator.classList.add("hidden");
});



function updateFilterIndicators() {

  const totalLevels = Object.keys(LEVELS).length;
  const activeCount = state.settings.activeLevels.length;

  const filterActiveIndicator =
    document.getElementById("filterActiveIndicator");

  const hiddenLogsIndicator =
    document.getElementById("hiddenLogsIndicator");

  /* ==========================
     FILTER ACTIVE?
  ========================== */

  if (activeCount < totalLevels) {
    filterActiveIndicator.classList.remove("hidden");
  } else {
    filterActiveIndicator.classList.add("hidden");
  }

  /* ==========================
     HIDDEN LOGS?
  ========================== */

  const hiddenCount = state.logs.filter(
    log => !state.settings.activeLevels.includes(log.level)
  ).length;

  if (hiddenCount > 0) {
    hiddenLogsIndicator.classList.remove("hidden");
    hiddenLogsIndicator.textContent =
      `👁 ${hiddenCount} Hidden`;
  } else {
    hiddenLogsIndicator.classList.add("hidden");
  }
}

function stringToHex(str) {

  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);

  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, "0"))
    .join(" ");
}


document.getElementById("filterActiveIndicator")
  .addEventListener("click", () => {
    filterMenu.classList.remove("hidden");
  });

document.getElementById("hiddenLogsIndicator")
  .addEventListener("click", () => {
    filterMenu.classList.remove("hidden");
  });



document.getElementById("viewHexOption").onclick = (e) => {

  const cell = state.contextTarget;
  if (!cell) return;

  if (cell.dataset.isHex === "true") {

    cell.textContent = cell.dataset.raw;
    cell.dataset.isHex = "false";
  } else {

    cell.textContent = stringToHex(cell.dataset.raw);
    cell.dataset.isHex = "true";

  }

  hideContextMenu();
};

document.getElementById("copyHexOption").onclick = () => {

  const cell = state.contextTarget;
  if (!cell) return;

  const hex = stringToHex(cell.dataset.raw);

  navigator.clipboard.writeText(hex);

  showToast("HEX copied", "success");

  hideContextMenu();
};

document.getElementById("copyASCIIOption").onclick = () => {

  const cell = state.contextTarget;
  if (!cell) return;

  navigator.clipboard.writeText(cell.dataset.raw);

  showToast("ASCII copied", "success");

  hideContextMenu();
};

function hideContextMenu() {
  document.getElementById("logContextMenu")
    .classList.add("hidden");
}

document.addEventListener("click", hideContextMenu);

document.getElementById("enterToSend").onchange = (e) => {

  state.settings.enterToSend = e.target.checked;

  saveUIState();
};

commandInput.addEventListener("keydown", (e) => {

  if (!state.settings.enterToSend) return;

  if (state.settings.inputMode === "HEX" &&
      state.settings.hexMultiline) return;

  if (e.key === "Enter") {

    e.preventDefault();

    sendData();
  }
});


const aboutDialog = document.getElementById("aboutDialog");

document.getElementById("aboutBtn").onclick = () => {
  aboutDialog.classList.remove("hidden");
};

document.getElementById("aboutCloseBtn").onclick = () => {
  aboutDialog.classList.add("hidden");
};

document.getElementById("aboutOkBtn").onclick = () => {
  aboutDialog.classList.add("hidden");
};

// Close when clicking outside dialog
aboutDialog.addEventListener("click", (e) => {
  if (e.target === aboutDialog) {
    aboutDialog.classList.add("hidden");
  }
});


document.getElementById("sendBtn").addEventListener("click", sendData);

loadUIState();
restoreUI();
