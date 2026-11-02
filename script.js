const mapEl = document.getElementById("map");
const panel = document.getElementById("panel");
const panelContent = document.getElementById("panel-content");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-panel");

let activePath = null;

mapEl.innerHTML = '<p style="padding: 2rem; text-align: center; color: #9aa0a6;">Загрузка карты...</p>';

// Прямые рабочие ссылки на GeoJSON с регионами РФ (с русскими названиями)
const URLS = [
  "https://hub.mos.ru/gubinmaksim/true-russian-map/-/raw/main/rus_simple_highcharts.geo.json",
  "https://raw.githubusercontent.com/simp37/Russia_geoJSON/master/Russia.geojson",
  "https://cdn.jsdelivr.net/gh/simp37/Russia_geoJSON@master/Russia.geojson"
];

async function loadMap() {
  for (let url of URLS) {
    console.log("⏳ Пробую загрузить карту по ссылке:", url);
    try {
      const response = await fetch(url);
      console.log("📡 Ответ сервера:", response.status);
      
      if (!response.ok) continue;
      
      const geojson = await response.json();
      console.log("✅ Карта успешно загружена!");
      
      mapEl.innerHTML = '';
      drawMap(geojson);
      return; 
    } catch (e) {
      console.warn("❌ Ошибка при загрузке:", e.message);
    }
  }
  mapEl.innerHTML = '<p style="padding: 2rem; text-align: center; color: #ff6b6b;">Снова 404. Ссылки снова оказались битыми.</p>';
}

loadMap();

function drawMap(geojson) {
  setTimeout(() => {
    const width = mapEl.clientWidth || 800;
    const height = mapEl.clientHeight || 600;

    const svg = d3.select("#map").append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // В файле rus_simple_highcharts.geo.json координаты уже спроецированы (в метрах),
    // поэтому используем geoIdentity вместо geoMercator
    let projection;
    if (geojson.crs && geojson.crs.properties && geojson.crs.properties.name && geojson.crs.properties.name.includes("CRS84")) {
      projection = d3.geoMercator().fitSize([width - 20, height - 20], geojson);
    } else {
      // Для спроецированных координат (например, EPSG:3857 / Highcharts)
      projection = d3.geoIdentity().reflectY(true).fitSize([width - 20, height - 20], geojson);
    }

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
  const name = feature.properties.name || feature.properties.NAME_1 || "Неизвестный регион";
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

  panelContent.innerHTML = `
    <h2>${escapeHtml(name)}</h2>
    <span class="region-type">${escapeHtml(data.type || "Регион")}</span>
    <div class="stat-grid">
      <div class="stat-card"><div class="label">Население</div><div class="value">${population}</div></div>
      <div class="stat-card"><div class="label">Площадь</div><div class="value">${area}</div></div>
      <div class="stat-card"><div class="label">Плотность</div><div class="value">${density}</div></div>
    </div>
    <div class="info-row"><span class="info-label">Административный центр</span><span class="info-value">${escapeHtml(data.capital || "—")}</span></div>
    <div class="info-row"><span class="info-label">Федеральный округ</span><span class="info-value">${escapeHtml(data.federalDistrict || "—")}</span></div>
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
