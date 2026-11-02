const mapEl = document.getElementById("map");
const panel = document.getElementById("panel");
const panelContent = document.getElementById("panel-content");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-panel");

let activePath = null;

mapEl.innerHTML = '<p style="padding: 2rem; text-align: center; color: #9aa0a6;">Загрузка карты с сервера...</p>';

// Три разных сервера на случай блокировки
const URLS = [
  "https://cdn.jsdelivr.net/npm/@amcharts/amcharts4-geodata@4.1.29/russiaLow.json",
  "https://unpkg.com/@amcharts/amcharts4-geodata@4.1.29/russiaLow.json",
  "https://raw.githubusercontent.com/eu-geography/russia-geojson/master/russia.geojson"
];

async function loadMap() {
  for (let url of URLS) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const geojson = await response.json();
      mapEl.innerHTML = '';
      drawMap(geojson);
      return; // Если загрузилось, выходим из цикла
    } catch (e) {
      console.warn("Не удалось загрузить: " + url);
    }
  }
  // Если все три не сработали
  mapEl.innerHTML = '<p style="padding: 2rem; text-align: center; color: #ff6b6b;">Ошибка загрузки. Все сервера недоступны. Проверьте интернет.</p>';
}

loadMap();

function drawMap(geojson) {
  setTimeout(() => {
    const width = mapEl.clientWidth || 800;
    const height = mapEl.clientHeight || 600;

    const svg = d3.select("#map").append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const projection = d3.geoMercator().fitSize([width - 20, height - 20], geojson);
    const path = d3.geoPath().projection(projection);

    svg.selectAll("path")
      .data(geojson.features)
      .join("path")
      .attr("class", "region-path")
      .attr("d", path)
      .on("click", function (event, feature) {
        selectRegion(feature, this);
      });
  }, 100);
}

function selectRegion(feature, pathElement) {
  // Берем название региона из свойств карты
  const name = feature.properties.name || feature.properties.NAME || "Неизвестный регион";
  const data = findRegionData(name);

  if (activePath) activePath.classList.remove("active");
  pathElement.classList.add("active");
  activePath = pathElement;

  renderPanel(name, data);
  openPanel();
}

function findRegionData(name) {
  if (typeof REGION_DATA === "undefined") return null;
  if (REGION_DATA[name]) return REGION_DATA[name];

  // Умный поиск, если названия немного отличаются
  const normalized = name.toLowerCase().replace(/[—–]/g, "-").replace(/\s+/g, " ").trim();

  for (const key of Object.keys(REGION_DATA)) {
    const keyNorm = key.toLowerCase().replace(/[—–]/g, "-").replace(/\s+/g, " ").trim();
    if (keyNorm === normalized) return REGION_DATA[key];
  }
  
  for (const key of Object.keys(REGION_DATA)) {
    const keyNorm = key.toLowerCase().replace(/[—–]/g, "-");
    if (keyNorm.includes(normalized) || normalized.includes(keyNorm)) {
      return REGION_DATA[key];
    }
  }
  return null;
}

function renderPanel(name, data) {
  if (!data) {
    panelContent.innerHTML = `
      <h2>${escapeHtml(name)}</h2>
      <p style="color:var(--text-dim);margin-top:1rem">Данные по этому региону уточняются.</p>
    `;
    return;
  }

  const population = data.population ? formatNumber(data.population) + " чел." : "—";
  const area = data.area ? formatNumber(data.area) + " км²" : "—";
  const density = data.population && data.area ? (data.population / data.area).toFixed(1) + " чел./км²" : "—";
  const gdp = data.gdp ? formatNumber(data.gdp) + " млрд ₽" : "—";

  panelContent.innerHTML = `
    <h2>${escapeHtml(name)}</h2>
    <span class="region-type">${escapeHtml(data.type || "Регион")}</span>
    <div class="stat-grid">
      <div class="stat-card"><div class="label">Население</div><div class="value">${population}</div></div>
      <div class="stat-card"><div class="label">Площадь</div><div class="value">${area}</div></div>
      <div class="stat-card"><div class="label">Плотность</div><div class="value">${density}</div></div>
      <div class="stat-card"><div class="label">ВРП</div><div class="value">${gdp}</div></div>
    </div>
    <div class="info-row"><span class="info-label">Административный центр</span><span class="info-value">${escapeHtml(data.capital || "—")}</span></div>
    <div class="info-row"><span class="info-label">Федеральный округ</span><span class="info-value">${escapeHtml(data.federalDistrict || "—")}</span></div>
    <div class="info-row"><span class="info-label">Часовой пояс</span><span class="info-value">${escapeHtml(data.timezone || "—")}</span></div>
    <div class="info-row"><span class="info-label">Основной закон</span><span class="info-value">${escapeHtml(data.law || "—")}</span></div>
  `;
}

function openPanel() { panel.classList.remove("hidden"); overlay.classList.remove("hidden"); }
function closePanel() { panel.classList.add("hidden"); overlay.classList.add("hidden"); if (activePath) { activePath.classList.remove("active"); activePath = null; } }
function formatNumber(n) { return new Intl.NumberFormat("ru-RU").format(n); }
function escapeHtml(str) { return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

closeBtn.addEventListener("click", closePanel);
overlay.addEventListener("click", closePanel);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePanel(); });
