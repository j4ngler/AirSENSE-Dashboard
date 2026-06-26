(function () {
  const refs = {
    deviceSelect: document.getElementById("deviceSelect"),
    startMeasureBtn: document.getElementById("startMeasureBtn"),
    stopMeasureBtn: document.getElementById("stopMeasureBtn"),
    statusContent: document.getElementById("statusContent"),
    temperature: document.getElementById("temperature"),
    humidity: document.getElementById("humidity"),
    wifiSignal: document.getElementById("wifiSignal"),
    wifiSSID: document.getElementById("wifiSSID"),
    wifiChip: document.getElementById("wifiChip"),
    selectedDeviceText: document.getElementById("selectedDeviceText"),
    activeMeasurementAlert: document.getElementById("activeMeasurementAlert"),
    activeMeasurementFileName: document.getElementById("activeMeasurementFileName"),
    fileServerText: document.getElementById("fileServerText"),
    currentEspIpLink: document.getElementById("currentEspIpLink"),
    totalDevices: document.getElementById("totalDevices"),
    onlineDevices: document.getElementById("onlineDevices"),
    offlineDevices: document.getElementById("offlineDevices"),
    recentCommands: document.getElementById("recentCommands"),
    heatingSwitch: document.getElementById("heatingSwitch"),
    airPumpSwitch: document.getElementById("airPumpSwitch"),
    sensorChannelsGrid: document.getElementById("sensorChannelsGrid"),
    sensorChannelCrudBody: document.getElementById("sensorChannelCrudBody"),
    newChIndex: document.getElementById("newChIndex"),
    newChLabel: document.getElementById("newChLabel"),
    newChUnit: document.getElementById("newChUnit"),
    newChSort: document.getElementById("newChSort"),
    addSensorChannelBtn: document.getElementById("addSensorChannelBtn"),
  };

  const history = { temp: [], hum: [], adcByIndex: {} };
  /** Thứ tự cột CSV chuẩn (ảnh mẫu TimeStamp, Temp, Hum, EtOH3…6, EtOH1…2, VOC1…2). */
  const STANDARD_CSV_SENSOR_ORDER = ["EtOH3", "EtOH4", "EtOH5", "EtOH6", "EtOH1", "EtOH2", "VOC1", "VOC2"];
  const ADC_LABEL_ORDER = ["EtOH1", "EtOH2", "EtOH3", "EtOH4", "EtOH5", "EtOH6", "VOC1", "VOC2"];
  let activeSensorChannels = [];
  let isSyncingSwitches = false;

  /** Sau khi bật/tắt qua API, Mongo/status có thể còn trễ — tránh ghi đè switch ngay lập tức. */
  const switchServerOptimism = {
    heating: /** @type {{ value: boolean; until: number } | null} */ (null),
    pump: null,
  };

  function armSwitchOptimism(kind, value) {
    switchServerOptimism[kind] = { value: !!value, until: Date.now() + 25000 };
  }

  function resolveOptimisticSwitch(kind, serverVal) {
    const pend = switchServerOptimism[kind];
    const server = !!serverVal;
    if (!pend) return server;
    if (Date.now() > pend.until) {
      switchServerOptimism[kind] = null;
      return server;
    }
    if (server === pend.value) {
      switchServerOptimism[kind] = null;
      return server;
    }
    return pend.value;
  }
  let trendChart = null;
  let adcTrendChart = null;

  /** Màu 8 đường ADC — tông giống biểu đồ nhiệt độ/ẩm (line + vùng mờ). */
  const ADC_CHART_STYLES = [
    ["#6366f1", "rgba(99,102,241,.14)"],
    ["#a855f7", "rgba(168,85,247,.14)"],
    ["#ec4899", "rgba(236,72,153,.14)"],
    ["#f97316", "rgba(249,115,22,.14)"],
    ["#14b8a6", "rgba(20,184,166,.14)"],
    ["#22c55e", "rgba(34,197,94,.14)"],
    ["#eab308", "rgba(234,179,8,.16)"],
    ["#0ea5e9", "rgba(14,165,233,.14)"],
  ];

  function log(message, payload) {
    if (payload !== undefined) console.log(message, payload);
    else console.log(message);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function toDateTimeLocalValue(d) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  /** Luôn gán khoảng 24h gần nhất (không còn UI chọn ngày). */
  function applySliding24hHistoryRange() {
    const toEl = document.getElementById("toTime");
    const fromEl = document.getElementById("fromTime");
    if (!toEl || !fromEl) return;
    const now = new Date();
    const from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    toEl.value = toDateTimeLocalValue(now);
    fromEl.value = toDateTimeLocalValue(from);
  }

  function userMessageFromError(err) {
    const raw = String(err?.message || err || "");
    if (/500|502|503/.test(raw)) {
      return "Không lấy được dữ liệu từ máy chủ. Vui lòng thử lại sau hoặc kiểm tra cơ sở dữ liệu và MQTT.";
    }
    if (/404/.test(raw)) return "Không tìm thấy dữ liệu cho thiết bị này.";
    if (/Failed to fetch|NetworkError|fetch/i.test(raw)) return "Không kết nối được tới máy chủ. Kiểm tra mạng hoặc địa chỉ ứng dụng.";
    return "Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.";
  }

  function emptyStateSensorsHtml() {
    return `<div class="col-12">
      <div class="empty-state" role="status">
        <div class="empty-state__icon"><i class="bi bi-cpu"></i></div>
        <div class="empty-state__title">Chưa có dữ liệu cảm biến cấu hình</div>
        <p class="empty-state__hint">Chưa có kênh nào trong SQL cho thiết bị này, hoặc API lỗi. Kiểm tra PostgreSQL trong .env, chạy <code>node scripts/init-pg-schema.js</code> (bảng <code>enose_sensor_channels</code>), hoặc vào <strong>Quản lý thiết bị</strong> để thêm kênh thủ công.</p>
      </div>
    </div>`;
  }

  function emptyStateChannelsTableHtml() {
    return `<tr><td colspan="6">
      <div class="empty-state empty-state--inline" role="status">
        <div class="empty-state__icon"><i class="bi bi-hdd-network"></i></div>
        <div class="empty-state__title">Không tải được danh sách kênh</div>
        <p class="empty-state__hint mb-0">Kiểm tra máy chủ hoặc cấu hình cơ sở dữ liệu (xem README).</p>
      </div>
    </td></tr>`;
  }

  function emptyStateHistoryRows() {
    return `<tr><td colspan="4"><div class="empty-state empty-state--inline">
      <div class="empty-state__icon"><i class="bi bi-database-x"></i></div>
      <div class="empty-state__title">Không tải được lịch sử</div>
      <p class="empty-state__hint">Vui lòng thử lại hoặc kiểm tra MongoDB và khoảng thời gian đã chọn.</p>
    </div></td></tr>`;
  }

  function showAppBanner(message, variant) {
    const el = document.getElementById("appBanner");
    if (!el) return;
    const v = variant === "danger" ? "danger" : variant === "success" ? "success" : "info";
    el.className = `app-banner app-banner--${v}`;
    el.innerHTML = `<div class="app-banner__inner">
      <i class="bi ${v === "danger" ? "bi-exclamation-triangle" : "bi-info-circle"}"></i>
      <span class="app-banner__text">${escapeHtml(message)}</span>
      <button type="button" class="app-banner__close btn btn-sm btn-link" aria-label="Đóng">Đóng</button>
    </div>`;
    const close = el.querySelector(".app-banner__close");
    if (close) close.addEventListener("click", hideAppBanner);
  }

  function hideAppBanner() {
    const el = document.getElementById("appBanner");
    if (!el) return;
    el.className = "app-banner app-banner--hidden";
    el.innerHTML = "";
  }

  async function api(path, options) {
    const headers = Object.assign({ "Content-Type": "application/json" }, options?.headers || {});
    const response = await fetch(path, Object.assign({}, options || {}, { headers }));
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }
    if (!response.ok) throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(data)}`);
    return data;
  }

  function getSelectedDeviceId() {
    return refs.deviceSelect.value;
  }

  function renderSparkline(targetId, series, color) {
    const svg = document.getElementById(targetId);
    if (!svg || !series.length) return;
    const width = 120;
    const height = 24;
    const min = Math.min(...series);
    const max = Math.max(...series);
    const range = max - min || 1;
    const points = series
      .map((v, i) => {
        const x = (i / Math.max(series.length - 1, 1)) * width;
        const y = height - ((v - min) / range) * (height - 2) - 1;
        return `${x},${y}`;
      })
      .join(" ");
    svg.innerHTML = `<path d="M ${points.replace(/ /g, " L ")}" stroke="${color}"></path>`;
  }

  function adcColorByValue(value) {
    const n = Number(value || 0);
    if (n < 350) return "linear-gradient(90deg,#38bdf8,#22c55e)";
    if (n < 700) return "linear-gradient(90deg,#facc15,#fb923c)";
    return "linear-gradient(90deg,#f97316,#ef4444)";
  }

  function pushHistory(series, value, maxLength) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return;
    series.push(Number(value));
    if (series.length > maxLength) series.shift();
  }

  function ensureAdcHistory(idx) {
    const k = String(idx);
    if (!history.adcByIndex[k]) history.adcByIndex[k] = [];
    return history.adcByIndex[k];
  }

  function readNamedSensor(obj, name) {
    if (!obj || !name) return null;
    if (obj[name] != null) return obj[name];
    const low = String(name).toLowerCase();
    for (const k of Object.keys(obj)) {
      if (k.toLowerCase() === low) return obj[k];
    }
    return null;
  }

  function readAdcValue(content, idx, label) {
    if (!content) return null;
    const lab = String(label || "").trim();
    if (lab) {
      const byName = readNamedSensor(content, lab);
      if (byName != null && !Number.isNaN(Number(byName))) return Number(byName);
    }
    if (Array.isArray(content.adc)) {
      const v = content.adc[idx];
      if (v != null && !Number.isNaN(Number(v))) return Number(v);
    }
    return content[`ADC${idx}`] ?? content[`adc${idx}`] ?? null;
  }

  function renderSensorCards() {
    const grid = refs.sensorChannelsGrid;
    if (!grid) return;
    grid.innerHTML = "";
    if (!activeSensorChannels.length) {
      grid.innerHTML = emptyStateSensorsHtml();
      return;
    }
    const sorted = [...activeSensorChannels].sort((a, b) => {
      const so = (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0);
      if (so !== 0) return so;
      return (Number(a.channel_index) || 0) - (Number(b.channel_index) || 0);
    });
    sorted.forEach((ch) => {
      const idx = Number(ch.channel_index);
      const unit = ch.unit || "ADC";
      const col = document.createElement("div");
      col.className = "col-6 col-md-3";
      col.innerHTML = `
        <div class="mq-sensor-card">
          <div class="mq-sensor-label">${escapeHtml(ch.label)} <small class="text-muted">(ADC${idx})</small></div>
          <div class="mq-sensor-value" id="sensorAdc_${idx}">--</div>
          <svg id="sensorAdcSpark_${idx}" class="sparkline" viewBox="0 0 120 24" preserveAspectRatio="none"></svg>
          <div class="adc-progress"><div class="adc-fill" id="sensorAdcFill_${idx}"></div></div>
          <div class="mq-sensor-unit">${escapeHtml(unit)}</div>
        </div>`;
      grid.appendChild(col);
    });
  }

  function renderCrudTable() {
    const tbody = refs.sensorChannelCrudBody;
    if (!tbody) return;
    tbody.innerHTML = "";
    if (!activeSensorChannels.length) {
      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td colspan="6"><span class="text-muted">Chưa có kênh. Thêm kênh bên dưới hoặc kiểm tra kết nối máy chủ.</span></td>';
      tbody.appendChild(tr);
      return;
    }
    const sorted = [...activeSensorChannels].sort((a, b) => {
      const so = (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0);
      if (so !== 0) return so;
      return (Number(a.channel_index) || 0) - (Number(b.channel_index) || 0);
    });
    sorted.forEach((ch) => {
      const tr = document.createElement("tr");
      tr.dataset.channelId = String(ch.sensor_channel_id);
      tr.innerHTML = `
        <td>${escapeHtml(String(ch.sensor_channel_id))}</td>
        <td><input class="form-control form-control-sm ch-inp" data-field="channel_index" type="number" min="0" max="31" value="${escapeHtml(String(ch.channel_index))}" /></td>
        <td><input class="form-control form-control-sm ch-inp" data-field="label" type="text" value="${escapeHtml(ch.label || "")}" /></td>
        <td><input class="form-control form-control-sm ch-inp" data-field="unit" type="text" value="${escapeHtml(ch.unit || "ADC")}" /></td>
        <td><input class="form-control form-control-sm ch-inp" data-field="sort_order" type="number" value="${escapeHtml(String(ch.sort_order ?? 0))}" /></td>
        <td class="text-nowrap">
          <button type="button" class="btn btn-sm btn-outline-primary ch-save">Lưu</button>
          <button type="button" class="btn btn-sm btn-outline-danger ch-del">Xóa</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  async function loadSensorChannels() {
    const id = getSelectedDeviceId();
    if (!id) {
      activeSensorChannels = [];
      renderSensorCards();
      renderCrudTable();
      return;
    }
    try {
      const res = await api(`/api/enose/devices/${encodeURIComponent(id)}/sensor-channels`);
      activeSensorChannels = Array.isArray(res.channels) ? res.channels : [];
    } catch (e) {
      activeSensorChannels = [];
      log(e.message);
      if (refs.sensorChannelsGrid) refs.sensorChannelsGrid.innerHTML = emptyStateSensorsHtml();
      if (refs.sensorChannelCrudBody) refs.sensorChannelCrudBody.innerHTML = emptyStateChannelsTableHtml();
      return;
    }
    renderSensorCards();
    renderCrudTable();
  }

  function extractHistoryPoint(item) {
    const src = item?.content || item || {};
    const ts = item?.timestamp || item?.time || item?.created_at || item?.updated_at || new Date().toISOString();
    const adc = [];
    for (let i = 0; i < 32; i += 1) {
      let v = src[`ADC${i}`] ?? src[`adc${i}`] ?? null;
      if ((v === null || v === undefined) && Array.isArray(src.adc)) v = src.adc[i];
      adc[i] = v;
    }
    const sensors = {};
    for (const name of STANDARD_CSV_SENSOR_ORDER) {
      let val = readNamedSensor(src, name);
      if ((val === null || val === undefined) && Array.isArray(src.adc)) {
        const idx = ADC_LABEL_ORDER.indexOf(name);
        if (idx >= 0) val = src.adc[idx];
      }
      sensors[name] = val;
    }
    return {
      t: typeof ts === "number" ? new Date(ts * 1000) : new Date(ts),
      temp: src.Temperature ?? src.temperature ?? null,
      hum: src.Humidity ?? src.humidity ?? null,
      adc,
      sensors,
    };
  }

  let appConfigCache = null;
  async function getAppConfig() {
    if (appConfigCache) return appConfigCache;
    const res = await fetch("/config.json");
    if (!res.ok) throw new Error("Không đọc được config.json");
    appConfigCache = await res.json();
    return appConfigCache;
  }

  async function downloadHistoryCsvForDevice(deviceId, filenameHint) {
    applySliding24hHistoryRange();
    const fromEl = document.getElementById("fromTime");
    const q = new URLSearchParams({ limit: "500" });
    if (fromEl?.value) q.set("from", fromEl.value);
    /* Cùng lý do loadHistoryChart: không chặn trên bằng phút tròn. */
    const result = await api(`/api/enose/devices/${encodeURIComponent(deviceId)}/history?${q.toString()}`);
    const raw = Array.isArray(result?.data) ? result.data : [];
    const header = ["TimeStamp", "Temperature", "Humidity", ...STANDARD_CSV_SENSOR_ORDER];
    const lines = [header.join(",")];
    raw.forEach((item) => {
      const p = extractHistoryPoint(item);
      const ts = p.t && !Number.isNaN(p.t.valueOf()) ? Math.floor(p.t.getTime() / 1000) : "";
      const parts = [ts, p.temp ?? "", p.hum ?? ""];
      STANDARD_CSV_SENSOR_ORDER.forEach((name) => {
        const v = p.sensors[name];
        parts.push(v === null || v === undefined || v === "" ? "" : Number(v));
      });
      lines.push(parts.join(","));
    });
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const safe = String(filenameHint || "").replace(/[^\w.\-]+/g, "_");
    a.download = safe.endsWith(".csv") ? safe : `export_${safe || deviceId}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  }

  function updateEspFileServerLink(ipRaw) {
    const link = refs.currentEspIpLink;
    if (!link) return;
    const s = ipRaw === null || ipRaw === undefined ? "" : String(ipRaw).trim();
    if (!s || s === "--") {
      link.textContent = "--";
      link.href = "#";
      link.classList.add("file-server-ip-link--inactive");
      link.setAttribute("aria-disabled", "true");
      link.removeAttribute("target");
      link.removeAttribute("rel");
      return;
    }
    let url;
    let display = s;
    try {
      if (/^https?:\/\//i.test(s)) {
        const u = new URL(s);
        url = u.href.endsWith("/") ? u.href : `${u.href}/`;
        display = u.hostname || s;
      } else {
        const host = s.replace(/\/+$/, "").split("/")[0];
        url = `http://${host}/`;
        display = host;
      }
    } catch (_) {
      link.textContent = "--";
      link.href = "#";
      link.classList.add("file-server-ip-link--inactive");
      link.setAttribute("aria-disabled", "true");
      link.removeAttribute("target");
      link.removeAttribute("rel");
      return;
    }
    link.textContent = display;
    link.href = url;
    link.classList.remove("file-server-ip-link--inactive");
    link.removeAttribute("aria-disabled");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  function syncMeasurementFileActions(fileName, deviceId) {
    const dl = document.getElementById("downloadFileBtn");
    const fl = document.getElementById("fileServerLink");
    if (!dl || !fl) return;
    const ok = Boolean(fileName && fileName !== "--" && deviceId);
    if (!ok) {
      dl.classList.add("d-none");
      fl.classList.add("d-none");
      delete dl.dataset.fileName;
      return;
    }
    dl.dataset.fileName = fileName;
    dl.title =
      "Tải CSV từ dữ liệu sensor đã lưu (Mongo) trong khoảng thời gian hiện tại. Nếu cấu hình MEASUREMENT_FILE_BASE_URL, có thể mở file gốc trên máy chủ file.";
    dl.classList.remove("d-none");
    fl.classList.add("d-none");
    getAppConfig()
      .then((cfg) => {
        const base = (cfg.measurementFileBaseUrl || "").trim();
        if (!base) return;
        try {
          const normalized = base.endsWith("/") ? base : `${base}/`;
          fl.href = new URL(fileName, normalized).href;
          fl.classList.remove("d-none");
        } catch (_) {
          fl.classList.add("d-none");
        }
      })
      .catch(() => {});
  }

  function buildChartDatasets(points) {
    const labels = points.map((p) => (p.t && !Number.isNaN(p.t.valueOf()) ? p.t.toLocaleTimeString() : "--"));
    return {
      labels,
      datasets: [
        {
          label: "Temperature",
          data: points.map((p) => p.temp),
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,.18)",
          fill: true,
          tension: 0.25,
          yAxisID: "y",
        },
        {
          label: "Humidity",
          data: points.map((p) => p.hum),
          borderColor: "#06b6d4",
          backgroundColor: "rgba(6,182,212,.18)",
          fill: true,
          tension: 0.25,
          yAxisID: "y",
        },
      ],
    };
  }

  function adcValueAtPoint(p, channelIndex) {
    if (!p || !p.adc) return null;
    let v = p.adc[channelIndex];
    if (v === null || v === undefined) {
      const name = ADC_LABEL_ORDER[channelIndex];
      if (name && p.sensors) v = p.sensors[name];
    }
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  }

  function pointHasAnyAdc(p) {
    if (!p) return false;
    for (let i = 0; i < 8; i += 1) {
      if (adcValueAtPoint(p, i) != null) return true;
    }
    return false;
  }

  function buildAdcChartDatasets(points) {
    const adcPoints = (Array.isArray(points) ? points : []).filter(pointHasAnyAdc);
    const labels = adcPoints.map((p) => (p.t && !Number.isNaN(p.t.valueOf()) ? p.t.toLocaleTimeString() : "--"));
    const datasets = [];
    for (let i = 0; i < 8; i += 1) {
      const [border, bg] = ADC_CHART_STYLES[i] || ["#64748b", "rgba(100,116,139,.12)"];
      const label = ADC_LABEL_ORDER[i] || `ADC${i}`;
      datasets.push({
        label: `${label} (ADC${i})`,
        data: adcPoints.map((p) => adcValueAtPoint(p, i)),
        borderColor: border,
        backgroundColor: bg,
        fill: true,
        tension: 0.25,
        pointRadius: 2,
        pointHoverRadius: 4,
        borderWidth: 2,
        yAxisID: "y",
      });
    }
    return { labels, datasets, hasAdc: adcPoints.length > 0 };
  }

  function renderTrendChart(points) {
    const canvas = document.getElementById("sensorTrendChart");
    if (!canvas || typeof Chart === "undefined") return;
    const data = buildChartDatasets(points);
    if (trendChart) {
      trendChart.data = data;
      trendChart.update();
      return;
    }
    trendChart = new Chart(canvas, {
      type: "line",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
      },
    });
  }

  function renderAdcTrendChart(points) {
    const canvas = document.getElementById("adcTrendChart");
    if (!canvas || typeof Chart === "undefined") return;
    const built = buildAdcChartDatasets(Array.isArray(points) ? points : []);
    const data = { labels: built.labels, datasets: built.datasets };
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            font: { size: 11 },
            padding: 8,
          },
        },
        title: {
          display: false,
          text: "",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        y: {
          title: { display: true, text: "Giá trị ADC" },
          ticks: {
            maxTicksLimit: 8,
          },
          grace: "8%",
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 0,
            maxTicksLimit: 12,
          },
        },
      },
    };
    if (adcTrendChart) {
      adcTrendChart.data = data;
      adcTrendChart.update();
      return;
    }
    adcTrendChart = new Chart(canvas, {
      type: "line",
      data,
      options: chartOptions,
    });
  }

  function applyTempHumStyle(temp, hum) {
    const tempWrap = refs.temperature?.closest(".metric-value--temp");
    const humWrap = refs.humidity?.closest(".metric-value--hum");
    if (tempWrap) {
      tempWrap.classList.remove("metric-value--temp-ok", "metric-value--temp-warm", "metric-value--temp-hot");
      if (temp !== null && temp !== undefined && !Number.isNaN(Number(temp))) {
        const t = Number(temp);
        if (t >= 40) tempWrap.classList.add("metric-value--temp-hot");
        else if (t >= 33) tempWrap.classList.add("metric-value--temp-warm");
        else tempWrap.classList.add("metric-value--temp-ok");
      }
    }
    if (humWrap) {
      humWrap.classList.remove("metric-value--hum-ok", "metric-value--hum-high");
      if (hum !== null && hum !== undefined && !Number.isNaN(Number(hum))) {
        const h = Number(hum);
        if (h >= 80) humWrap.classList.add("metric-value--hum-high");
        else humWrap.classList.add("metric-value--hum-ok");
      }
    }
  }

  function applyEmptyKpiReadings() {
    refs.temperature.textContent = "--";
    refs.humidity.textContent = "--";
    applyTempHumStyle(null, null);
    refs.wifiSignal.textContent = "--";
    refs.wifiSSID.textContent = "SSID: --";
    if (refs.wifiChip) {
      refs.wifiChip.className = "status-chip chip-muted mt-2";
      refs.wifiChip.innerHTML = '<i class="bi bi-question-circle"></i> Chưa có dữ liệu';
    }
    activeSensorChannels.forEach((ch) => {
      const idx = Number(ch.channel_index);
      const el = document.getElementById(`sensorAdc_${idx}`);
      if (el) el.textContent = "--";
    });
  }

  function applyLatestToKpi(latest) {
    const doc =
      latest && typeof latest === "object" && latest.data !== undefined && latest.data !== null ? latest.data : null;
    const data = doc && typeof doc === "object" ? doc : {};
    const content = data.content && typeof data.content === "object" && !Array.isArray(data.content) ? data.content : {};
    const temp = content.Temperature ?? content.temperature ?? null;
    const hum = content.Humidity ?? content.humidity ?? null;
    refs.temperature.textContent = temp === null || temp === undefined ? "--" : Number(temp).toFixed(1);
    refs.humidity.textContent = hum === null || hum === undefined ? "--" : Number(hum).toFixed(1);
    applyTempHumStyle(temp, hum);
    pushHistory(history.temp, temp, 20);
    pushHistory(history.hum, hum, 20);
    renderSparkline("tempSpark", history.temp, "#f5576c");
    renderSparkline("humSpark", history.hum, "#0ea5e9");

    activeSensorChannels.forEach((ch) => {
      const idx = Number(ch.channel_index);
      const v = readAdcValue(content, idx, ch.label);
      const el = document.getElementById(`sensorAdc_${idx}`);
      if (el) el.textContent = v === null || v === undefined ? "--" : String(v);
      const fill = document.getElementById(`sensorAdcFill_${idx}`);
      if (fill) {
        const normalized = Math.max(0, Math.min(1023, Number(v || 0)));
        fill.style.width = `${(normalized / 1023) * 100}%`;
        fill.style.background = adcColorByValue(normalized);
      }
      const series = ensureAdcHistory(idx);
      pushHistory(series, v, 20);
      renderSparkline(`sensorAdcSpark_${idx}`, series, "#667eea");
    });
  }

  function applyStatusToKpi(status) {
    const data = status?.data || status || {};
    const signal = data.wifi_signal ?? null;
    const ssid = data.wifi_ssid ?? "--";
    const online = String(data.status || "").toLowerCase() === "online";
    refs.wifiSignal.textContent = signal === null || signal === undefined ? "--" : String(signal);
    refs.wifiSSID.textContent = `SSID: ${ssid || "--"}`;
    refs.wifiChip.className = `status-chip ${online ? "chip-success" : "chip-danger"} mt-2`;
    refs.wifiChip.innerHTML = online
      ? '<i class="bi bi-wifi"></i> Đã kết nối'
      : '<i class="bi bi-wifi-off"></i> Mất kết nối';
    refs.statusContent.textContent = data.status || "Ready";
    isSyncingSwitches = true;
    if (refs.heatingSwitch) {
      refs.heatingSwitch.checked = resolveOptimisticSwitch("heating", data.heating_enabled);
    }
    if (refs.airPumpSwitch) {
      refs.airPumpSwitch.checked = resolveOptimisticSwitch("pump", data.air_pump_enabled);
    }
    isSyncingSwitches = false;
  }

  async function loadDevices() {
    let result;
    try {
      result = await api("/api/enose/devices");
      hideAppBanner();
    } catch (e) {
      log(e.message);
      showAppBanner(userMessageFromError(e), "danger");
      refs.deviceSelect.innerHTML = "";
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "Không tải được danh sách";
      refs.deviceSelect.appendChild(option);
      refs.totalDevices.textContent = "--";
      refs.onlineDevices.textContent = "--";
      refs.offlineDevices.textContent = "--";
      applyEmptyKpiReadings();
      return;
    }
    const devices = Array.isArray(result.devices) ? result.devices : [];
    refs.deviceSelect.innerHTML = "";
    devices.forEach((device) => {
      const option = document.createElement("option");
      const id = device.device_code || device.device_id || device.name;
      option.value = id;
      option.textContent = `${id} (${device.status || "unknown"})`;
      refs.deviceSelect.appendChild(option);
    });
    if (!devices.length) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "Không có thiết bị";
      refs.deviceSelect.appendChild(option);
    }
    const onlineCount = devices.filter((d) => String(d.status || "").toLowerCase() === "online").length;
    refs.totalDevices.textContent = String(devices.length);
    refs.onlineDevices.textContent = String(onlineCount);
    refs.offlineDevices.textContent = String(Math.max(0, devices.length - onlineCount));
    if (refs.selectedDeviceText) refs.selectedDeviceText.textContent = refs.deviceSelect.value || "--";
    await loadSensorChannels();
    await refreshSelectedDevice();
  }

  async function refreshSelectedDevice() {
    const id = getSelectedDeviceId();
    if (!id) return;
    if (refs.selectedDeviceText) refs.selectedDeviceText.textContent = id;
    try {
      const [latest, status, measurements, active, sys] = await Promise.all([
        api(`/api/enose/devices/${encodeURIComponent(id)}/latest`),
        api(`/api/enose/devices/${encodeURIComponent(id)}/status`),
        api(`/api/enose/devices/${encodeURIComponent(id)}/measurements`),
        api(`/api/enose/devices/measurements/active?device_id=${encodeURIComponent(id)}`),
        api("/api/enose/control/status"),
      ]);
      hideAppBanner();
      applyLatestToKpi(latest);
      applyStatusToKpi(status);
      refs.recentCommands.textContent = String(sys?.recent_controls ?? "--");
      const list = Array.isArray(measurements?.data) ? measurements.data : [];
      const latestFile = list[0];
      const ts = latestFile?.started_at || latestFile?.created_at || latestFile?.createdAt;
      const statusData = status?.data || status || {};
      const espIp = statusData.wifi_ip || statusData.ip || statusData.ip_address || statusData.local_ip || "--";
      const summaryEl = document.getElementById("measurementLatestSummary");
      if (summaryEl) {
        summaryEl.textContent = latestFile
          ? `Mới nhất: ${latestFile.file_name || "—"}${ts ? ` — ${new Date(ts).toLocaleString("vi-VN")}` : ""}`
          : "Chưa có file đo trong hệ thống.";
      }
      updateEspFileServerLink(espIp);
      refs.fileServerText.textContent = latestFile
        ? "Đang hiển thị và cho tải đúng 1 file mới nhất. Dữ liệu CSV được xuất chuẩn TimeStamp + Temp + Hum + EtOH3…VOC2."
        : "Chưa có file đo trong hệ thống.";
      syncMeasurementFileActions(latestFile?.file_name, id);

      if (active?.active && active?.measurement) {
        refs.statusContent.textContent = `Đang đo (${active.measurement.status || "started"})`;
        if (refs.activeMeasurementFileName) refs.activeMeasurementFileName.textContent = active.measurement.file_name || "--";
        if (refs.activeMeasurementAlert) refs.activeMeasurementAlert.style.display = "block";
      } else {
        refs.statusContent.textContent = "Sẵn sàng";
        if (refs.activeMeasurementAlert) refs.activeMeasurementAlert.style.display = "none";
      }

      try {
        await loadHistoryChart(id);
      } catch (he) {
        log(he.message);
        renderTrendChart([]);
        renderAdcTrendChart([]);
      }
      if (document.getElementById("view-charts")?.classList.contains("view-pane--active")) {
        setTimeout(() => {
          try {
            if (trendChart) trendChart.resize();
            if (adcTrendChart) adcTrendChart.resize();
          } catch (_) {}
        }, 80);
      }
    } catch (e) {
      log(e.message);
      showAppBanner(userMessageFromError(e), "danger");
      applyEmptyKpiReadings();
      renderTrendChart([]);
      renderAdcTrendChart([]);
      updateEspFileServerLink(null);
      syncMeasurementFileActions(null, null);
    }
  }

  async function loadHistoryChart(id) {
    applySliding24hHistoryRange();
    const from = document.getElementById("fromTime")?.value;
    const q = new URLSearchParams({ limit: "120" });
    if (from) q.set("from", from);
    /* Không gửi `to`: datetime-local chỉ tới phút → $lte trên API cắt mất mẫu trong cùng phút (biểu đồ “đang đo” trống). */
    try {
      const result = await api(`/api/enose/devices/${encodeURIComponent(id)}/history?${q.toString()}`);
      const raw = Array.isArray(result?.data) ? result.data : [];
      const points = raw.map(extractHistoryPoint).reverse();
      renderTrendChart(points);
      renderAdcTrendChart(points);
    } catch (e) {
      log(e.message);
      renderTrendChart([]);
      renderAdcTrendChart([]);
    }
  }

  async function sendControl(action) {
    const id = getSelectedDeviceId();
    if (!id) return;
    try {
      if (action === "start") {
        refs.statusContent.textContent = "Đang khởi động…";
        await api(`/api/enose/devices/${encodeURIComponent(id)}/start`, { method: "POST", body: JSON.stringify({}) });
      }
      if (action === "stop") {
        refs.statusContent.textContent = "Đang dừng…";
        await api(`/api/enose/devices/${encodeURIComponent(id)}/stop`, { method: "POST", body: JSON.stringify({}) });
      }
      if (action === "heating-on" || action === "heating-off") {
        const on = action === "heating-on";
        await api(`/api/enose/devices/${encodeURIComponent(id)}/heating`, { method: "POST", body: JSON.stringify({ on }) });
        armSwitchOptimism("heating", on);
      }
      if (action === "pump-on" || action === "pump-off") {
        const on = action === "pump-on";
        await api(`/api/enose/devices/${encodeURIComponent(id)}/air-pump`, { method: "POST", body: JSON.stringify({ on }) });
        armSwitchOptimism("pump", on);
      }
      await refreshSelectedDevice();
    } catch (e) {
      log(e.message);
      showAppBanner(userMessageFromError(e), "danger");
    }
  }

  async function addSensorChannel() {
    const id = getSelectedDeviceId();
    if (!id) return;
    const channel_index = Number(refs.newChIndex?.value);
    const label = String(refs.newChLabel?.value || "").trim();
    const unit = String(refs.newChUnit?.value || "ADC").trim() || "ADC";
    const sort_order = Number(refs.newChSort?.value || 0);
    if (!label) {
      alert("Nhập nhãn kênh");
      return;
    }
    try {
      await api(`/api/enose/devices/${encodeURIComponent(id)}/sensor-channels`, {
        method: "POST",
        body: JSON.stringify({ channel_index, label, unit, sort_order }),
      });
      if (refs.newChLabel) refs.newChLabel.value = "";
      await loadSensorChannels();
      await refreshSelectedDevice();
    } catch (e) {
      log(e.message);
      showAppBanner(userMessageFromError(e), "danger");
    }
  }

  function readRowInputs(tr) {
    const inputs = tr.querySelectorAll(".ch-inp");
    const out = {};
    inputs.forEach((inp) => {
      const field = inp.getAttribute("data-field");
      if (!field) return;
      out[field] = inp.value;
    });
    return out;
  }

  async function saveSensorChannelRow(tr) {
    const channelId = Number(tr.dataset.channelId);
    if (!Number.isFinite(channelId)) return;
    const vals = readRowInputs(tr);
    try {
      await api(`/api/enose/sensor-channels/${encodeURIComponent(channelId)}`, {
        method: "PATCH",
        body: JSON.stringify({
          channel_index: Number(vals.channel_index),
          label: String(vals.label || "").trim(),
          unit: String(vals.unit || "ADC").trim(),
          sort_order: Number(vals.sort_order || 0),
        }),
      });
      await loadSensorChannels();
      await refreshSelectedDevice();
    } catch (e) {
      log(e.message);
      showAppBanner(userMessageFromError(e), "danger");
    }
  }

  async function deleteSensorChannelRow(tr) {
    const channelId = Number(tr.dataset.channelId);
    if (!Number.isFinite(channelId)) return;
    if (!window.confirm("Xóa kênh cảm biến này?")) return;
    try {
      await api(`/api/enose/sensor-channels/${encodeURIComponent(channelId)}/delete`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      await loadSensorChannels();
      await refreshSelectedDevice();
    } catch (e) {
      log(e.message);
      showAppBanner(userMessageFromError(e), "danger");
    }
  }

  function summarizeAdc(adc) {
    if (!Array.isArray(adc)) return "—";
    const parts = [];
    for (let i = 0; i < adc.length; i += 1) {
      const v = adc[i];
      if (v === null || v === undefined || v === "") continue;
      parts.push(`${i}:${v}`);
      if (parts.length >= 14) break;
    }
    return parts.length ? `${parts.join(", ")}${parts.length >= 14 ? "…" : ""}` : "—";
  }

  async function loadHistoryTable() {
    const id = getSelectedDeviceId();
    const tbody = document.getElementById("historyTableBody");
    if (!tbody) return;
    if (!id) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-muted">Chọn thiết bị.</td></tr>';
      return;
    }
    tbody.innerHTML = '<tr><td colspan="4" class="text-muted">Đang tải…</td></tr>';
    try {
      applySliding24hHistoryRange();
      const from = document.getElementById("fromTime")?.value;
      const to = document.getElementById("toTime")?.value;
      const q = new URLSearchParams({ limit: "100" });
      if (from) q.set("from", from);
      if (to) q.set("to", to);
      const result = await api(`/api/enose/devices/${encodeURIComponent(id)}/history?${q.toString()}`);
      const raw = Array.isArray(result?.data) ? result.data : [];
      tbody.innerHTML = "";
      if (!raw.length) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-muted">Không có bản ghi.</td></tr>';
        return;
      }
      const sorted = [...raw].sort((a, b) => {
        const ta = extractHistoryPoint(a).t?.valueOf() || 0;
        const tb = extractHistoryPoint(b).t?.valueOf() || 0;
        return tb - ta;
      });
      sorted.slice(0, 100).forEach((item) => {
        const p = extractHistoryPoint(item);
        const timeStr = p.t && !Number.isNaN(p.t.valueOf()) ? p.t.toLocaleString() : "—";
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="text-nowrap small">${escapeHtml(timeStr)}</td>
          <td>${p.temp != null ? escapeHtml(String(Number(p.temp).toFixed(1))) : "—"}</td>
          <td>${p.hum != null ? escapeHtml(String(Number(p.hum).toFixed(1))) : "—"}</td>
          <td class="small text-break">${escapeHtml(summarizeAdc(p.adc))}</td>`;
        tbody.appendChild(tr);
      });
    } catch (e) {
      log(e.message);
      tbody.innerHTML = emptyStateHistoryRows();
    }
  }

  async function loadSettings() {
    const el = document.getElementById("settingsInfo");
    if (!el) return;
    el.textContent = "Đang tải…";
    try {
      const res = await fetch("/config.json");
      const cfg = await res.json();
      el.textContent = JSON.stringify(cfg, null, 2);
    } catch {
      el.textContent = "Không tải được /config.json.";
    }
  }

  function isCompactNav() {
    return window.matchMedia("(max-width: 991.98px)").matches;
  }

  function syncTopbarHeightVar() {
    const tb = document.querySelector(".topbar");
    if (tb) {
      document.documentElement.style.setProperty("--app-topbar-height", `${tb.offsetHeight}px`);
    }
  }

  function setSidebarOpen(open, { persist = true } = {}) {
    document.body.classList.toggle("sidebar-drawer-open", open);
    const btn = document.getElementById("sidebarNavToggle");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (btn) {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.title = open ? "Đóng menu điều hướng" : "Mở menu điều hướng";
      btn.setAttribute("aria-label", open ? "Đóng menu điều hướng" : "Mở menu điều hướng");
      const icon = btn.querySelector("i");
      if (icon) {
        icon.classList.remove("bi-list", "bi-x-lg");
        icon.classList.add(open ? "bi-x-lg" : "bi-list");
      }
    }
    if (backdrop) {
      backdrop.setAttribute("aria-hidden", open ? "false" : "true");
    }
    if (persist) {
      try {
        localStorage.setItem("report-demo-sidebar", open ? "1" : "0");
      } catch (_) {}
    }
  }

  function initSidebarDrawer() {
    syncTopbarHeightVar();
    try {
      const stored = localStorage.getItem("report-demo-sidebar");
      const open = stored !== "0";
      setSidebarOpen(open, { persist: false });
    } catch (_) {
      setSidebarOpen(true, { persist: false });
    }

    document.getElementById("sidebarNavToggle")?.addEventListener("click", () => {
      const next = !document.body.classList.contains("sidebar-drawer-open");
      setSidebarOpen(next, { persist: true });
    });

    document.getElementById("sidebarBackdrop")?.addEventListener("click", () => {
      setSidebarOpen(false, { persist: true });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("sidebar-drawer-open")) {
        setSidebarOpen(false, { persist: true });
      }
    });

    window.addEventListener("resize", syncTopbarHeightVar);
  }

  const VIEW_META = {
    dashboard: { title: "Dashboard", sub: "Giám sát realtime và điều khiển thiết bị" },
    devices: { title: "Quản lý thiết bị", sub: "Cấu hình kênh ADC theo PCB (CRUD SQL)" },
    charts: { title: "Biểu đồ", sub: "Nhiệt độ, độ ẩm và 8 kênh ADC theo thời gian" },
    history: { title: "Lịch sử", sub: "Điểm đo sensor đã lưu trong MongoDB" },
    settings: { title: "Cài đặt", sub: "Thông tin công khai từ server" },
  };

  function showView(view) {
    document.querySelectorAll(".view-pane").forEach((p) => p.classList.remove("view-pane--active"));
    const pane = document.getElementById(`view-${view}`);
    if (pane) pane.classList.add("view-pane--active");
    document.querySelectorAll(".sidebar-link[data-view]").forEach((b) => b.classList.remove("active"));
    const nav = document.querySelector(`.sidebar-link[data-view="${view}"]`);
    if (nav) nav.classList.add("active");
    const meta = VIEW_META[view] || { title: view, sub: "" };
    const pt = document.getElementById("pageTitle");
    const ps = document.getElementById("pageSubtitle");
    if (pt) pt.textContent = meta.title;
    if (ps) ps.textContent = meta.sub;
    if (view === "charts") {
      setTimeout(() => {
        try {
          if (trendChart) trendChart.resize();
          if (adcTrendChart) adcTrendChart.resize();
        } catch (_) {}
      }, 200);
    }
    if (view === "history") loadHistoryTable().catch((e) => log(e.message));
    if (view === "settings") loadSettings().catch((e) => log(e.message));
  }

  function initSidebarNav() {
    document.querySelectorAll(".sidebar-link[data-view]").forEach((btn) => {
      const openFromButton = () => {
        const v = btn.getAttribute("data-view");
        if (v) showView(v);
        if (isCompactNav()) setSidebarOpen(false, { persist: true });
      };
      // Mobile/touch: xử lý từ pointerdown để tránh cảm giác phải bấm lần 2.
      btn.addEventListener("pointerdown", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        openFromButton();
      });
      // Fallback cho bàn phím / click thông thường.
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        openFromButton();
      });
    });
  }

  async function setHeatingBySwitch(on) {
    if (isSyncingSwitches) return;
    await sendControl(on ? "heating-on" : "heating-off");
  }
  async function setPumpBySwitch(on) {
    if (isSyncingSwitches) return;
    await sendControl(on ? "pump-on" : "pump-off");
  }

  function initThemeToggle() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    const icon = btn.querySelector("i");
    const syncIcon = () => {
      const dark = document.body.classList.contains("theme-dark");
      if (!icon) return;
      if (dark) {
        icon.classList.remove("bi-moon-stars");
        icon.classList.add("bi-sun-fill");
      } else {
        icon.classList.add("bi-moon-stars");
        icon.classList.remove("bi-sun-fill");
      }
    };
    const apply = () => {
      const dark = document.body.classList.contains("theme-dark");
      localStorage.setItem("report-demo-theme", dark ? "dark" : "light");
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      syncIcon();
    };
    if (localStorage.getItem("report-demo-theme") === "dark") {
      document.body.classList.add("theme-dark");
    }
    apply();
    btn.addEventListener("click", () => {
      document.body.classList.toggle("theme-dark");
      apply();
    });
  }

  function init() {
    applySliding24hHistoryRange();
    initSidebarDrawer();
    initThemeToggle();
    if (refs.deviceSelect) {
      refs.deviceSelect.addEventListener("change", () =>
        loadSensorChannels()
          .then(() => refreshSelectedDevice())
          .catch((e) => log(e.message))
      );
    }
    if (refs.startMeasureBtn) refs.startMeasureBtn.addEventListener("click", () => sendControl("start").catch((e) => log(e.message)));
    if (refs.stopMeasureBtn) refs.stopMeasureBtn.addEventListener("click", () => sendControl("stop").catch((e) => log(e.message)));
    const downloadFileBtn = document.getElementById("downloadFileBtn");
    if (downloadFileBtn) {
      downloadFileBtn.addEventListener("click", async () => {
        const id = getSelectedDeviceId();
        const fn = downloadFileBtn.dataset.fileName;
        if (!id || !fn) return;
        try {
          const cfg = await getAppConfig();
          const base = (cfg.measurementFileBaseUrl || "").trim();
          if (base) {
            const normalized = base.endsWith("/") ? base : `${base}/`;
            window.open(new URL(fn, normalized).href, "_blank", "noopener,noreferrer");
            return;
          }
        } catch (_) {}
        try {
          await downloadHistoryCsvForDevice(id, fn);
        } catch (err) {
          log(err.message);
          showAppBanner(userMessageFromError(err), "danger");
        }
      });
    }
    if (refs.heatingSwitch) refs.heatingSwitch.addEventListener("change", () => setHeatingBySwitch(refs.heatingSwitch.checked).catch((e) => log(e.message)));
    if (refs.airPumpSwitch) refs.airPumpSwitch.addEventListener("change", () => setPumpBySwitch(refs.airPumpSwitch.checked).catch((e) => log(e.message)));
    if (refs.addSensorChannelBtn) refs.addSensorChannelBtn.addEventListener("click", () => addSensorChannel().catch((e) => log(e.message)));
    if (refs.sensorChannelCrudBody) {
      refs.sensorChannelCrudBody.addEventListener("click", (ev) => {
        const btn = ev.target;
        if (!(btn instanceof HTMLElement)) return;
        const tr = btn.closest("tr");
        if (!tr || !tr.dataset.channelId) return;
        if (btn.classList.contains("ch-save")) saveSensorChannelRow(tr).catch((e) => log(e.message));
        if (btn.classList.contains("ch-del")) deleteSensorChannelRow(tr).catch((e) => log(e.message));
      });
    }
    initSidebarNav();
    const historyReloadBtn = document.getElementById("historyReloadBtn");
    if (historyReloadBtn) {
      historyReloadBtn.addEventListener("click", () => loadHistoryTable().catch((e) => log(e.message)));
    }
    loadDevices().catch((e) => log(e.message));
    setInterval(() => refreshSelectedDevice().catch(() => {}), 10000);
  }

  init();
})();
