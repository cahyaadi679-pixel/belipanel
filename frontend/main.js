(function () {
  const API_BASE = (window.APP_CONFIG && window.APP_CONFIG.apiBaseUrl) || "/api";

  const plans = [
    { key: "1gb", label: "1GB", cpu: 40,  disk: 1000, ram: 1000,  price: 1000 },
    { key: "2gb", label: "2GB", cpu: 60,  disk: 1000, ram: 2000,  price: 2000 },
    { key: "3gb", label: "3GB", cpu: 80,  disk: 2000, ram: 3000,  price: 3000 },
    { key: "4gb", label: "4GB", cpu: 100, disk: 2000, ram: 4000,  price: 4000 },
    { key: "5gb", label: "5GB", cpu: 120, disk: 3000, ram: 5000,  price: 5000 },
    { key: "6gb", label: "6GB", cpu: 140, disk: 3000, ram: 6000,  price: 6000 },
    { key: "7gb", label: "7GB", cpu: 160, disk: 4000, ram: 7000,  price: 7000 },
    { key: "8gb", label: "8GB", cpu: 180, disk: 4000, ram: 8000,  price: 8000 },
    { key: "9gb", label: "9GB", cpu: 200, disk: 5000, ram: 9000,  price: 9000 },
    { key: "10gb",label: "10GB",cpu: 220, disk: 5000, ram:10000,  price: 10000 },
    { key: "unlimited", label: "Unlimited", cpu: 0, disk: 0, ram: 0, unlimited: true, price: 11000 }
  ];


  const liveNames = [
    "Fauzan", "Rizky", "Nanda", "Aurel", "Ryan", "Dinda",
    "Ikhsan", "Salsa", "Bagas", "Rara", "Kevin", "Celine",
    "Reza", "Intan", "Bima", "Nayla", "Arya", "Hani"
  ];

  function randomName() {
    return liveNames[Math.floor(Math.random() * liveNames.length)];
  }

  function pushLivePurchase(plan) {
    var feed = document.getElementById("live-purchase-feed");
    if (!feed) return;
    var name = randomName();
    var orderId = state.currentOrderId || ("ORD-" + Math.random().toString(36).substring(2, 8));

    var toast = document.createElement("div");
    toast.className = "live-toast";

    toast.innerHTML =
      '<div class="live-toast-icon">🛒</div>' +
      '<div class="live-toast-body">' +
      '<div class="live-toast-title">Seseorang telah membeli <span>Bot ' + plan.label + ' RAM</span></div>' +
      '<div class="live-toast-sub">Order ID: ' + maskOrder(orderId) + '</div>' +
      "</div>";

    toast.addEventListener("animationend", function () {
      if (toast && toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    });

    feed.appendChild(toast);
  }

  function maskOrder(orderId) {
    if (!orderId) return "";
    if (orderId.length <= 6) return orderId;
    return "********-" + orderId.slice(-6);
  }

  function startLiveSimulation() {
    setInterval(function () {
      var plan = plans[Math.floor(Math.random() * plans.length)];
      pushLivePurchase(plan);
    }, 16000);
  }

  const state = {
    currentOrderId: null,
    currentPlanKey: null,
    pollingTimer: null
  };

  document.addEventListener("DOMContentLoaded", function () {
    initSplash();
    renderPlans();
    updateYear();
    startLiveSimulation();
  });

  function initSplash() {
    const splash = document.getElementById("splash");
    setTimeout(function () {
      if (!splash) return;
      splash.classList.add("hidden");
      setTimeout(function () {
        if (splash && splash.parentNode) splash.parentNode.removeChild(splash);
      }, 500);
    }, 900);
  }

  function updateYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  function renderPlans() {
    var grid = document.getElementById("plans-grid");
    grid.innerHTML = "";
    plans.forEach(function (plan) {
      var card = document.createElement("article");
      card.className = "card plan-card";

      var main = document.createElement("div");
      main.className = "plan-main";

      var media = document.createElement("div");
      media.className = "plan-media";
      media.textContent = plan.unlimited ? "∞" : plan.label;

      var body = document.createElement("div");
      body.className = "plan-body";

      var titleRow = document.createElement("div");
      titleRow.className = "plan-title";

      var nameEl = document.createElement("div");
      nameEl.className = "plan-name";
      nameEl.textContent = "Panel " + plan.label;

      var chip = document.createElement("span");
      chip.className = "plan-chip";
      chip.textContent = plan.unlimited ? "Best value" : "Rekomendasi";

      titleRow.appendChild(nameEl);
      titleRow.appendChild(chip);

      var desc = document.createElement("div");
      desc.className = "plan-desc";
      desc.textContent = plan.unlimited
        ? "Sesuai kesepakatan, resource fleksibel. Cocok untuk project khusus."
        : "Cocok untuk server Minecraft / bot / app kecil-menengah.";

      var meta = document.createElement("div");
      meta.className = "plan-meta";

      meta.appendChild(makeBadge("CPU", plan.cpu ? plan.cpu + "%" : "Unlimited"));
      meta.appendChild(makeBadge("RAM", plan.unlimited ? "Unlimited" : formatRam(plan.ram)));
      meta.appendChild(makeBadge("Disk", plan.unlimited ? "Unlimited" : formatDisk(plan.disk)));

      body.appendChild(titleRow);
      body.appendChild(desc);
      body.appendChild(meta);

      main.appendChild(media);
      main.appendChild(body);

      var footer = document.createElement("div");
      footer.className = "plan-footer";

      var price = document.createElement("div");
      price.className = "plan-price";
      price.innerHTML = formatCurrency(plan.price) + ' <span>/bulan</span>';

      var button = document.createElement("button");
      button.className = "btn btn-primary";
      button.textContent = "Beli Sekarang";
      button.addEventListener("click", function () {
        handleBuy(plan);
      });

      footer.appendChild(price);
      footer.appendChild(button);

      card.appendChild(main);
      card.appendChild(footer);

      grid.appendChild(card);
    });
  }

  function makeBadge(label, value) {
    var badge = document.createElement("span");
    badge.className = "badge";
    badge.innerHTML = "<strong>" + label + "</strong> " + value;
    return badge;
  }

  function formatRam(mb) {
    if (!mb) return "-";
    if (mb >= 1024) {
      var gb = mb / 1024;
      return (gb % 1 === 0 ? gb : gb.toFixed(1)) + " GB";
    }
    return mb + " MB";
  }

  function formatDisk(mb) {
    return formatRam(mb);
  }

  function formatCurrency(amount) {
    if (amount === undefined || amount === null) return "-";
    var prefix = (window.APP_CONFIG && window.APP_CONFIG.currencyPrefix) || "Rp";
    return prefix + " " + amount.toLocaleString("id-ID");
  }

  async function handleBuy(plan) {
    try {
      togglePaymentSection(true);
      setPaymentStatus("Membuat QRIS...", "warning");
      document.getElementById("server-section").classList.add("hidden");

      var res = await fetch(API_BASE + "/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey: plan.key })
      });

      var data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Gagal membuat order");
      }

      state.currentOrderId = data.orderId;
      state.currentPlanKey = plan.key;

      renderPaymentInfo(data, plan);
      startPollingStatus();
    } catch (err) {
      console.error(err);
      setPaymentStatus("Gagal membuat QRIS: " + err.message, "error");
    }
  }

  function togglePaymentSection(show) {
    var section = document.getElementById("payment-section");
    if (!section) return;
    if (show) section.classList.remove("hidden");
    else section.classList.add("hidden");
  }

  function setPaymentStatus(text, variant) {
    var badge = document.getElementById("payment-status-badge");
    if (!badge) return;
    badge.textContent = text;
    badge.classList.remove("success");
    badge.classList.remove("error");
    if (variant === "success") badge.classList.add("success");
    if (variant === "error") badge.classList.add("error");
  }

  function renderPaymentInfo(apiData, plan) {
    var descEl = document.getElementById("payment-description");
    descEl.textContent = "Order " + plan.label + ". Silakan scan QRIS di bawah ini menggunakan aplikasi bank / e-wallet. Jika ada kendala, segera hubungi owner melalui WhatsApp di atas.";

    var metaEl = document.getElementById("payment-meta");
    var amountText = formatCurrency(apiData.amount || plan.price);
    var expiredAt = apiData.expiredAt ? new Date(apiData.expiredAt).toLocaleString("id-ID") : "-";

    metaEl.innerHTML = "";
    metaEl.insertAdjacentHTML("beforeend", "<li>Nominal: <strong>" + amountText + "</strong></li>");
    metaEl.insertAdjacentHTML("beforeend", "<li>Order ID: <code>" + apiData.orderId + "</code></li>");
    metaEl.insertAdjacentHTML("beforeend", "<li>Kadaluarsa: " + expiredAt + "</li>");

    var qrContainer = document.getElementById("qris-container");
    qrContainer.innerHTML = "";

    if (apiData.paymentNumber) {
      var img = document.createElement("img");
      var encoded = encodeURIComponent(apiData.paymentNumber);
      img.src = "https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=" + encoded;
      img.alt = "QRIS Payment";
      qrContainer.appendChild(img);
      setPaymentStatus("Silakan scan QRIS untuk membayar.", "warning");
    } else {
      qrContainer.textContent = "QRIS gagal dimuat.";
      setPaymentStatus("QRIS gagal dimuat dari server.", "error");
    }
  }

  function startPollingStatus() {
    if (state.pollingTimer) {
      clearInterval(state.pollingTimer);
    }
    checkStatusOnce();
    state.pollingTimer = setInterval(checkStatusOnce, 4500);
  }

  async function checkStatusOnce() {
    if (!state.currentOrderId) return;
    try {
      var url = API_BASE + "/order-status?orderId=" + encodeURIComponent(state.currentOrderId);
      var res = await fetch(url);
      var data = await res.json();
      if (!res.ok || !data.ok) {
        console.warn("Status order tidak ok", data);
        return;
      }

      if (!data.paid) {
        setPaymentStatus("Menunggu pembayaran...", "warning");
        return;
      }

      setPaymentStatus("Pembayaran diterima. Membuat panel otomatis...", "success");

      if (data.serverCreated && data.server) {
        clearInterval(state.pollingTimer);
        showServerInfo(data.server);
      }
    } catch (err) {
      console.error("Gagal cek status order:", err);
    }
  }

  function showServerInfo(server) {
    var section = document.getElementById("server-section");
    var container = document.getElementById("server-info");
    section.classList.remove("hidden");

    var panelUrl = server.panelUrl || "#";

    container.innerHTML = ""
      + '<div class="server-info-row">'
      + '  <div class="server-info-label">Panel URL</div>'
      + '  <div class="server-info-value"><a href="' + panelUrl + '" target="_blank" rel="noopener noreferrer">'
      + panelUrl + "</a></div>"
      + "</div>"
      + '<div class="server-info-row">'
      + '  <div class="server-info-label">Email Login</div>'
      + '  <div class="server-info-value"><code>' + (server.email || "-") + "</code></div>"
      + "</div>"
      + '<div class="server-info-row">'
      + '  <div class="server-info-label">Username</div>'
      + '  <div class="server-info-value"><code>' + (server.username || "-") + "</code></div>"
      + "</div>"
      + '<div class="server-info-row">'
      + '  <div class="server-info-label">Password Awal</div>'
      + '  <div class="server-info-value"><code>' + (server.password || "Silakan reset via panel") + "</code></div>"
      + "</div>"
      + '<div class="server-info-row">'
      + '  <div class="server-info-label">Plan</div>'
      + '  <div class="server-info-value">' + (server.planLabel || "-") + "</div>"
      + "</div>"
      + '<p style="margin-top:8px;font-size:12px;color:#6b7280;">Jika ada kendala atau error, silakan hubungi owner di '
      + '<a href="https://wa.me/6281239977516" target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p>';
  }
})();
