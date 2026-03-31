/**
 * Minh họa sự kiện — không gọi API thật
 */
(function () {
  const wifiAlert = document.getElementById("wifiSetupAlert");
  const btnToggleWifi = document.getElementById("demoToggleWifi");
  const startBtn = document.getElementById("startMeasurementBtn");
  const statusContent = document.getElementById("statusContent");
  const activeAlert = document.getElementById("activeMeasurementAlert");
  const activeFileName = document.getElementById("activeMeasurementFileName");
  const btnApplyFilter = document.getElementById("btnApplyFilter");
  const toast = document.getElementById("demoToast");

  let measuring = false;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  btnToggleWifi?.addEventListener("click", () => {
    wifiAlert?.classList.toggle("is-visible");
    showToast(
      wifiAlert?.classList.contains("is-visible")
        ? "Đã bật demo cảnh báo WiFi"
        : "Đã tắt cảnh báo WiFi"
    );
  });

  startBtn?.addEventListener("click", () => {
    if (measuring) {
      measuring = false;
      startBtn.disabled = false;
      startBtn.innerHTML = '<span class="bi-placeholder">▶</span> Start measurement';
      statusContent.textContent = "Ready";
      activeAlert?.classList.remove("is-visible");
      showToast("Đã dừng (demo)");
      return;
    }
    measuring = true;
    startBtn.disabled = false;
    startBtn.innerHTML = '<span class="bi-placeholder">■</span> Stop measurement (demo)';
    statusContent.textContent = "Measuring…";
    activeAlert?.classList.add("is-visible");
    if (activeFileName) activeFileName.textContent = "demo_session_" + Date.now() + ".csv";
    showToast("Bắt đầu đo (mô phỏng)");
  });

  btnApplyFilter?.addEventListener("click", () => {
    const dev = document.getElementById("deviceSelect")?.value || "all";
    const from = document.getElementById("fromTime")?.value;
    const to = document.getElementById("toTime")?.value;
    showToast(
      "Lọc (demo): thiết bị=" +
        (dev || "tất cả") +
        (from ? ", từ " + from : "") +
        (to ? ", đến " + to : "")
    );
  });

  document.getElementById("deviceSelect")?.addEventListener("change", (e) => {
    showToast("Đã chọn: " + (e.target.options[e.target.selectedIndex]?.text || ""));
  });

  const sensors = document.querySelectorAll(".mq-sensor-card .mq-sensor-value");
  setInterval(() => {
    sensors.forEach((el) => {
      if (el.dataset.demoFixed) return;
      const base = 1200 + Math.random() * 400;
      el.textContent = Math.round(base);
    });
  }, 3000);
})();
