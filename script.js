const GEOJSON_URL =
  "https://raw.githubusercontent.com/wmgeolab/geoBoundaries/9469f09/releaseData/gbHumanitarian/RUS/ADM1/geoBoundaries-RUS-ADM1_simplified.geojson";

const mapEl = document.getElementById("map");
const panel = document.getElementById("panel");
const panelContent = document.getElementById("panel-content");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-panel");

let activePath = null;

// ---------- Загрузка карты ----------
d3.json(GEOJSON_URL).then((geojson) => {
  drawMap(geojson);
}).catch((err) => {
  mapEl.innerHTML =
    '<p style="padding:2rem;color:#9aa0a6">Не удалось загрузить карту. Проверьте подключение к интернету.</p>';
  console.error(err);
});

function drawMap(geojson) {
  const width = mapEl.clientWidth;
  const height = mapEl.clientHeight;

  const svg = d3
    .select("#map")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const projection = d3
    .geoMercator()
    .fitSize([width, height], geojson);

  const path = d3.geoPath().projection(projection);

  svg
    .selectAll("path")
    .data(geojson.features)
    .join("path")
    .attr("class", "region-path")
    .attr("d", path)
    .on("click", function (event, feature) {
      selectRegion(feature, this);
    });

  // Подписи для очень крупных регионов можно добавить позже
}

// ---------- Клик по региону ----------
function selectRegion(feature, pathElement) {
  const name = feature.properties.shapeName || "Неизвестный регион";
  const data = findRegionData(name);

  // Подсветка
  if (activePath) activePath.classList.remove("active");
  pathElement.classList.add("active");
  activePath = pathElement;

  renderPanel(name, data);
  openPanel();
}

function findRegionData(name) {
  if (REGION_DATA[name]) return REGION_DATA[name];

  // Нормализация: убираем лишние пробелы, скобки, меняем «—» на «-»
  const normalized = name
    .toLowerCase()
    .replace(/[—–]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  for (const key of Object.keys(REGION_DATA)) {
    const keyNorm = key
      .toLowerCase()
      .replace(/[—–]/g, "-")
      .replace(/\s+/g, " ")
      .trim();
    if (keyNorm === normalized) return REGION_DATA[key];
  }

  // Частичное совпадение (например, «Саха (Якутия)» vs «Республика Саха (Якутия)»)
  for (const key of Object.keys(REGION_DATA)) {
    const keyNorm = key.toLowerCase().replace(/[—–]/g, "-");
    if (keyNorm.includes(normalized) || normalized.includes(keyNorm)) {
      return REGION_DATA[key];
    }
  }

  return null;
}

// ---------- Рендер панели ----------
function renderPanel(name, data) {
  if (!data) {
    panelContent.innerHTML = `
      <h2>${escapeHtml(name)}</h2>
      <p style="color:var(--text-dim);margin-top:1rem">
        Данные по этому региону уточняются.
      </p>
    `;
    return;
  }

  const population = data.population
    ? formatNumber(data.population) + " чел."
    : "—";

  const area = data.area
    ? formatNumber(data.area) + " км²"
    : "—";

  const density =
    data.population && data.area
      ? (data.population / data.area).toFixed(1) + " чел./км²"
      : "—";

  const gdp = data.gdp
    ? formatNumber(data.gdp) + " млрд ₽"
    : "—";

  panelContent.innerHTML = `
    <h2>${escapeHtml(name)}</h2>
    <span class="region-type">${escapeHtml(data.type || "Регион")}</span>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="label">Население</div>
        <div class="value">${population}</div>
      </div>
      <div class="stat-card">
        <div class="label">Площадь</div>
        <div class="value">${area}</div>
      </div>
      <div class="stat-card">
        <div class="label">Плотность</div>
        <div class="value">${density}</div>
      </div>
      <div class="stat-card">
        <div class="label">ВРП</div>
        <div class="value">${gdp}</div>
      </div>
    </div>

    <div class="info-row">
      <span class="info-label">Административный центр</span>
      <span class="info-value">${escapeHtml(data.capital || "—")}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Федеральный округ</span>
      <span class="info-value">${escapeHtml(data.federalDistrict || "—")}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Часовой пояс</span>
      <span class="info-value">${escapeHtml(data.timezone || "—")}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Основной закон</span>
      <span class="info-value">${escapeHtml(data.law || "—")}</span>
    </div>
  `;
}

function openPanel() {
  panel.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function closePanel() {
  panel.classList.add("hidden");
  overlay.classList.add("hidden");
  if (activePath) {
    activePath.classList.remove("active");
    activePath = null;
  }
}

// ---------- Утилиты ----------
function formatNumber(n) {
  return new Intl.NumberFormat("ru-RU").format(n);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------- События ----------
closeBtn.addEventListener("click", closePanel);
overlay.addEventListener("click", closePanel);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePanel();
});

// Перерисовка при ресайзе (простая)
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const svg = document.querySelector("#map svg");
    if (!svg) return;
    const width = mapEl.clientWidth;
    const height = mapEl.clientHeight;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    // Перепроецировать без перезагрузки данных сложно, поэтому просто оставляем viewBox.
    // При сильном ресайзе можно перезагрузить страницу — для одностраничника это приемлемо.
  }, 250);
});
