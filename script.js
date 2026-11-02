const mapEl = document.getElementById("map");
const panel = document.getElementById("panel");
const panelContent = document.getElementById("panel-content");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-panel");

let activePath = null;

mapEl.innerHTML = '<p style="padding: 2rem; text-align: center; color: #9aa0a6;">Загрузка карты...</p>';

const URLS = [
  "https://hub.mos.ru/gubinmaksim/true-russian-map/-/raw/main/rus_simple_highcharts.geo.json",
  "https://raw.githubusercontent.com/simp37/Russia_geoJSON/master/Russia.geojson",
  "https://cdn.jsdelivr.net/gh/simp37/Russia_geoJSON@master/Russia.geojson"
];

// Словарь: технический код региона -> нормальное русское название
const KEY_TO_RUS = {
  "ru-ad": "Республика Адыгея", "ru-al": "Республика Алтай", "ru-ba": "Республика Башкортостан",
  "ru-bu": "Республика Бурятия", "ru-da": "Республика Дагестан", "ru-in": "Республика Ингушетия",
  "ru-kb": "Кабардино-Балкарская Республика", "ru-kl": "Республика Калмыкия",
  "ru-kc": "Карачаево-Черкесская Республика", "ru-kr": "Республика Карелия", "ru-ko": "Республика Коми",
  "ru-cr": "Республика Крым", "ru-me": "Республика Марий Эл", "ru-mo": "Республика Мордовия",
  "ru-sa": "Республика Саха (Якутия)", "ru-se": "Республика Северная Осетия - Алания",
  "ru-ta": "Республика Татарстан", "ru-ty": "Республика Тыва", "ru-ud": "Удмуртская Республика",
  "ru-kk": "Республика Хакасия", "ru-ce": "Чеченская Республика", "ru-cu": "Чувашская Республика",
  "ru-alt": "Алтайский край", "ru-zab": "Забайкальский край", "ru-kam": "Камчатский край",
  "ru-kda": "Краснодарский край", "ru-kya": "Красноярский край", "ru-per": "Пермский край",
  "ru-pri": "Приморский край", "ru-sta": "Ставропольский край", "ru-kha": "Хабаровский край",
  "ru-amu": "Амурская область", "ru-ark": "Архангельская область", "ru-ast": "Астраханская область",
  "ru-bel": "Белгородская область", "ru-bry": "Брянская область", "ru-vla": "Владимирская область",
  "ru-vgg": "Волгоградская область", "ru-vlg": "Вологодская область", "ru-vor": "Воронежская область",
  "ru-iva": "Ивановская область", "ru-irk": "Иркутская область", "ru-kal": "Калининградская область",
  "ru-klu": "Калужская область", "ru-kem": "Кемеровская область - Кузбасс", "ru-kir": "Кировская область",
  "ru-kos": "Костромская область", "ru-kur": "Курганская область", "ru-krs": "Курская область",
  "ru-len": "Ленинградская область", "ru-lip": "Липецкая область", "ru-mag": "Магаданская область",
  "ru-mos": "Московская область", "ru-mur": "Мурманская область", "ru-niz": "Нижегородская область",
  "ru-nov": "Новгородская область", "ru-nvs": "Новосибирская область", "ru-oms": "Омская область",
  "ru-ore": "Оренбургская область", "ru-orl": "Орловская область", "ru-pen": "Пензенская область",
  "ru-psm": "Псковская область", "ru-ros": "Ростовская область", "ru-rya": "Рязанская область",
  "ru-sam": "Самарская область", "ru-sar": "Саратовская область", "ru-sak": "Сахалинская область",
  "ru-sve": "Свердловская область", "ru-smo": "Смоленская область", "ru-tam": "Тамбовская область",
  "ru-tve": "Тверская область", "ru-tom": "Томская область", "ru-tul": "Тульская область",
  "ru-tyu": "Тюменская область", "ru-uly": "Ульяновская область", "ru-che": "Челябинская область",
  "ru-yar": "Ярославская область", "ru-mow": "Москва", "ru-spe": "Санкт-Петербург",
  "ru-sev": "Севастополь", "ru-yev": "Еврейская автономная область",
  "ru-nen": "Ненецкий автономный округ", "ru-khm": "Ханты-Мансийский автономный округ - Югра",
  "ru-chu": "Чукотский автономный округ", "ru-yan": "Ямало-Ненецкий автономный округ"
};

async function loadMap() {
  for (let url of URLS) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      
      const geojson = await response.json();
      mapEl.innerHTML = '';
      drawMap(geojson);
      return; 
    } catch (e) {
      console.warn("Ошибка при загрузке:", e.message);
    }
  }
  mapEl.innerHTML = '<p style="padding: 2rem; text-align: center; color: #ff6b6b;">Ошибка загрузки карты.</p>';
}

loadMap();

function drawMap(geojson) {
  setTimeout(() => {
    const width = mapEl.clientWidth || 800;
    const height = mapEl.clientHeight || 600;

    const svg = d3.select("#map").append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const projection = d3.geoMercator()
      .rotate([-100, 0]) 
      .fitExtent([[40, 40], [width - 40, height - 40]], geojson);
    
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
  // Берем технический код региона (например, ru-mow)
  const key = feature.properties["hc-key"] || feature.properties.id || "";
  
  // Ищем нормальное русское название по этому коду
  let name = KEY_TO_RUS[key];
  
  // Если код неизвестен, пробуем взять хоть что-то
  if (!name) {
    const rawName = feature.properties.name || feature.properties.NAME_1 || "Неизвестный регион";
    name = rawName.includes("?") ? "Регион (" + key + ")" : rawName;
  }

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
