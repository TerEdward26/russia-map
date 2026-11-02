const mapEl = document.getElementById("map");
const panel = document.getElementById("panel");
const panelContent = document.getElementById("panel-content");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-panel");

let activePath = null;

mapEl.innerHTML = '<p style="padding: 2rem; text-align: center; color: #9aa0a6;">Загрузка карты с сервера...</p>';

// Словарь для перевода английских названий с карты на русские (как в regions.js)
const NAME_MAP = {
  "Adygea": "Республика Адыгея", "Altai": "Республика Алтай", "Bashkortostan": "Республика Башкортостан",
  "Buryatia": "Республика Бурятия", "Dagestan": "Республика Дагестан", "Ingushetia": "Республика Ингушетия",
  "Kabardino-Balkaria": "Кабардино-Балкарская Республика", "Kalmykia": "Республика Калмыкия",
  "Karachay-Cherkessia": "Карачаево-Черкесская Республика", "Karelia": "Республика Карелия", "Komi": "Республика Коми",
  "Crimea": "Республика Крым", "Mari El": "Республика Марий Эл", "Mordovia": "Республика Мордовия",
  "Sakha (Yakutia)": "Республика Саха (Якутия)", "North Ossetia-Alania": "Республика Северная Осетия - Алания",
  "Tatarstan": "Республика Татарстан", "Tyva": "Республика Тыва", "Udmurtia": "Удмуртская Республика",
  "Khakassia": "Республика Хакасия", "Chechnya": "Чеченская Республика", "Chuvashia": "Чувашская Республика",
  "Altai Krai": "Алтайский край", "Zabaykalsky Krai": "Забайкальский край", "Kamchatka Krai": "Камчатский край",
  "Krasnodar Krai": "Краснодарский край", "Krasnoyarsk Krai": "Красноярский край", "Perm Krai": "Пермский край",
  "Primorsky Krai": "Приморский край", "Stavropol Krai": "Ставропольский край", "Khabarovsk Krai": "Хабаровский край",
  "Amur Oblast": "Амурская область", "Arkhangelsk Oblast": "Архангельская область", "Astrakhan Oblast": "Астраханская область",
  "Belgorod Oblast": "Белгородская область", "Bryansk Oblast": "Брянская область", "Vladimir Oblast": "Владимирская область",
  "Volgograd Oblast": "Волгоградская область", "Vologda Oblast": "Вологодская область", "Voronezh Oblast": "Воронежская область",
  "Ivanovo Oblast": "Ивановская область", "Irkutsk Oblast": "Иркутская область", "Kaliningrad Oblast": "Калининградская область",
  "Kaluga Oblast": "Калужская область", "Kemerovo Oblast": "Кемеровская область - Кузбасс", "Kirov Oblast": "Кировская область",
  "Kostroma Oblast": "Костромская область", "Kurgan Oblast": "Курганская область", "Kursk Oblast": "Курская область",
  "Leningrad Oblast": "Ленинградская область", "Lipetsk Oblast": "Липецкая область", "Magadan Oblast": "Магаданская область",
  "Moscow Oblast": "Московская область", "Murmansk Oblast": "Мурманская область", "Nizhny Novgorod Oblast": "Нижегородская область",
  "Novgorod Oblast": "Новгородская область", "Novosibirsk Oblast": "Новосибирская область", "Omsk Oblast": "Омская область",
  "Orenburg Oblast": "Оренбургская область", "Oryol Oblast": "Орловская область", "Penza Oblast": "Пензенская область",
  "Pskov Oblast": "Псковская область", "Rostov Oblast": "Ростовская область", "Ryazan Oblast": "Рязанская область",
  "Samara Oblast": "Самарская область", "Saratov Oblast": "Саратовская область", "Sakhalin Oblast": "Сахалинская область",
  "Sverdlovsk Oblast": "Свердловская область", "Smolensk Oblast": "Смоленская область", "Tambov Oblast": "Тамбовская область",
  "Tver Oblast": "Тверская область", "Tomsk Oblast": "Томская область", "Tula Oblast": "Тульская область",
  "Tyumen Oblast": "Тюменская область", "Ulyanovsk Oblast": "Ульяновская область", "Chelyabinsk Oblast": "Челябинская область",
  "Yaroslavl Oblast": "Ярославская область", "Moscow": "Москва", "Saint Petersburg": "Санкт-Петербург",
  "Sevastopol": "Севастополь", "Jewish Autonomous Oblast": "Еврейская автономная область",
  "Nenets Autonomous Okrug": "Ненецкий автономный округ", "Khanty-Mansi Autonomous Okrug": "Ханты-Мансийский автономный округ - Югра",
  "Chukotka Autonomous Okrug": "Чукотский автономный округ", "Yamalo-Nenets Autonomous Okrug": "Ямало-Ненецкий автономный округ"
};

// Берем карту с супер-надежного сервера Highcharts
fetch("https://code.highcharts.com/mapdata/countries/ru/ru-all.geo.json")
  .then(res => res.json())
  .then(geojson => {
    mapEl.innerHTML = '';
    drawMap(geojson);
  })
  .catch(err => {
    mapEl.innerHTML = '<p style="padding: 2rem; text-align: center; color: #ff6b6b;">Ошибка загрузки. Проверьте интернет.</p>';
  });

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
  let rawName = feature.properties.name;
  let russianName = NAME_MAP[rawName] || rawName;
  
  let data = REGION_DATA[russianName];
  if (!data) {
    data = findRegionData(russianName);
  }

  if (activePath) activePath.classList.remove("active");
  pathElement.classList.add("active");
  activePath = pathElement;

  renderPanel(data ? russianName : rawName, data);
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
